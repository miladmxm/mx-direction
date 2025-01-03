import axios from "axios";

// axios.defaults
axios.defaults.baseURL = process.env.EXPO_PUBLIC_NESHAN_API_ADDRESS;
axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
axios.defaults.headers.common["accept"] = "application/json";
axios.defaults.headers.common["Api-Key"] =
  process.env.EXPO_PUBLIC_NESHAN_ACCESS_TOKEN;

export const getAddressByLocation = (
  lat: string | number,
  lon: string | number,
  signal?: AbortSignal
) => axios.get(`v5/reverse?lat=${lat}&lng=${lon}`, { signal });

export const searchLocation = (
  lat: string | number,
  lon: string | number,
  term: string,
  signal: AbortSignal
) => axios.get(`v1/search?term=${term}&lat=${lat}&lng=${lon}`, { signal });

export const getDirectionsPath = (
  {
    destination,
    origin,
    type,
    waypoints,
    avoidTrafficZone,
    avoidOddEvenZone,
  }: {
    origin: string;
    destination: string;
    waypoints?: string | null;
    type: DirectionType;
    avoidTrafficZone: boolean;
    avoidOddEvenZone: boolean;
  },
  signal: AbortSignal
) =>
  axios.get("v4/direction", {
    params: {
      origin,
      destination,
      type,
      avoidTrafficZone,
      avoidOddEvenZone,
      waypoints,
    },
    signal: signal,
  });

export const getTSP = (
  { waypoints }: { waypoints: string },
  signal: AbortSignal
) =>
  axios.get(`v3/trip`, {
    params: {
      waypoints,
      roundTrip: false,
      sourcelsAnyPoint: false,
      lastlsAnyPoint: false,
    },
    signal,
  });
