declare interface UserLocation {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress?: string | null;
  setUserLocation: (
    latitude: number,
    longitude: number,
    address?: string
  ) => void;
}
declare interface GeoJson {
  type: string;
  features: {
    type: string;
    geometry: { type: string; coordinates: [number, number] };
    properties: {
      title: string;
      description: string;
    };
  }[];
}
