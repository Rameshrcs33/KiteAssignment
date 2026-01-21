import React, { useMemo } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { colors } from "../utils/colors";

interface EventActionButtonProps {
  isExpired: boolean;
  isStarted: boolean;
  isUserOrganizer: boolean;
  hasUserJoined: boolean;
  isEventFull: boolean;
  isCancelledByOrganizer?: boolean;
  onPress: () => void;
  loading?: boolean;
}

const EventActionButton: React.FC<EventActionButtonProps> = React.memo(
  ({
    isExpired,
    isStarted,
    isUserOrganizer,
    hasUserJoined,
    isEventFull,
    isCancelledByOrganizer = false,
    onPress,
    loading = false,
  }) => {
    const buttonState = useMemo(() => {
      if (isExpired) {
        return {
          title: "Event Expired",
          disabled: true,
          backgroundColor: colors.light_grey,
          textColor: colors.grey,
        };
      }

      if (isUserOrganizer && !isStarted) {
        if (isCancelledByOrganizer) {
          return {
            title: "Reactivate Event",
            disabled: false,
            backgroundColor: colors.green,
            textColor: colors.white,
          };
        }
        return {
          title: "Cancel Event",
          disabled: false,
          backgroundColor: colors.red,
          textColor: colors.white,
        };
      }

      if (isUserOrganizer && isStarted) {
        return {
          title: "Event In Progress",
          disabled: true,
          backgroundColor: colors.light_grey,
          textColor: colors.grey,
        };
      }

      if (hasUserJoined) {
        return {
          title: "Cancel Participation",
          disabled: isStarted,
          backgroundColor: isStarted ? colors.light_grey : colors.red,
          textColor: isStarted ? colors.grey : colors.white,
        };
      }

      if (isEventFull && !isCancelledByOrganizer) {
        return {
          title: "Event Full",
          disabled: true,
          backgroundColor: colors.light_grey,
          textColor: colors.grey,
        };
      }

      return {
        title: "Join Event",
        disabled: false,
        backgroundColor: colors.blue,
        textColor: colors.white,
      };
    }, [
      isExpired,
      isStarted,
      isUserOrganizer,
      hasUserJoined,
      isEventFull,
      isCancelledByOrganizer,
    ]);

    return (
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: buttonState.backgroundColor,
            opacity: buttonState.disabled ? 0.6 : 1,
          },
        ]}
        onPress={onPress}
        disabled={buttonState.disabled || loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={buttonState.textColor} />
        ) : (
          <Text style={[styles.buttonText, { color: buttonState.textColor }]}>
            {buttonState.title}
          </Text>
        )}
      </TouchableOpacity>
    );
  },
);

EventActionButton.displayName = "EventActionButton";

const styles = ScaledSheet.create({
  button: {
    paddingVertical: "12@ms",
    paddingHorizontal: "16@ms",
    borderRadius: "8@ms",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "48@ms",
  },
  buttonText: {
    fontSize: "16@ms",
    fontWeight: "600",
  },
});

export default EventActionButton;
