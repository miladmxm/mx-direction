import { View, Text, ToastAndroid, Alert } from "react-native";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import "@/global.css";
import Map, { type MapComponentRef } from "@/components/Map";
import { useDirectionParameters, useLocationStore } from "@/store";
import { getAddressByLocation, getDirectionsPath } from "@/services/HTTP";
import LocationSearch from "@/assets/icons/locationSearch.svg";
import Location from "@/assets/icons/location.svg";
import CompassIcon from "@/assets/icons/compass.svg";
import Traffic from "@/assets/icons/traffic.svg";
import Motor from "@/assets/icons/motor.svg";
import { useLocation } from "@/hooks/useLocation";
import SearchLocation from "@/components/SearchLocation";
import routeAndPointGEOjson from "@/utils/createGeoJsonRoute";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomButton from "@/components/CustomButton";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const Index = () => {
  const {
    setUserLocation,
    userLatitude,
    userLongitude,
    addTarget,
    userAddress,
    targets,
  } = useLocationStore();
  const { location, getAccessLocation } = useLocation();
  const {
    setType,
    toggleTrafficZone,
    trafficZone,
    type: directionType,
  } = useDirectionParameters();
  const mapRef = useRef<MapComponentRef | null>(null);
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const abortControlRef = useRef<AbortController | null>(null);

  async function resetUserLocation() {
    try {
      const updatedLocation = await getAccessLocation();
      if (updatedLocation && updatedLocation.coords) {
        const userAddress = await getAddressByLocation(
          updatedLocation.coords.latitude,
          updatedLocation.coords.longitude
        );

        setUserLocation(
          updatedLocation.coords.latitude,
          updatedLocation.coords.longitude,
          userAddress?.data?.formatted_address || null
        );
        mapRef.current?.getToUserLocation([
          updatedLocation?.coords.longitude,
          updatedLocation?.coords.latitude,
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function selectLocationHandler(lngLat: LngLat) {
    mapRef.current?.setTargetMarkerPos(lngLat);
    if (abortControlRef.current) {
      abortControlRef.current.abort();
    }
    abortControlRef.current = new AbortController();
    try {
      const { data }: { data: RoutingResponse } = await getDirectionsPath(
        {
          origin: `${userLatitude},${userLongitude}`,
          type: directionType,
          avoidTrafficZone: trafficZone,
          destination: lngLat.reverse().join(),
        },
        abortControlRef.current.signal
      );
      if (data.routes) {
        const { pointsObj, routeObj } = routeAndPointGEOjson(data);

        bottomSheetRef.current?.collapse();
        mapRef.current?.changeRoute(routeObj, pointsObj);
        addTarget(lngLat[1], lngLat[0], data.routes[0].legs[0].summary);
        abortControlRef.current = null;
      } else {
        mapRef.current?.cleanUpMap()
        ToastAndroid.show('مسیریابی انجام نشد !', ToastAndroid.SHORT);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const bottomAnimation = useSharedValue(135);
  const config = {
    duration: 1000,
  };

  const bottomAnimationForBtnWrapper = useAnimatedStyle(() => {
    return {
      bottom: withSpring(bottomAnimation.value, config),
    };
  });
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
            selectLocationHandler={selectLocationHandler}
            resetUserLocation={resetUserLocation}
            center={[
              location?.coords.longitude || 51.43899933649559,
              location?.coords.latitude || 35.68670997613197,
            ]}
            isLocationFinded={location?.coords.longitude ? true : false}
            ref={mapRef}
          />
        </View>

        <Animated.View
          style={bottomAnimationForBtnWrapper}
          className={`absolute right-5 flex flex-col gap-5`}
        >
          <CustomButton
            className={
              directionType === "motorcycle" ? "bg-green-300" : "opacity-30"
            }
            onPress={() => {
              if (directionType === "motorcycle") {
                setType("car");
              } else {
                setType("motorcycle");
              }
            }}
            icon={<Motor width={26} color={"#333333"} height={26} />}
          />
          <CustomButton
            className={trafficZone ? "bg-green-300" : "opacity-30"}
            onPress={toggleTrafficZone}
            icon={<Traffic width={26} color={"#333333"} height={26} />}
          />
          <CustomButton
            onPress={() => mapRef.current?.resetBearing()}
            icon={<CompassIcon width={26} color={"#333333"} height={26} />}
          />
          <CustomButton
            onPress={resetUserLocation}
            icon={<LocationSearch width={26} color={"#333333"} height={26} />}
          />
        </Animated.View>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing={false}
          snapPoints={[20, 110, "45%", "85%"]}
          index={1}
          onChange={(i) => {
            if (i === 1) {
              bottomAnimation.set(135);
            } else if (i === 0) {
              bottomAnimation.set(40);
            }
          }}
        >
          <BottomSheetScrollView
            style={{ flex: 1, padding: 10, paddingTop: 0 }}
          >
            <View className="w-full h-max p-2 z-50">
              <SearchLocation selectLocation={selectLocationHandler} />
            </View>
            {Object.keys(targets).length > 0 && (
              <View className="flex flex-row border border-slate-500/30 p-4 rounded-lg items-center justify-start gap-2 w-full">
                <LocationSearch width={25} height={25} color={"#000000"} />
                <Text>از:</Text>
                <Text className="flex-auto text-center">{userAddress}</Text>
              </View>
            )}

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
