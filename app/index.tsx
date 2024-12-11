import { View, TextInput, TouchableOpacity, Button } from "react-native";
import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import "@/global.css";
import Map, { type MapComponentRef } from "@/components/Map";
import { useLocationStore } from "@/store";
import { getAddressByLocation, searchLocation } from "@/services/HTTP";
import LocationSearch from "@/assets/icons/locationSearch.svg";
import CompassIcon from "@/assets/icons/compass.svg";
import { useLocation } from "@/hooks/useLocation";
import SearchLocation from "@/components/SearchLocation";

const Index = () => {
  const { setUserLocation, userLatitude, userLongitude } = useLocationStore();
  const { location, getAccessLocation } = useLocation();
  const mapRef = useRef<MapComponentRef | null>(null);
  async function resetUserLocation() {
    await getAccessLocation();
    try {
      if (location) {
        const userAddress = await getAddressByLocation(
          location.coords.latitude,
          location.coords.longitude
        );

        setUserLocation(
          location.coords.latitude,
          location.coords.longitude,
          userAddress?.data?.formatted_address || null
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    resetUserLocation();
  }, []);
  return (
    <SafeAreaView
      style={{ direction: "rtl" }}
      className="flex-1 w-full relative"
    >
      <View className="w-full absolute top-0 left-0 h-max p-2 z-50">
        <SearchLocation />
      </View>
      <View className="bg-slate-700 flex-1">
        <Map
          center={[
            location?.coords.longitude || 0,
            location?.coords.latitude || 0,
          ]}
          ref={mapRef}
        />
      </View>
      <View className="absolute bottom-6 right-5 flex flex-col gap-5">
        <TouchableOpacity
          onPress={() => {
            mapRef.current?.resetBearing();
          }}
          className="center w-14 h-14 rounded-full bg-white shadow-2xl"
        >
          <CompassIcon width={26} color={"#333333"} height={26} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            resetUserLocation();
            mapRef.current?.getToUserLocation([
              location?.coords.longitude || 0,
              location?.coords.latitude || 0,
            ]);
          }}
          className="center w-14 h-14 rounded-full bg-white shadow-2xl"
        >
          <LocationSearch width={26} color={"#333333"} height={26} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Index;
