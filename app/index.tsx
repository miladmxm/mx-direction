import {
  View,
  Text,
  Alert,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import "@/global.css";
import Map from "@/components/Map";

const Index = () => {
  useEffect(() => {
    async function getAccessLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!status) {
        // todo return error
      }
      const location = await Location.getCurrentPositionAsync();
      console.log(location);
    }
    getAccessLocation();
  }, []);
  return (
    <SafeAreaView
      style={{ direction: "rtl" }}
      className="flex-1 w-full relative"
    >
      <View className="w-full absolute top-0 left-0 h-20 p-2 z-50">
        <View className="h-full w-full bg-white/30 shadow-lg rounded-2xl flex flex-row gap-2 p-2">
          <TouchableOpacity className="w-10">
            <Text>test</Text>
          </TouchableOpacity>
          <View className="h-full flex-auto flex justify-center bg-white rounded-full">
            <TextInput placeholder="کجا میروید؟" />
          </View>
        </View>
      </View>
      <View className="bg-slate-700 flex-1">
        <Map onClick={() => console.log("")} />
      </View>
    </SafeAreaView>
  );
};

export default Index;
