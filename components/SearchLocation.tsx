import React, { useRef, useState } from "react";
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

const SearchLocation = ({
  selectLocation,
}: {
  selectLocation: (lngLat: LngLat) => void;
}) => {
  const { userLatitude, userLongitude } = useLocationStore();
  const [textInput, setTextInput] = useState<string>("");
  const [resultSearch, setResultSearch] = useState<AddressResult[]>([]);
  const searchAbortControl = useRef<AbortController | null>(null);
  const timeoutForSearch = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearSearch = () => {
    if (searchAbortControl.current) {
      searchAbortControl.current.abort();
    }
    setResultSearch([]);
    setTextInput("");
  };
  const handleSearchInputType = (text: string) => {
    if (timeoutForSearch.current) {
      clearTimeout(timeoutForSearch.current);
    }
    setTextInput(text);
    timeoutForSearch.current = setTimeout(() => {
      handleSearch(text);
    }, 2500);
  };
  async function handleSearch(searchText: string) {
    try {
      if (searchAbortControl.current) {
        searchAbortControl.current.abort();
      }
      searchAbortControl.current = new AbortController();
      const { data } = await searchLocation(
        userLatitude || 0,
        userLongitude || 0,
        searchText,
        searchAbortControl.current.signal
      );
      setResultSearch(data.items);
      searchAbortControl.current = null;
    } catch (err) {}
  }
  const selectResultItem = (item: AddressResult) => {
    const { x: lng, y: lat } = item.location;
    selectLocation([lng, lat]);
    clearSearch();
  };
  return (
    <>
      <View className="h-20 w-full flex flex-row items-center bg-white shadow-2xl rounded-2xl overflow-hidden mb-5">
        <TouchableOpacity
          onPress={() => handleSearch(textInput)}
          className="h-full center bg-white aspect-square"
        >
          <SearchIcon color={"#000000"} width={20} height={20} />
        </TouchableOpacity>
        <View className="flex-auto flex flex-row items-center justify-center relative">
          <TextInput
            className={`rounded-full flex-auto`}
            placeholder="کجا میروید؟"
            value={textInput}
            onChangeText={(text) => handleSearchInputType(text)}
          />
          {(textInput.length > 0 || resultSearch.length > 0) && (
            <TouchableOpacity
              onPress={clearSearch}
              className="center w-10 z-20"
            >
              <CloseIcon width={20} height={20} color="#333" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {resultSearch.map((item) => {
        return (
          <TouchableOpacity
            key={`${item.location.x}-${item.location.y}`}
            onPress={() => selectResultItem(item)}
            className="p-2 bg-white/90 mb-2 rounded-lg"
          >
            <Text className="font-bold text-lg">{item?.title || ""}</Text>
            <Text>{item?.address || ""}</Text>
          </TouchableOpacity>
        );
      })}
    </>
  );
};

export default SearchLocation;
