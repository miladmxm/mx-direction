import React, { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SearchIcon from "@/assets/icons/search.svg";
import CloseIcon from "@/assets/icons/close.svg";
import { useLocationStore } from "@/store";
import { searchLocation } from "@/services/HTTP";

const SearchLocation = () => {
  const { userLatitude, userLongitude } = useLocationStore();
  const [textInput, setTextInput] = useState<string>("");
  const [resultSearch, setResultSearch] = useState<AddressResult[]>([]);
  async function handleSearch() {
    const { data } = await searchLocation(
      userLatitude || 0,
      userLongitude || 0,
      textInput
    );
    console.log(data.items);
    setResultSearch(data.items);
  }

  return (
    <>
      <View className="h-20 w-full bg-white/30 shadow-lg rounded-2xl flex flex-row gap-2 p-2">
        <TouchableOpacity onPress={handleSearch} className="w-10 center">
          <SearchIcon color={"#ffffff"} width={20} height={20} />
        </TouchableOpacity>
        <View className="h-full flex-auto flex justify-center bg-white rounded-full relative">
          <TextInput
            className="pr-3 pl-10"
            placeholder="کجا میروید؟"
            value={textInput}
            onChangeText={setTextInput}
          />
          {(textInput.length > 0 || resultSearch.length > 0) && (
            <TouchableOpacity
              onPress={() => {
                setResultSearch([]);
                setTextInput("");
              }}
              className="absolute left-0 center h-full w-10 z-20"
            >
              <CloseIcon width={20} height={20} color="#333" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {resultSearch.length > 0 && (
        <FlatList
          data={resultSearch}
          className=" w-full max-h-96 mt-2 bg-white/60 rounded-xl"
          contentContainerClassName="p-2"
          renderItem={({ item }) => (
            <TouchableOpacity className="p-2 bg-white/90 mb-2 rounded-lg">
              <Text className="font-bold text-lg">{item?.title || ""}</Text>
              <Text>{item?.address || ""}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </>
  );
};

export default SearchLocation;
