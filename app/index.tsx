import {
  View,
  Text,
  Alert,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import "@/global.css";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";
import { getAddressByLocation, searchLocation } from "@/services/HTTP";
import SearchIcon from "@/assets/icons/search.svg";
import LocationSearch from "@/assets/icons/locationSearch.svg";
import { useLocation } from "@/hooks/useLocation";

const Index = () => {
  const { setUserLocation, userLatitude, userLongitude } = useLocationStore();
  const { location, getAccessLocation } = useLocation();

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
  async function handleSearch() {
    const { data } = await searchLocation(
      userLatitude || location?.coords.latitude || 0,
      userLongitude || location?.coords.longitude || 0,
      "پمپ بنزین"
    );
    console.log(data);
  }
  useEffect(() => {
    resetUserLocation();
  }, []);
  return (
    <SafeAreaView
      style={{ direction: "rtl" }}
      className="flex-1 w-full relative"
    >
      <View className="w-full absolute top-0 left-0 h-20 p-2 z-50">
        <View className="h-full w-full bg-white/30 shadow-lg rounded-2xl flex flex-row gap-2 p-2">
          <TouchableOpacity onPress={handleSearch} className="w-10 center">
            <SearchIcon color={"#ffffff"} width={20} height={20} />
          </TouchableOpacity>
          <View className="h-full flex-auto flex justify-center bg-white rounded-full">
            <TextInput className="px-2" placeholder="کجا میروید؟" />
          </View>
        </View>
      </View>
      <View className="bg-slate-700 flex-1">
        <Map
          center={[
            Number(location?.coords.longitude),
            Number(location?.coords.latitude),
          ]}
          onClick={() => console.log("")}
        />
      </View>
      <View className="absolute bottom-28 right-5">
        <TouchableOpacity
          onPress={resetUserLocation}
          className="center w-16 h-16 rounded-full bg-white shadow-2xl"
        >
          <LocationSearch width={30} color={"#333333"} height={30} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Index;
