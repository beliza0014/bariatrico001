# Audio System Operational Runbook

## 🚨 Emergency Response

### Complete Audio Failure

**Symptoms**: No sound across all users, error reports flooding in  
**Impact**: High - affects user experience quality  
**Response Time**: 15 minutes

#### Immediate Actions
1. **Check System Status**
   ```bash
   # CDN health check
   curl -I https://cdn.pixabay.com/download/audio/2023/03/25/audio_5c2e28.mp3
   
   # Local files check  
   curl -I https://yourapp.com/sounds/click.mp3
   ```

2. **Enable Emergency Fallback**
   ```javascript
   // Force all users to baked audio mode
   localStorage.setItem('sound_source_mode', 'baked-first');
   // Or push config change to force baked-first globally
   ```

3. **Monitor Error Rates**
   - Check browser console for `SOUND ERROR` messages
   - Monitor telemetry for `audio_source_used` events dropping

#### Recovery Steps
1. **Identify Root Cause**
   - CDN outage: Contact CDN provider
   - Local files: Check server/deployment issues
   - Browser compatibility: Check recent browser updates

2. **Apply Fix**
   - CDN issue: Switch to backup CDN or local files
   - Server issue: Redeploy with correct assets
   - Browser issue: Update baked audio generation

3. **Validate Recovery**
   - Test audio on affected browser/device combinations
   - Verify telemetry shows normal usage patterns

### iOS Audio Stuck

**Symptoms**: iOS users report "tap to activate" not working  
**Impact**: Medium - affects iOS users only  
**Response Time**: 30 minutes

#### Diagnosis Commands
```javascript
// Check iOS unlock status (dev console)
console.log('Audio Context State:', audioContext?.state);
console.log('Is Unlocked:', localStorage.getItem('audio_activated'));

// Manual unlock attempt  
audioContext?.resume().then(() => console.log('Unlocked'));
```

#### Quick Fixes
1. **Clear iOS Audio Cache**
   ```javascript
   localStorage.removeItem('audio_activated');
   location.reload();
   ```

2. **Alternative Unlock Method**
   ```javascript
   // Create silent audio to unlock
   const ctx = new AudioContext();
   const osc = ctx.createOscillator();
   const gain = ctx.createGain();
   gain.gain.value = 0;
   osc.connect(gain).connect(ctx.destination);
   osc.start();osc.stop(ctx.currentTime + 0.01);
   ```

## 🔧 Common Issues & Solutions

### High Audio Latency

**Symptom**: Sounds play >300ms after user action  
**Likely Causes**: Network issues, large audio files, CPU overload

#### Investigation Steps
```bash
# Check audio file sizes
ls -la public/sounds/
# Files should be <500KB each

# Network timing test
curl -w "@curl-format.txt" https://cdn.pixabay.com/download/audio/2023/03/25/audio_5c2e28.mp3
```

#### Solutions
```javascript
// Force immediate baked audio
localStorage.setItem('sound_source_mode', 'baked-first');

// Check if preloading is working
console.log('Buffer Load Progress:', window.soundContext?.bufferLoadProgress);

// Measure actual latency
const start = performance.now();
window.soundContext?.playButtonClick();
console.log('Latency:', performance.now() - start, 'ms');
```

### Audio Stuttering/Glitches

**Symptom**: Choppy or distorted sound playback  
**Likely Causes**: CPU overload, memory pressure, audio buffer underruns

#### Quick Diagnosis  
```javascript
// Check CPU usage impact
console.time('audio-render');
window.soundContext?.playVictorySequence();
console.timeEnd('audio-render');

// Memory usage check
console.log('Audio Buffers Size:', 
  Array.from(window.soundContext?.audioBuffers.entries() || [])
    .reduce((size, [key, data]) => size + data.buffer.byteLength, 0)
);
```

#### Solutions
1. **Reduce Quality**: Switch to baked audio (smaller buffers)
2. **Clear Buffers**: Reload page to reset audio memory
3. **Check Competing Audio**: Close other audio applications

### Volume Issues  

**Symptom**: Sounds too loud, too quiet, or unbalanced  
**Likely Causes**: Category mixing wrong, user volume settings, device limits

#### Volume Debugging
```javascript
// Check current volume settings
console.log('Master Volume:', window.soundContext?.masterVolume);
console.log('Category Volumes:', {
  ui: 0.8,      // -6dB
  feedback: 1.0, // -3dB  
  special: 0.9   // 0dB
});

// Test category playback
window.soundContext?.playButtonClick();    // UI category
window.soundContext?.playCorrectAnswer();  // Feedback category  
window.soundContext?.playEnhancedConfettiCelebration(); // Special category
```

## 🏥 Health Monitoring

### Daily Health Checks

Run these commands to verify system health:

```javascript
// Full system health check
if (window.soundContext?.runFullHealthcheck) {
  window.soundContext.runFullHealthcheck().then(report => {
    console.log('=== DAILY AUDIO HEALTH ===');
    console.log('Sounds Working:', report.summary.ok, '/', report.summary.total);
    console.log('Fallback Usage:', report.summary.fallback);
    console.log('Errors:', report.summary.error);
    console.log('Production Ready:', report.summary.error === 0 && report.summary.ok >= 7);
  });
}
```

### Telemetry Analysis

#### Key Metrics to Monitor
```sql
-- Audio source distribution (if database available)
SELECT origin, COUNT(*) as usage_count 
FROM audio_telemetry 
WHERE timestamp > NOW() - INTERVAL 24 HOUR
GROUP BY origin;

-- Expected results:
-- file: 70-80% (good network)
-- cdn: 10-20% (local file issues)  
-- baked: 5-10% (fallback working)
```

#### Warning Thresholds
- **Baked Audio >30%**: Investigate file/CDN availability
- **Error Rate >5%**: Check browser compatibility  
- **iOS Unlock Failure >10%**: iOS interaction issues

### Performance Baselines  

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Desktop Latency | <120ms | >200ms | >500ms |
| Mobile Latency | <180ms | >300ms | >800ms |  
| Memory Usage | <3MB | >5MB | >10MB |
| CPU Usage | <5% | >10% | >20% |
| Error Rate | <1% | >5% | >15% |

## 🔧 Maintenance Commands

### Reset User Audio Settings
```javascript
// Clear all audio preferences for troubleshooting
['quiz_audio_prefs', 'gamified_audio_enabled', 'audio_activated', 
 'sound_source_mode'].forEach(key => localStorage.removeItem(key));
```

### Force Audio Mode Changes
```javascript
// Emergency: Switch all users to baked audio
localStorage.setItem('sound_source_mode', 'baked-first');

// Development: Enable full fallback chain  
localStorage.setItem('sound_source_mode', 'auto');

// Silent mode: Disable all audio
localStorage.setItem('quiz_audio_prefs', JSON.stringify({
  enabled: false, muted: true, masterVolume: 0
}));
```

### Debug Mode Activation
```javascript
// Enable verbose logging (dev only)
localStorage.setItem('audio_debug_verbose', 'true');

// Show diagnostic panels (dev builds only)  
localStorage.setItem('show_audio_diagnostics', 'true');
```

## 📱 Device-Specific Runbooks

### iOS Troubleshooting
```bash
# Common iOS issues and solutions
1. Audio won't start:
   - Check if gesture unlock prompt visible
   - Try different interaction (tap, scroll, button press)
   - Clear audio_activated from localStorage

2. Audio cuts out during app switching:
   - Expected behavior due to iOS audio management
   - Audio will restart on return to app
   
3. No spatial effects:
   - iOS uses stereo panning instead of HRTF
   - This is normal and expected
```

### Android Troubleshooting  
```bash
# Android-specific checks
1. Audio delays on older devices:
   - Force baked-first mode for faster loading
   - Reduce quality settings if needed
   
2. Chrome autoplay issues:
   - Ensure user gesture occurred
   - Check chrome://settings/content/sound
```

## 📊 Incident Response Playbook

### Severity Levels

**P0 - Critical**: Complete audio failure affecting >90% users
- **Response**: Immediate (5 minutes)
- **Actions**: Enable baked fallback, investigate CDN/server issues

**P1 - High**: Audio issues affecting >50% users or all iOS users  
- **Response**: Within 15 minutes
- **Actions**: Identify affected platform, apply targeted fix

**P2 - Medium**: Audio glitches, latency issues affecting <50% users
- **Response**: Within 1 hour
- **Actions**: Investigate performance, apply optimizations

**P3 - Low**: Minor quality issues, specific device problems
- **Response**: Within 4 hours  
- **Actions**: Document issue, plan fix for next release

### Escalation Paths
1. **On-call Engineer**: First response, applies quick fixes
2. **Audio System Lead**: Deep investigation, code changes
3. **Platform Team**: Infrastructure issues, CDN problems
4. **Product Team**: User experience impact assessment

---

**Runbook Version**: 1.0  
**Audio System**: v1.0.0  
**Last Updated**: August 20, 2025  
**Next Review**: September 20, 2025