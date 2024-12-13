import { useEffect, useState } from "react";
import * as Location from "expo-location";

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  async function getAccessLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status) {
      const userLocation = await Location.getCurrentPositionAsync();
      setLocation(userLocation);
      return userLocation
    } else {
      setLocation(null);
    }
  }
  useEffect(() => {
    getAccessLocation();
  }, []);

  return { location, getAccessLocation };
}
