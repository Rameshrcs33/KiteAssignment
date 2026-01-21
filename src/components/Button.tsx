import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { colors } from "../utils/colors";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const Button: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.disabledButton]}
      onPress={onPress}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <Text style={[styles.buttonText, isDisabled && styles.disabledText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  button: {
    backgroundColor: colors.blue,
    paddingVertical: "14@ms",
    paddingHorizontal: "24@ms",
    borderRadius: "8@ms",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "48@ms",
    marginTop: "16@ms",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: "16@ms",
    fontWeight: "600",
    color: colors.white,
  },
  disabledText: {
    color: colors.grey,
  },
});

export default Button;
