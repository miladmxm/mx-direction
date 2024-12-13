declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare interface UserLocation {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress?: string | null;
  targets: {
    [key: string]: { latitude: number; longitude: number; address: string };
  };
  addTarget: (latitude: number, longitude: number, address: string) => void;
  setUserLocation: (
    latitude: number,
    longitude: number,
    address?: string
  ) => void;
}

declare interface AddressResult {
  address: string;
  category: string;
  location: { x: number; y: number };
  region: string;
  title: string;
  type: string;
}

declare type LngLat = [number, number];

type DistanceDuration = {
  value: number;
  text: string;
};

declare interface RoutingResponse {
  routes: {
    overview_polyline: { points: string };
    legs: {
      summary: string;
      distance: DistanceDuration;
      duration: DistanceDuration;
      steps: {
        name: string;
        instruction: string;
        bearing_after: number;
        rotaryName?: string;
        type: string;
        distance: DistanceDuration;
        exit?: number;
        modifier?: string;
        duration: DistanceDuration;
        polyline: string;
        start_location: [number, number];
      }[];
    }[];
  }[];
}

declare interface GeoJson {
  type: string;
  features: {
    type: string;
    geometry: {
      type: string;
      coordinates: [number, number][][] | [number, number][];
    };
    properties?: {
      title: string;
      description: string;
    };
  }[];
}
