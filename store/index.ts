import { create } from "zustand";
import { randomUUID } from "expo-crypto";

export const useLocationStore = create<UserLocation>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  targets: {},
  setUserLocation: (latitude, longitude, address) =>
    set({
      userAddress: address || null,
      userLatitude: latitude,
      userLongitude: longitude,
    }),
  addTarget: (latitude, longitude, address) =>
    set({
      targets: {
        [randomUUID()]: {
          address,
          longitude,
          latitude,
        },
      },
    }),
}));

export const useDirectionParameters = create<DirectionParameters>((set) => ({
  trafficZone: false,
  type: "car",
  setType: (type) => set({ type }),
  toggleTrafficZone: () => set((state)=>({ trafficZone:!state.trafficZone })),
}));
