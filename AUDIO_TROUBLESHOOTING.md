# Audio System Troubleshooting Guide

## 🚨 Quick Diagnosis

### No Sound Playing

#### iOS Devices
**Symptom**: Complete silence on iPhone/iPad  
**Cause**: Audio context not unlocked  
**Solution**:
1. Look for "🔓 Ativar Áudio iOS" button
2. Tap any button or interact with the page
3. Check if unlock status shows "🔓 Desbloqueado"

```javascript
// Manual unlock (dev console)
await window.soundContext.initializeAudioOnUserGesture();
```

#### All Devices
**Symptom**: No audio after interaction  
**Cause**: Sound disabled or volume issues  
**Solution**:
1. Check volume slider is not at 0%
2. Verify sound toggle is enabled (not ❌)
3. Ensure page has focus (click somewhere first)

### Audio Stuttering or Glitches

**Symptom**: Choppy or distorted playback  
**Cause**: Buffer underruns or high CPU usage  
**Solution**:
1. Close other audio applications
2. Check CPU usage in task manager
3. Try "baked-first" mode for faster loading

```javascript
// Switch to baked-first mode (dev console)
localStorage.setItem('sound_source_mode', 'baked-first');  
location.reload();
```

### Long Audio Delays

**Symptom**: >300ms delay from click to sound  
**Cause**: Network loading or large audio files  
**Solution**:
1. Wait for loading progress to complete (100%)
2. Check network connection
3. Force fallback to baked samples

## 🔧 Step-by-Step Troubleshooting

### Step 1: Check System Status
1. Open browser dev tools (F12)
2. Look for audio system logs starting with `🎵` or `🔊`
3. Check for red error messages

### Step 2: Reset Audio Preferences
```javascript
// Clear all audio settings (dev console)
localStorage.removeItem('quiz_audio_prefs');
localStorage.removeItem('audio_activated');
localStorage.removeItem('sound_source_mode');
location.reload();
```

### Step 3: Force Baked Audio Mode
```javascript
// Use only generated samples (dev console)
localStorage.setItem('sound_source_mode', 'baked-first');
location.reload();
```

### Step 4: Manual Audio Context Unlock
```javascript
// Force unlock audio context (dev console)
if (window.AudioContext) {
  const ctx = new AudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume().then(() => console.log('Audio unlocked'));
  }
}
```

## 📱 Device-Specific Issues

### iOS Safari

#### Problem: Audio doesn't start after app switch
**Solution**: Tap screen once to reactivate audio context

#### Problem: First sound has long delay
**Solution**: Enable "baked-first" mode for immediate audio

#### Problem: No spatial audio effects
**Expected**: iOS uses stereo panning instead of HRTF

### Android Chrome

#### Problem: Audio cuts out during page transitions
**Solution**: Avoid navigation during active sound playback

#### Problem: Volume controls don't work
**Solution**: Check system volume and browser audio permissions

### Desktop Browsers

#### Problem: CORS errors in console
**Solution**: Serve app from HTTP server, not `file://` protocol

#### Problem: Multiple tab interference
**Solution**: Only one tab should have audio active at a time

## 🔍 Advanced Diagnostics

### Enable Debug Mode
1. Open developer tools
2. Go to `Application > Local Storage`
3. Set `NODE_ENV` to `development` (if available)
4. Reload page to see full diagnostics panel

### Audio Buffer Inspection
```javascript
// Check loaded audio buffers (dev console)
console.table(Array.from(window.soundContext.audioBuffers.entries()).map(([key, data]) => ({
  soundKey: key,
  source: data.source,
  duration: Math.round(data.buffer.duration * 1000) + 'ms',
  sampleRate: data.buffer.sampleRate
})));
```

### Performance Analysis
```javascript
// Measure audio latency (dev console)
const start = performance.now();
window.soundContext.playButtonClick();
console.log('Click latency:', performance.now() - start, 'ms');
```

## 🏥 Emergency Recovery

### Complete Audio System Reset
```javascript
// Nuclear option - full reset (dev console)
['quiz_audio_prefs', 'gamified_audio_enabled', 'audio_activated', 
 'sound_source_mode'].forEach(key => localStorage.removeItem(key));

// Clear any cached audio contexts
if (window.audioContext) {
  window.audioContext.close();
  delete window.audioContext;
}

location.reload();
```

### Fallback to Silent Mode
```javascript
// Disable all audio (dev console)
localStorage.setItem('quiz_audio_prefs', JSON.stringify({
  enabled: false,
  muted: true,
  masterVolume: 0
}));
location.reload();
```

## 📊 Common Error Codes

### Browser Console Messages

| Message | Meaning | Action |
|---------|---------|---------|
| `AudioContext creation failed` | Browser doesn't support Web Audio | Use modern browser |
| `Sound buffer not found: [key]` | Audio file failed to load | Check network/CDN |
| `iOS audio unlock failed` | Gesture unlock didn't work | Try different interaction |
| `SOUND FALLBACK [key] file→cdn→baked` | Using backup audio | Normal, check file availability |
| `SOUND ERROR [key] [error]` | Complete sound failure | Check troubleshooting steps |

### Network Tab Issues

| Status | URL Pattern | Issue |
|--------|-------------|-------|
| 404 | `/sounds/*.mp3` | Local audio files missing |
| CORS | `cdn.pixabay.com` | External CDN blocked |
| Timeout | Any audio URL | Network connectivity |

## 🔒 Privacy & Permissions

### Microphone Warnings
**Note**: Audio system does NOT request microphone access. If prompted, deny safely.

### Autoplay Policies
- All modern browsers block autoplay audio
- System requires user gesture first
- This is normal and expected behavior

## 📞 Developer Support

### Enable Verbose Logging
```javascript
// Maximum debug output (dev console)
localStorage.setItem('audio_debug_verbose', 'true');
location.reload();
```

### Health Check Report
```javascript
// Generate diagnostic report (dev console)
if (window.soundContext?.runFullHealthcheck) {
  window.soundContext.runFullHealthcheck().then(report => {
    console.log('=== AUDIO HEALTH REPORT ===');
    console.table(report.selfTestResults);
    console.log('Production Ready:', report.summary.error === 0);
  });
}
```

---

**Last Updated**: August 20, 2025  
**Covers**: Audio System v1.0.0  
**Support**: Check console logs first, then follow step-by-step guide