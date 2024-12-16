import { TouchableOpacity } from "react-native";
import React, { CSSProperties, ReactNode } from "react";

const CustomButton = ({
  onPress,
  icon,
  className="",
  style={},
}: {
  onPress: () => void;
  icon: ReactNode;
  className?: string;
  style?: object;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={style}
      className={
        "center w-14 h-14 rounded-full bg-white shadow-2xl " + className
      }
    >
      {icon}
    </TouchableOpacity>
  );
};

export default CustomButton;
