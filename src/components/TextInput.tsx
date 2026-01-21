import React, { useState } from "react";
import {
    TextInput as RNTextInput,
    Text,
    TextInputProps,
    View
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { colors } from "../utils/colors";

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: TextInputProps["keyboardType"];
}

const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.light_grey}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    marginBottom: "16@ms",
    width: "100%",
  },
  label: {
    fontSize: "14@ms",
    fontWeight: "600",
    color: colors.black,
    marginBottom: "8@ms",
  },
  input: {
    borderWidth: "1@ms",
    borderColor: colors.light_grey,
    borderRadius: "8@ms",
    paddingHorizontal: "16@ms",
    paddingVertical: "12@ms",
    fontSize: "16@ms",
    color: colors.black,
    backgroundColor: colors.white,
  },
  inputFocused: {
    borderColor: colors.blue,
    borderWidth: "2@ms",
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    fontSize: "12@ms",
    color: colors.red,
    marginTop: "6@ms",
  },
});

export default TextInput;
