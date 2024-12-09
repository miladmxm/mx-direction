import axios from "axios";

// axios.defaults
axios.defaults.baseURL = process.env.EXPO_PUBLIC_NESHAN_API_ADDRESS;
axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
axios.defaults.headers.common["accept"] = "application/json";
axios.defaults.headers.common["Api-Key"] =
  process.env.EXPO_PUBLIC_NESHAN_ACCESS_TOKEN;

export const getAddressByLocation = (
  lat: string | number,
  lon: string | number
) => axios.get(`v5/reverse?lat=${lat}&lng=${lon}`);

export const searchLocation = (
  lat: string | number,
  lon: string | number,
  term: string
) => axios.get(`v1/search?term=${term}&lat=${lat}&lng=${lon}`);