import { View, TouchableOpacity, Text } from "react-native";
import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import "@/global.css";
import Map, { type MapComponentRef } from "@/components/Map";
import { useLocationStore } from "@/store";
import { getAddressByLocation, getDirectionsPath } from "@/services/HTTP";
import LocationSearch from "@/assets/icons/locationSearch.svg";
import Location from "@/assets/icons/location.svg";
import CompassIcon from "@/assets/icons/compass.svg";
import { useLocation } from "@/hooks/useLocation";
import SearchLocation from "@/components/SearchLocation";
import routeAndPointGEOjson from "@/utils/createGeoJsonRoute";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Index = () => {
  const {
    setUserLocation,
    userLatitude,
    userLongitude,
    addTarget,
    userAddress,
    targets,
  } = useLocationStore();
  console.log(targets);
  const { location, getAccessLocation } = useLocation();
  console.log(location?.coords)
  const mapRef = useRef<MapComponentRef | null>(null);
  const bottomSheetRef = useRef<BottomSheet | null>(null);

  async function resetUserLocation() {
    try {
      const location = await getAccessLocation();
      if (location) {
        const userAddress = await getAddressByLocation(
          location.coords.latitude,
          location.coords.longitude
        );

        setUserLocation(
          location.coords.latitude || 35.68670997613197,
          location.coords.longitude || 51.43899933649559,
          userAddress?.data?.formatted_address || null
        );
        // if (mapRef.current && mapRef.current.getToUserLocation) {
        //   mapRef.current.getToUserLocation([
        //     location?.coords.longitude || 51.43899933649559,
        //     location?.coords.latitude || 35.68670997613197,
        //   ]);
        // }
      }
    } catch (err) {
      console.log(err);
    }
  }
  const abortControlRef = useRef<AbortController | null>(null);
  async function selectLocation(lngLat: LngLat) {
    if (abortControlRef.current) {
      abortControlRef.current.abort();
    }
    abortControlRef.current = new AbortController();
    try {
      const { data }: { data: RoutingResponse } = await getDirectionsPath(
        {
          origin: `${userLatitude},${userLongitude}`,
          destination: lngLat.reverse().join(),
        },
        abortControlRef.current.signal
      );

      const { pointsObj, routeObj } = routeAndPointGEOjson(data);

      bottomSheetRef.current?.collapse();
      mapRef.current?.changeRoute(routeObj, pointsObj);
      addTarget(lngLat[1], lngLat[0], data.routes[0].legs[0].summary);
      abortControlRef.current = null;
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    resetUserLocation();
  }, [mapRef.current]);
  return (
    <SafeAreaView
      style={{ direction: "rtl" }}
      className="flex-1 w-full relative"
    >
      <GestureHandlerRootView>
        {/* <View className="w-full absolute top-0 left-0 h-max p-2 z-50">
        </View> */}
        <View className="bg-slate-700 flex-1">
          <Map
            selectLocation={selectLocation}
            center={[
              location?.coords.longitude || 51.43899933649559,
              location?.coords.latitude || 35.68670997613197,
            ]}
            isLocationFinded={location?.coords.longitude ? true : false}
            ref={mapRef}
          />
        </View>
        <View className="absolute bottom-36 right-5 flex flex-col gap-5">
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
            }}
            className="center w-14 h-14 rounded-full bg-white shadow-2xl"
          >
            <LocationSearch width={26} color={"#333333"} height={26} />
          </TouchableOpacity>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing={false}
          snapPoints={[110, "45%", "85%"]}
          index={1}
        >
          <BottomSheetScrollView
            style={{ flex: 1, padding: 10, paddingTop: 0 }}
          >
            <View className="w-full h-max p-2 z-50">
              <SearchLocation selectLocation={selectLocation} />
            </View>

            <View className="flex flex-row border border-slate-500/30 p-4 rounded-lg items-center justify-start gap-2 w-full">
              <LocationSearch width={25} height={25} color={"#000000"} />
              <Text>از:</Text>
              <Text className="flex-auto text-center">{userAddress}</Text>
            </View>
            {Object.keys(targets).map((targetKey) => {
              const targetValue = targets[targetKey];
              return (
                <View key={targetKey}>
                  <View className="h-8 w-1 mx-auto border-r border-dashed border-slate-500/30"></View>
                  <View className="flex flex-row border border-slate-500/30 p-4 rounded-lg items-center justify-start gap-2 w-full">
                    <Location width={25} height={25} color={"#000000"} />
                    <Text>به:</Text>
                    <Text className="flex-auto text-center">
                      {targetValue.address}
                    </Text>
                  </View>
                </View>
              );
            })}
          </BottomSheetScrollView>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Index;
