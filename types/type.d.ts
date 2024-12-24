declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

type AddressObject = {
  city: string;
  county: string;
  district: string;
  formatted_address: string;
  in_odd_even_zone: boolean;
  in_traffic_zone: boolean;
  neighbourhood: string;
  place: string | null;
  route_name: string;
  route_type: string;
  state: string;
  status: string;
};
type TargetType = {
  latitude: number;
  longitude: number;
  address: AddressObject | null;
};
declare interface UserLocation {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: AddressObject | null;
  targets: {
    [key: string]: TargetType;
  };
  addTarget: (
    latitude: number,
    longitude: number,
    address: AddressObject | null,
    id?: string
  ) => void;
  setTarget: (
    latitude: number,
    longitude: number,
    address: AddressObject | null,
    id?: string
  ) => void;
  setUserLocation: (
    latitude: number,
    longitude: number,
    address: AddressObject | null
  ) => void;
  removeTarget: (targetId: string) => void;
  clearTargets: () => void;
}

declare interface AddressResult {
  address: string;
  category: string;
  location: { x: number; y: number };
  region: string;
  title: string;
  type: string;
}

type DirectionType = "motorcycle" | "car";
declare interface DirectionParameters {
  type: DirectionType;
  trafficZone: boolean;
  oddEvenZone: boolean;
  setType: (type: DirectionType) => void;
  toggleTrafficZone: () => void;
  toggleOddEvenZone: () => void;
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
