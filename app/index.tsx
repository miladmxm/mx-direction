import {
  View,
  Text,
  ToastAndroid,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Fragment, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import "@/global.css";
import Map, { type MapComponentRef } from "@/components/Map";
import { useDirectionParameters, useLocationStore } from "@/store";
import {
  getAddressByLocation,
  getDirectionsPath,
  getTSP,
} from "@/services/HTTP";
import LocationSearch from "@/assets/icons/locationSearch.svg";
import Sort from "@/assets/icons/sort.svg";
import Location from "@/assets/icons/location.svg";
import CompassIcon from "@/assets/icons/compass.svg";
import Drag from "@/assets/icons/drag.svg";
import Close from "@/assets/icons/close.svg";
import Motor from "@/assets/icons/motor.svg";
import Car from "@/assets/icons/car.svg";
import { useLocation } from "@/hooks/useLocation";
import SearchLocation from "@/components/SearchLocation";
import routeAndPointGEOjson from "@/utils/createGeoJsonRoute";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomButton from "@/components/CustomButton";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
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
    setTarget,
    removeTarget,
    clearTargets,
    userAddress,
    targets,
  } = useLocationStore();
  const { location, getAccessLocation } = useLocation();
  const {
    setType,
    toggleTrafficZone,
    trafficZone,
    oddEvenZone,
    toggleOddEvenZone,
    type: directionType,
  } = useDirectionParameters();
  const [addTargetRouteMode, setAddTargetRouteMode] = useState<boolean>(false);
  const mapRef = useRef<MapComponentRef | null>(null);
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const abortControlRef = useRef<AbortController | null>(null);
  const abortUserLocationRef = useRef<AbortController | null>(null);
  const abortSortRef = useRef<AbortController | null>(null);
  const [sortTargetsState, setSortTargetsState] = useState<string[]>([]);
  const [directionDitails, setDirectionDitails] = useState<
    { distance: DistanceDuration; duration: DistanceDuration }[]
  >([]);
  async function resetUserLocation() {
    try {
      if (location) {
        mapRef.current?.goToUserLocation([
          location?.coords.longitude,
          location?.coords.latitude,
        ]);
      }
      const updatedLocation = await getAccessLocation();
      if (updatedLocation && updatedLocation.coords) {
        mapRef.current?.goToUserLocation([
          updatedLocation?.coords.longitude,
          updatedLocation?.coords.latitude,
        ]);
        if (abortUserLocationRef.current) abortUserLocationRef.current.abort();
        abortUserLocationRef.current = new AbortController();
        const userAddress = await getAddressByLocation(
          updatedLocation.coords.latitude,
          updatedLocation.coords.longitude,
          abortUserLocationRef.current.signal
        );

        setUserLocation(
          updatedLocation.coords.latitude,
          updatedLocation.coords.longitude,
          userAddress?.data || null
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function selectLocationHandler(
    lngLat: LngLat,
    addMode = addTargetRouteMode
  ) {
    if (abortControlRef.current) {
      abortControlRef.current.abort();
    }
    try {
      let targetAddress = null;
      const { data: resultData } = await getAddressByLocation(
        lngLat[1],
        lngLat[0]
      );
      if (resultData) {
        if (
          ((resultData.in_traffic_zone && trafficZone) ||
            (resultData.in_odd_even_zone && oddEvenZone)) &&
          directionType === "car"
        ) {
          ToastAndroid.show("مقصد شما درون طرح میباشد !", ToastAndroid.SHORT);
          return;
        } else {
          setDirectionDitails([]);
          bottomSheetRef.current?.expand();
          targetAddress = resultData;
          const id = lngLat.join();
          if (addMode) {
            mapRef.current?.addTargetMarker(lngLat, id);
            addTarget(lngLat[1], lngLat[0], targetAddress, id);
            setSortTargetsState((prev) => [...prev, id]);
            setAddTargetRouteMode(false);
          } else {
            mapRef.current?.cleanUpMap();
            setSortTargetsState(() => [id]);
            mapRef.current?.setTargetMarker(lngLat, id);
            setTarget(lngLat[1], lngLat[0], targetAddress, id);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function directionHandler() {
    abortControlRef.current = new AbortController();
    try {
      const targetsItems = [];
      const allTargets = { ...targets };
      for (let i = 0; i < sortTargetsState.length; i++) {
        const id = sortTargetsState[i];
        targetsItems.push([allTargets[id].latitude, allTargets[id].longitude]);
      }
      const target = targetsItems.pop() || [];

      const { data }: { data: RoutingResponse } = await getDirectionsPath(
        {
          origin: `${userLatitude},${userLongitude}`,
          type: directionType,
          avoidTrafficZone: trafficZone,
          avoidOddEvenZone: oddEvenZone,
          waypoints: targetsItems.join("|") || null,
          destination: target.join(),
        },
        abortControlRef.current.signal
      );
      if (data.routes) {
        const ditails = [];
        for (let i = 0; i < data.routes[0].legs.length; i++) {
          const leg = data.routes[0].legs[i];
          ditails.push({ duration: leg.duration, distance: leg.distance });
        }
        setDirectionDitails(ditails);
        const { pointsObj, routeObj } = routeAndPointGEOjson(data);
        mapRef.current?.changeRoute(routeObj, pointsObj);
      } else {
        mapRef.current?.cleanUpMap();
        ToastAndroid.show("مسیریابی انجام نشد !", ToastAndroid.SHORT);
      }
    } catch (err) {
      console.log(err);
    } finally {
      abortControlRef.current = null;
    }
  }

  const hasTarget = Object.keys(targets).length > 0;
  const bottomAnimation = useSharedValue(135);
  const config = {
    duration: 1000,
  };

  const bottomAnimationForBtnWrapper = useAnimatedStyle(() => {
    return {
      bottom: withSpring(bottomAnimation.value, config),
    };
  });
  const sortTSP = async () => {
    try {
      if (abortSortRef.current) abortSortRef.current.abort();
      const targetsItems = [];
      const allTargets = { ...targets };
      for (let i = 0; i < sortTargetsState.length; i++) {
        const id = sortTargetsState[i];
        targetsItems.push([allTargets[id].latitude, allTargets[id].longitude]);
      }
      abortSortRef.current = new AbortController();
      const { data: sorted } = await getTSP(
        {
          waypoints:
            `${userLatitude},${userLongitude}|` + targetsItems.join("|"),
        },
        abortSortRef.current.signal
      );
      if (sorted) {
        const newSortingArray = [];
        for (let i = 1; i < sorted.points.length; i++) {
          const sortItem = sorted.points[i];
          newSortingArray.push(sortTargetsState[sortItem.index - 1]);
        }
        setSortTargetsState(newSortingArray);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const renderItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: {
    item: string;
    drag: () => void;
    isActive: boolean;
    getIndex: () => number;
  }) => {
    const hasDitail = directionDitails[getIndex()];
    return (
      <ScaleDecorator>
        <TouchableOpacity
          className="flex w-full flex-col"
          onLongPress={drag}
          disabled={isActive}
        >
          <View
            className={`flex flex-row h-10 w-full items-center justify-center gap-1  ${isActive ? "opacity-0" : ""}`}
          >
            {hasDitail && (
              <View className="flex-1 center">
                <Text className="bg-slate-700/70 rounded-lg py-1 px-4 text-gray-50">
                  {directionDitails[getIndex()].distance.text}
                </Text>
              </View>
            )}
            <View className={`h-full w-1 border-r border-dashed`} />
            {hasDitail && (
              <View className="flex-1 center">
                <Text className="bg-slate-700/70 rounded-lg py-1 px-4 text-gray-50">
                  {directionDitails[getIndex()].duration.text}
                </Text>
              </View>
            )}
          </View>
          <View className="flex flex-row border border-slate-500/30 p-4 rounded-lg items-center justify-start gap-1 w-full">
            <Drag width={12} height={12} color={"#aaaaaa"} />
            <Location width={25} height={25} color={"#000000"} />
            <Text>به:</Text>
            <Text className="flex-auto text-center">
              {targets[item].address?.formatted_address || "آدرس نامشخص"}
            </Text>
            <TouchableOpacity
              onPress={async () => {
                mapRef.current?.removeMarkerTarget(item);
                removeTarget(item);
                setSortTargetsState((prev) =>
                  [...prev].filter((id) => id !== item)
                );
                mapRef.current?.cleanUpMap(false);
              }}
            >
              <Close width={25} height={25} color={"#af0f0f"} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView
      style={{ direction: "rtl" }}
      className="flex-1 w-full relative"
    >
      <GestureHandlerRootView>
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
            targets={targets}
          />
        </View>

        <Animated.View
          style={bottomAnimationForBtnWrapper}
          className={`absolute right-5 flex flex-col gap-5`}
        >
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
          snapPoints={[20, 110, "85%"]}
          index={1}
          onChange={(i) => {
            if (i === 1) {
              bottomAnimation.set(135);
            } else if (i === 0) {
              bottomAnimation.set(40);
            }
          }}
        >
          <BottomSheetView style={{ flex: 1 }}>
            <DraggableFlatList
              contentContainerClassName="px-3"
              ListHeaderComponent={
                <Fragment>
                  <View className="w-full h-max p-2 z-50">
                    <SearchLocation
                      expandBottomSheet={() => bottomSheetRef.current?.expand()}
                      selectLocation={selectLocationHandler}
                    />
                  </View>
                  {hasTarget && (
                    <View className="flex flex-row border border-slate-500/30 p-4 rounded-lg items-center justify-start gap-2 w-full">
                      <LocationSearch
                        width={25}
                        height={25}
                        color={"#000000"}
                      />
                      <Text>از:</Text>
                      <Text className="flex-auto text-center">
                        {userAddress?.formatted_address || "آدرس نا مشخص"}
                      </Text>
                    </View>
                  )}
                </Fragment>
              }
              ListFooterComponent={
                <Fragment>
                  {hasTarget && (
                    <Fragment>
                      {sortTargetsState.length > 1 && (
                        <TouchableOpacity
                          onPress={async () => {
                            await sortTSP();
                            await directionHandler();
                          }}
                          className="flex  p-4 flex-row items-center justify-center gap-3 rounded-lg border mt-5"
                        >
                          <Sort width={25} height={25} color="#000000" />
                          <Text>مرتب سازی به ترتیب فاصله </Text>
                        </TouchableOpacity>
                      )}
                      <View className="flex flex-row justify-between items-center h-20 border-y border-gray-200 mt-5">
                        <Text>عبور از طرح ترافیک</Text>
                        <Switch
                          trackColor={{ false: "#767577", true: "#55aaff" }}
                          thumbColor={trafficZone ? "#30ffa0" : "#f4f3f4"}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={toggleTrafficZone}
                          value={trafficZone}
                        />
                      </View>
                      <View className="flex flex-row justify-between items-center h-20 border-b border-gray-200">
                        <Text>عبور از طرح زوج و فرد</Text>
                        <Switch
                          trackColor={{ false: "#767577", true: "#55aaff" }}
                          thumbColor={oddEvenZone ? "#30ffa0" : "#f4f3f4"}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={toggleOddEvenZone}
                          value={oddEvenZone}
                        />
                      </View>
                      <View className="flex items-center flex-row gap-5 px-5 relative mt-5">
                        <TouchableOpacity
                          onPress={() => {
                            setType("motorcycle");
                          }}
                          className={`flex-1 ${directionType === "motorcycle" ? "bg-green-300" : "opacity-30"} border border-gray-200/30 rounded-xl center py-2`}
                        >
                          <Motor width={25} color={"#333333"} height={25} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setType("car");
                          }}
                          className={`flex-1 ${directionType === "car" ? "bg-green-300" : "opacity-30"} border border-gray-200/30 rounded-xl center py-2`}
                        >
                          <Car width={25} color={"#333333"} height={25} />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        onPress={() => directionHandler()}
                        className="w-full h-16 bg-green-400 rounded-xl center shadow-xl my-5"
                      >
                        <Text className="text-center font-bold text-2xl text-white">
                          مسیریابی
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          setAddTargetRouteMode((pre) => {
                            if (pre) clearTargets();
                            return !pre;
                          })
                        }
                        className="w-full h-16 bg-blue-400 rounded-xl center shadow-xl my-5"
                      >
                        {addTargetRouteMode ? (
                          <Text className="text-center font-bold text-2xl text-white">
                            مسیر جدید
                          </Text>
                        ) : (
                          <Text className="text-center font-bold text-2xl text-white">
                            افزودن مسیر به مسیر فعلی
                          </Text>
                        )}
                      </TouchableOpacity>
                    </Fragment>
                  )}
                </Fragment>
              }
              keyExtractor={(item) => item}
              data={sortTargetsState}
              onDragEnd={async ({ data }) => {
                setSortTargetsState(data);
                await directionHandler();
              }}
              renderItem={renderItem}
            />
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Index;
