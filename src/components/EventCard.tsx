import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { colors } from "../utils/colors";
import { isEventExpired } from "../utils/dateTimeUtils";
import { Event } from "../redux/reducer/eventSlice";

interface EventCardProps {
  event: Event;
  onPress: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = React.memo(({ event, onPress }) => {
  const formattedDate = (() => {
    try {
      const date = new Date(event.startDate);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return event.startDate;
    }
  })();

  const formattedTime = event.startTime;

  const getSportLabel = () => {
    const sportMap: { [key: number]: string } = {
      1: "Cricket",
      2: "Football",
      3: "Basketball",
      4: "Tennis",
      5: "Badminton",
      6: "Volleyball",
      7: "Hockey",
    };
    return sportMap[event.sport as number] || event.sport;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(event.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>
        <View style={styles.sportBadge}>
          <Text style={styles.sportText}>{getSportLabel()}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date & Time:</Text>
          <Text style={styles.value}>
            {formattedDate} at {formattedTime}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Organizer:</Text>
          <Text style={styles.value} numberOfLines={1}>
            {event.organizerName}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value} numberOfLines={1}>
            {event.location}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Players:</Text>
          <Text style={styles.value}>
            {event.requests.length} / {event.maxPlayers}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        {event.isCancelledByOrganizer &&
        !isEventExpired(event.startDate, event.startTime) ? (
          <Text
            style={[
              styles.joinText,
              event.requests.length === event.maxPlayers
                ? styles.cancelledText
                : styles.availableText,
            ]}
          >
            {event.requests.length === event.maxPlayers
              ? "Event Full"
              : `${event.maxPlayers - event.requests.length} spot${event.maxPlayers - event.requests.length !== 1 ? "s" : ""} available`}
          </Text>
        ) : event.isCancelledByOrganizer &&
          isEventExpired(event.startDate, event.startTime) ? (
          <Text style={[styles.joinText, styles.cancelledText]}>
            Event Cancelled
          </Text>
        ) : (
          <Text style={styles.joinText}>
            {event.requests.length === event.maxPlayers
              ? "Event Full"
              : `${event.maxPlayers - event.requests.length} spots available`}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

EventCard.displayName = "EventCard";

const styles = ScaledSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: "12@ms",
    marginHorizontal: "16@ms",
    marginBottom: "12@ms",
    borderWidth: "1@ms",
    borderColor: colors.light_grey,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "16@ms",
    paddingVertical: "12@ms",
    backgroundColor: colors.blue,
  },
  title: {
    fontSize: "16@ms",
    fontWeight: "600",
    color: colors.white,
    flex: 1,
  },
  sportBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: "12@ms",
    paddingVertical: "6@ms",
    borderRadius: "16@ms",
    marginLeft: "8@ms",
  },
  sportText: {
    fontSize: "12@ms",
    fontWeight: "500",
    color: colors.white,
  },
  body: {
    paddingHorizontal: "16@ms",
    paddingVertical: "12@ms",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8@ms",
  },
  label: {
    fontSize: "12@ms",
    fontWeight: "500",
    color: colors.grey,
  },
  value: {
    fontSize: "14@ms",
    fontWeight: "500",
    color: colors.black,
    flex: 1,
    textAlign: "right",
    marginLeft: "8@ms",
  },
  footer: {
    paddingHorizontal: "16@ms",
    paddingVertical: "10@ms",
    backgroundColor: "#f5f5f5",
    borderTopWidth: "1@ms",
    borderTopColor: colors.light_grey,
  },
  joinText: {
    fontSize: "12@ms",
    fontWeight: "500",
    color: colors.green,
  },
  cancelledText: {
    color: "#DC3545",
    fontWeight: "600",
  },
  availableText: {
    color: "#28A745",
    fontWeight: "600",
  },
});

export default EventCard;
