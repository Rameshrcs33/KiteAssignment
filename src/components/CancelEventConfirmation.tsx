import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { colors } from "../utils/colors";
import Button from "./Button";

interface CancelEventConfirmationProps {
  visible: boolean;
  eventTitle: string;
  isOrganizer: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const CancelEventConfirmation: React.FC<CancelEventConfirmationProps> =
  React.memo(
    ({
      visible,
      eventTitle,
      isOrganizer,
      onConfirm,
      onCancel,
      loading = false,
    }) => {
      const title = isOrganizer ? "Cancel Event?" : "Cancel Participation?";
      const message = isOrganizer
        ? `Are you sure you want to cancel the event "${eventTitle}"? Users will still be able to rejoin until the event expires.`
        : `Are you sure you want to cancel your participation in "${eventTitle}"?`;

      return (
        <Modal
          visible={visible}
          transparent
          animationType="fade"
          onRequestClose={onCancel}
        >
          <View style={styles.overlay}>
            <View style={styles.container}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancel}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>
                    {isOrganizer ? "Keep Event" : "Keep Participating"}
                  </Text>
                </TouchableOpacity>

                <Button
                  title={isOrganizer ? "Cancel Event" : "Cancel Participation"}
                  onPress={onConfirm}
                  loading={loading}
                  disabled={loading}
                />
              </View>
            </View>
          </View>
        </Modal>
      );
    },
  );

CancelEventConfirmation.displayName = "CancelEventConfirmation";

const styles = ScaledSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "16@ms",
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: "12@ms",
    padding: "24@ms",
    width: "100%",
    maxWidth: "320@ms",
  },
  title: {
    fontSize: "18@ms",
    fontWeight: "700",
    color: colors.black,
    marginBottom: "12@ms",
    textAlign: "center",
  },
  message: {
    fontSize: "14@ms",
    color: colors.grey,
    lineHeight: "20@ms",
    marginBottom: "24@ms",
    textAlign: "center",
  },
  buttonContainer: {
    gap: "12@ms",
  },
  button: {
    paddingVertical: "12@ms",
    paddingHorizontal: "16@ms",
    borderRadius: "8@ms",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "48@ms",
  },
  cancelButton: {
    backgroundColor: colors.light_grey,
  },
  cancelButtonText: {
    fontSize: "14@ms",
    fontWeight: "600",
    color: colors.black,
  },
});

export default CancelEventConfirmation;
