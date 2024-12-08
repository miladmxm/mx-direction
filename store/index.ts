import { create } from "zustand";

export const useLocationStore = create<UserLocation>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  setUserLocation: (latitude, longitude, address) =>
    set({
      userAddress: address || null,
      userLatitude: latitude,
      userLongitude: longitude,
    }),
}));
