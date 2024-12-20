import { create } from "zustand";
import { randomUUID } from "expo-crypto";

export const useLocationStore = create<UserLocation>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  targets: {},
  setUserLocation: (latitude, longitude, address) =>
    set({
      userAddress: address,
      userLatitude: latitude,
      userLongitude: longitude,
    }),
  removeTarget: (targetId) =>
    set((state) => {
      const { [targetId]: deletedItem, ...newTargets } = state.targets;
      return { targets: newTargets };
    }),
  clearTargets: () => set({ targets: {} }),
  setTarget: (latitude, longitude, address) =>
    set({
      targets: {
        [randomUUID()]: {
          address,
          longitude,
          latitude,
        },
      },
    }),
  addTarget: (latitude, longitude, address) =>
    set((state) => ({
      targets: {
        ...state.targets,
        [randomUUID()]: {
          address,
          longitude,
          latitude,
        },
      },
    })),
}));

export const useDirectionParameters = create<DirectionParameters>((set) => ({
  trafficZone: false,
  oddEvenZone: false,
  type: "car",
  setType: (type) => set({ type }),
  toggleTrafficZone: () =>
    set((state) => ({ trafficZone: !state.trafficZone })),
  toggleOddEvenZone: () =>
    set((state) => ({ oddEvenZone: !state.oddEvenZone })),
}));
