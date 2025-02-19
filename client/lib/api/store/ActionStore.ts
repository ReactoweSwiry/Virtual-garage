import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import { create } from 'zustand';

import type { Action } from '../types';

const saveActionsToStorage = async (actions: Action[]) => {
  try {
    await AsyncStorage.setItem('actions', JSON.stringify(actions));
  } catch (error) {
    console.error('Error saving actions:', error);
  }
};

type ActionStore = {
  actions: Action[];
  addAction: (action: Omit<Action, 'id'>) => void;
  updateAction: (actionId: string, action: Partial<Action>) => void;
  removeAction: (actionId: string) => void;
  getActions: () => void;
  getActionsById: (carId: string) => Action[];
  getAction: (actionId: string) => Action | undefined;
};

export const useActionStore = create<ActionStore>((set, get) => ({
  actions: [],
  getActions: async () => {
    const storedActions = await AsyncStorage.getItem('actions');
    const actions: Action[] = storedActions
      ? JSON.parse(storedActions)
      : [];
    set({ actions });
  },
  getActionsById: (carId) => {
    return get().actions.filter((action) => action.carId === carId);
  },
  addAction: (action) => {
    set((state) => {
      const newAction = {
        id: nanoid(),
        ...action,
      };
      const newActions: Action[] = [...state.actions, newAction];
      saveActionsToStorage(newActions);
      return { actions: newActions };
    });
  },
  updateAction: (actionId, updatedAction) => {
    set((state) => {
      const newActions = state.actions.map((action) =>
        action.id === actionId ? { ...action, ...updatedAction } : action
      );
      console.log(newActions);
      saveActionsToStorage(newActions);
      return { actions: newActions };
    });
  },
  removeAction: (actionId) => {
    set((state) => {
      const newActions = state.actions.filter(
        (action) => action.id !== actionId
      );
      saveActionsToStorage(newActions);
      return { actions: newActions };
    });
  },
  getAction: (actionId) => {
    return get().actions.find((action) => action.id === actionId);
  },
}));
