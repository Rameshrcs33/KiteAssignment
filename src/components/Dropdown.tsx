import React, { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { colors } from "../utils/colors";

export interface DropdownItem {
  id: string | number;
  label: string;
}

interface DropdownProps {
  items: DropdownItem[];
  selectedValue?: string | number;
  onSelect: (item: DropdownItem) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  label?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  selectedValue,
  onSelect,
  placeholder = "Select an option",
  disabled = false,
  error = false,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = items.find((item) => item.id === selectedValue);
  const displayText = selectedItem ? selectedItem.label : placeholder;

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          error && styles.dropdownButtonError,
          disabled && styles.dropdownButtonDisabled,
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.dropdownButtonText,
            !selectedItem && styles.placeholderText,
          ]}
        >
          {displayText}
        </Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select an option</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    selectedValue === item.id && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    onSelect(item);
                    setIsOpen(false);
                  }}
                >
                  <View style={styles.itemContent}>
                    <Text
                      style={[
                        styles.itemLabel,
                        selectedValue === item.id && styles.itemLabelSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {selectedValue === item.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              scrollEnabled
              nestedScrollEnabled
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = ScaledSheet.create({
  label: {
    fontSize: "14@ms",
    fontWeight: "600",
    color: colors.black,
    marginBottom: "8@ms",
  },
  dropdownButton: {
    borderWidth: "1@ms",
    borderColor: colors.light_grey,
    borderRadius: "8@ms",
    paddingHorizontal: "16@ms",
    paddingVertical: "12@ms",
    backgroundColor: colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonError: {
    borderColor: colors.red,
  },
  dropdownButtonDisabled: {
    backgroundColor: "#f5f5f5",
    opacity: 0.6,
  },
  dropdownButtonText: {
    fontSize: "16@ms",
    color: colors.black,
    flex: 1,
  },
  placeholderText: {
    color: colors.light_grey,
  },
  dropdownIcon: {
    fontSize: "12@ms",
    color: colors.black,
    marginLeft: "8@ms",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: "16@ms",
    borderTopRightRadius: "16@ms",
    maxHeight: "70%",
    paddingTop: "0@ms",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "16@ms",
    paddingVertical: "16@ms",
    borderBottomWidth: "1@ms",
    borderBottomColor: colors.light_grey,
  },
  modalTitle: {
    fontSize: "16@ms",
    fontWeight: "600",
    color: colors.black,
  },
  closeButton: {
    fontSize: "24@ms",
    color: colors.black,
    padding: "8@ms",
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "16@ms",
    paddingVertical: "12@ms",
    borderBottomWidth: "1@ms",
    borderBottomColor: colors.light_grey,
  },
  dropdownItemSelected: {
    backgroundColor: "#f0f0f0",
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: "16@ms",
    color: colors.black,
    fontWeight: "500",
  },
  itemLabelSelected: {
    color: colors.black,
    fontWeight: "600",
  },
  checkmark: {
    fontSize: "18@ms",
    color: colors.black,
    fontWeight: "bold",
    marginLeft: "8@ms",
  },
});

export default Dropdown;
