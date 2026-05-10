import { create } from 'zustand';

export const useTriageStore = create((set) => ({
  queue: [],
  alerts: [],
  setQueue: (queue) => set({ queue }),
  setAlerts: (alerts) => set({ alerts }),
}));

export const usePatientStore = create((set) => ({
  currentPatient: null,
  patients: [],
  setCurrentPatient: (patient) => set({ currentPatient: patient }),
  setPatients: (patients) => set({ patients }),
}));

export const useAnalysisStore = create((set) => ({
  analyses: [],
  currentAnalysis: null,
  setAnalyses: (analyses) => set({ analyses }),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
}));

export const useOfflineStore = create((set) => ({
  isOffline: false,
  syncQueue: [],
  setOffline: (isOffline) => set({ isOffline }),
  addToSyncQueue: (item) => set((state) => ({ syncQueue: [...state.syncQueue, item] })),
  clearSyncQueue: () => set({ syncQueue: [] }),
}));
