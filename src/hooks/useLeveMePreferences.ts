import { useState, useCallback } from 'react';

export type PlanIntensity = 'quick' | 'comfortable';
export type PreferredSlot = 'morning' | 'afternoon' | 'night';
export type Dose = 'light' | 'standard';

export interface LeveMePreferences {
  plan_intensity: PlanIntensity | null;
  preferred_slot: PreferredSlot | null;
  dose: Dose | null;
  reminders_optin: boolean | null;
}

const STORAGE_KEYS = {
  PLAN_INTENSITY: 'leveme_plan_intensity',
  PREFERRED_SLOT: 'leveme_preferred_slot',
  DOSE: 'leveme_dose',
  REMINDERS_OPTIN: 'leveme_reminders_optin',
} as const;

export const useLeveMePreferences = () => {
  const [preferences, setPreferences] = useState<LeveMePreferences>(() => ({
    plan_intensity: localStorage.getItem(STORAGE_KEYS.PLAN_INTENSITY) as PlanIntensity || null,
    preferred_slot: localStorage.getItem(STORAGE_KEYS.PREFERRED_SLOT) as PreferredSlot || null,
    dose: localStorage.getItem(STORAGE_KEYS.DOSE) as Dose || null,
    reminders_optin: localStorage.getItem(STORAGE_KEYS.REMINDERS_OPTIN) === 'true' ? true : 
                     localStorage.getItem(STORAGE_KEYS.REMINDERS_OPTIN) === 'false' ? false : null,
  }));

  const setPlanIntensity = useCallback((intensity: PlanIntensity) => {
    localStorage.setItem(STORAGE_KEYS.PLAN_INTENSITY, intensity);
    setPreferences(prev => ({ ...prev, plan_intensity: intensity }));
  }, []);

  const setPreferredSlot = useCallback((slot: PreferredSlot) => {
    localStorage.setItem(STORAGE_KEYS.PREFERRED_SLOT, slot);
    setPreferences(prev => ({ ...prev, preferred_slot: slot }));
  }, []);

  const setDose = useCallback((dose: Dose) => {
    localStorage.setItem(STORAGE_KEYS.DOSE, dose);
    setPreferences(prev => ({ ...prev, dose }));
  }, []);

  const setRemindersOptin = useCallback((optin: boolean) => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS_OPTIN, optin.toString());
    setPreferences(prev => ({ ...prev, reminders_optin: optin }));
  }, []);

  const readPreferences = useCallback((): LeveMePreferences => {
    return {
      plan_intensity: localStorage.getItem(STORAGE_KEYS.PLAN_INTENSITY) as PlanIntensity || null,
      preferred_slot: localStorage.getItem(STORAGE_KEYS.PREFERRED_SLOT) as PreferredSlot || null,
      dose: localStorage.getItem(STORAGE_KEYS.DOSE) as Dose || null,
      reminders_optin: localStorage.getItem(STORAGE_KEYS.REMINDERS_OPTIN) === 'true' ? true : 
                       localStorage.getItem(STORAGE_KEYS.REMINDERS_OPTIN) === 'false' ? false : null,
    };
  }, []);

  return {
    preferences,
    setPlanIntensity,
    setPreferredSlot,
    setDose,
    setRemindersOptin,
    readPreferences,
  };
};