import { useState, useEffect } from 'react';
import { 
  AB_EXPERIMENTS, 
  AB_KILL_SWITCH, 
  getExperimentVariant 
} from '@/config/globalConstants';

export interface ExperimentVariant {
  name: string;
  variant: 'control' | 'variant';
  config: any;
  isActive: boolean;
}

export const useABExperiments = (userId?: string) => {
  const [experiments, setExperiments] = useState<Record<string, ExperimentVariant>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadExperiments = () => {
      const experimentResults: Record<string, ExperimentVariant> = {};

      // Global kill switch
      if (AB_KILL_SWITCH.GLOBAL_DISABLE) {
        setExperiments({});
        setIsLoaded(true);
        return;
      }

      // Wave 1 experiments (ACTIVE)
      if (!AB_KILL_SWITCH.WAVE_1_DISABLE) {
        // VSL Gate Timing
        if (AB_EXPERIMENTS.WAVE_1.VSL_GATE_TIMING.active) {
          const variant = getExperimentVariant('vsl_gate_timing', userId);
          experimentResults.vsl_gate_timing = {
            name: 'vsl_gate_timing',
            variant: variant as 'control' | 'variant',
            config: AB_EXPERIMENTS.WAVE_1.VSL_GATE_TIMING.variants[variant as keyof typeof AB_EXPERIMENTS.WAVE_1.VSL_GATE_TIMING.variants],
            isActive: true
          };
        }

        // Sticky CTA Compare
        if (AB_EXPERIMENTS.WAVE_1.STICKY_CTA_COMPARE.active) {
          const variant = getExperimentVariant('sticky_cta_compare', userId);
          experimentResults.sticky_cta_compare = {
            name: 'sticky_cta_compare',
            variant: variant as 'control' | 'variant',
            config: AB_EXPERIMENTS.WAVE_1.STICKY_CTA_COMPARE.variants[variant as keyof typeof AB_EXPERIMENTS.WAVE_1.STICKY_CTA_COMPARE.variants],
            isActive: true
          };
        }

        // P01 Headline Variant
        if (AB_EXPERIMENTS.WAVE_1.P01_HEADLINE_VARIANT?.active) {
          const variant = getExperimentVariant('p01_headline_variant', userId);
          experimentResults.p01_headline_variant = {
            name: 'p01_headline_variant',
            variant: variant as 'control' | 'variant',
            config: AB_EXPERIMENTS.WAVE_1.P01_HEADLINE_VARIANT.variants[variant as keyof typeof AB_EXPERIMENTS.WAVE_1.P01_HEADLINE_VARIANT.variants],
            isActive: true
          };
        }

        // P01 CTA Copy
        if (AB_EXPERIMENTS.WAVE_1.P01_CTA_COPY?.active) {
          const variant = getExperimentVariant('p01_cta_copy', userId);
          experimentResults.p01_cta_copy = {
            name: 'p01_cta_copy',
            variant: variant as 'control' | 'variant',
            config: AB_EXPERIMENTS.WAVE_1.P01_CTA_COPY.variants[variant as keyof typeof AB_EXPERIMENTS.WAVE_1.P01_CTA_COPY.variants],
            isActive: true
          };
        }
      }

      // Wave 2 experiments (DISABLED by default)
      if (!AB_KILL_SWITCH.WAVE_2_DISABLE) {
        // Show Price Pre Video (preparado, mas desativado)
        if (AB_EXPERIMENTS.WAVE_2.SHOW_PRICE_PRE_VIDEO.active) {
          const variant = getExperimentVariant('show_price_prevideo', userId);
          experimentResults.show_price_prevideo = {
            name: 'show_price_prevideo',
            variant: variant as 'control' | 'variant',
            config: AB_EXPERIMENTS.WAVE_2.SHOW_PRICE_PRE_VIDEO.variants[variant as keyof typeof AB_EXPERIMENTS.WAVE_2.SHOW_PRICE_PRE_VIDEO.variants],
            isActive: true
          };
        }

        // Testimonial Style (preparado, mas desativado)
        if (AB_EXPERIMENTS.WAVE_2.TESTIMONIAL_STYLE.active) {
          const variant = getExperimentVariant('testimonial_style', userId);
          experimentResults.testimonial_style = {
            name: 'testimonial_style',
            variant: variant as 'control' | 'variant',
            config: AB_EXPERIMENTS.WAVE_2.TESTIMONIAL_STYLE.variants[variant as keyof typeof AB_EXPERIMENTS.WAVE_2.TESTIMONIAL_STYLE.variants],
            isActive: true
          };
        }
      }

      setExperiments(experimentResults);
      setIsLoaded(true);

      // Track experiment assignments
      Object.entries(experimentResults).forEach(([name, experiment]) => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'experiment_assigned', {
            experiment_name: name,
            experiment_variant: experiment.variant,
            experiment_config: experiment.config.label,
            user_id: userId
          });
        }
      });
    };

    loadExperiments();
  }, [userId]);

  // Helper functions
  const getExperiment = (name: string): ExperimentVariant | null => {
    return experiments[name] || null;
  };

  const isVariant = (experimentName: string): boolean => {
    const experiment = getExperiment(experimentName);
    return experiment?.variant === 'variant' && experiment?.isActive === true;
  };

  const getConfig = (experimentName: string, key?: string): any => {
    const experiment = getExperiment(experimentName);
    if (!experiment) return null;
    
    return key ? experiment.config[key] : experiment.config;
  };

  const trackExperimentEvent = (experimentName: string, eventName: string, additionalData = {}) => {
    const experiment = getExperiment(experimentName);
    if (!experiment) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', `experiment_${eventName}`, {
        experiment_name: experimentName,
        experiment_variant: experiment.variant,
        experiment_config: experiment.config.label,
        ...additionalData
      });
    }
  };

  return {
    experiments,
    isLoaded,
    getExperiment,
    isVariant,
    getConfig,
    trackExperimentEvent,
    // Specific experiment helpers
    vslGateTiming: getConfig('vsl_gate_timing', 'timing') || 9000,
    stickyCTAEnabled: isVariant('sticky_cta_compare'),
    showPricePreVideo: isVariant('show_price_prevideo'),
    testimonialStyle: getConfig('testimonial_style', 'style') || 'card',
    // P01 Landing optimized A/B variants
    p01HeadlineText: getConfig('p01_headline_variant', 'h1') || "Ritual de chá de 3 minutos que tem ajudado mulheres a secar até 4 kg em até 30 dias",
    p01CTAText: getConfig('p01_cta_copy', 'cta') || "VER MINHA RECEITA AGORA",
    p01HeadlineVariant: getConfig('p01_headline_variant', 'label') || 'secar_4kg',
    p01CTAVariant: getConfig('p01_cta_copy', 'label') || 'ver_receita_cta'
  };
};