import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";
import CancelEventConfirmation from "../../components/CancelEventConfirmation";
import EventActionButton from "../../components/EventActionButton";
import ParticipantsList from "../../components/ParticipantsList";
import { showSuccessAlert } from "../../components/SuccessAlert";
import {
  acceptParticipant,
  cancelEvent,
  cancelJoinEvent,
  joinEvent,
  reactivateEvent,
  rejectParticipant,
} from "../../redux/reducer/eventSlice";
import { RootState } from "../../redux/store";
import { colors } from "../../utils/colors";
import { isEventExpired, isEventStarted } from "../../utils/dateTimeUtils";

const eventdetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { eventId } = useLocalSearchParams();

  const events = useSelector((state: RootState) => state.event.events);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const event = useMemo(() => {
    return events.find((e) => e.id === eventId);
  }, [events, eventId]);

  const checkIsEventExpired = useCallback(() => {
    if (!event) return false;
    return isEventExpired(event.startDate, event.startTime);
  }, [event]);

  const checkIsEventStarted = useCallback(() => {
    if (!event) return false;
    return isEventStarted(event.startDate, event.startTime);
  }, [event]);

  const hasUserJoined = useMemo(() => {
    if (!event || !currentUser) return false;
    return event.requests.some((p) => p.userId === currentUser.id);
  }, [event, currentUser]);

  const isUserOrganizer = useMemo(() => {
    if (!event || !currentUser) return false;
    return event.organizerId === currentUser.id;
  }, [event, currentUser]);

  const formattedData = useMemo(() => {
    if (!event) return null;

    try {
      const eventDate = new Date(event.startDate);
      const date = eventDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const time = event.startTime;

      return { date, time };
    } catch (e) {
      return {
        date: event.startDate || "Invalid Date",
        time: event.startTime || "Invalid Time",
      };
    }
  }, [event]);

  const getSportLabel = useCallback(() => {
    if (!event) return "";
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
  }, [event]);

  const availableSpots = useMemo(() => {
    if (!event) return 0;
    return event.maxPlayers - event.requests.length;
  }, [event]);

  const isEventFull = useMemo(() => {
    if (!event) return false;
    return event.requests.length >= event.maxPlayers;
  }, [event]);

  const handleJoinPress = useCallback(() => {
    if (!event || !currentUser) return;

    if (isUserOrganizer) {
      return;
    }

    if (checkIsEventExpired()) {
      showSuccessAlert({
        title: "Event Expired",
        message: "Cannot join expired events!",
        onOkay: () => {},
      });
      return;
    }

    setLoading(true);

    if (hasUserJoined) {
      dispatch(cancelJoinEvent({ eventId: event.id, userId: currentUser.id }));
      showSuccessAlert({
        title: "Cancelled",
        message: "You have successfully cancelled your participation!",
        onOkay: () => {
          setLoading(false);
        },
      });
    } else {
      const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
      dispatch(
        joinEvent({
          eventId: event.id,
          userId: currentUser.id,
          fullName: fullName,
        }),
      );
      showSuccessAlert({
        title: "Joined Successfully",
        message: "You have successfully joined the event!",
        onOkay: () => {
          setLoading(false);
        },
      });
    }
  }, [
    event,
    currentUser,
    hasUserJoined,
    isUserOrganizer,
    dispatch,
    checkIsEventExpired,
  ]);

  const handleCancelEvent = useCallback(() => {
    if (!event) return;

    setLoading(true);
    dispatch(
      cancelEvent({ eventId: event.id, organizerId: event.organizerId }),
    );
    showSuccessAlert({
      title: "Event Cancelled",
      message: "Event cancelled! Users can still rejoin until it expires.",
      onOkay: () => {
        setShowConfirmation(false);
        setLoading(false);
      },
    });
  }, [event, dispatch]);

  const handleReactivateEvent = useCallback(() => {
    if (!event) return;

    setLoading(true);
    dispatch(
      reactivateEvent({
        eventId: event.id,
        organizerId: event.organizerId,
        organizerName: event.organizerName,
      }),
    );
    showSuccessAlert({
      title: "Event Reactivated",
      message: "Event is now active again!",
      onOkay: () => {
        setShowConfirmation(false);
        setLoading(false);
      },
    });
  }, [event, dispatch]);

  const handleActionPress = useCallback(() => {
    if (isUserOrganizer && !checkIsEventStarted()) {
      if (event?.isCancelledByOrganizer) {
        handleReactivateEvent();
      } else {
        setShowConfirmation(true);
      }
    } else {
      handleJoinPress();
    }
  }, [
    isUserOrganizer,
    checkIsEventStarted,
    event?.isCancelledByOrganizer,
    handleJoinPress,
    handleReactivateEvent,
  ]);

  const handleAcceptParticipant = useCallback(
    (userId: string) => {
      if (!event) return;
      dispatch(acceptParticipant({ eventId: event.id, userId }));
      showSuccessAlert({
        title: "Participant Accepted",
        message: "Participant has been accepted!",
        onOkay: () => {},
      });
    },
    [event, dispatch],
  );

  const handleRejectParticipant = useCallback(
    (userId: string) => {
      if (!event) return;
      dispatch(rejectParticipant({ eventId: event.id, userId }));
      showSuccessAlert({
        title: "Participant Rejected",
        message: "Participant has been removed!",
        onOkay: () => {},
      });
    },
    [event, dispatch],
  );
  if (!event || !formattedData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <Feather name="x" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <Feather name="x" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        data={[""]}
        keyExtractor={() => "dummy".toString()}
        renderItem={() => (
          <View style={styles.scrollContent}>
            <View style={styles.sportContainer}>
              <View style={styles.sportBadge}>
                <Text style={styles.sportLabel}>{getSportLabel()}</Text>
              </View>
              {event?.isCancelledByOrganizer &&
                !checkIsEventExpired() &&
                !isEventFull && (
                  <View style={styles.availableBadge}>
                    <Text style={styles.availableLabel}>Available to Join</Text>
                  </View>
                )}
              {isEventFull && !event?.isCancelledByOrganizer && (
                <View style={styles.fullBadge}>
                  <Text style={styles.fullLabel}>Event Full</Text>
                </View>
              )}
              {isEventFull &&
                event?.isCancelledByOrganizer &&
                !checkIsEventExpired() && (
                  <View style={styles.fullBadge}>
                    <Text style={styles.fullLabel}>Event Full</Text>
                  </View>
                )}
              {event?.isCancelledByOrganizer && checkIsEventExpired() && (
                <View style={styles.cancelledBadge}>
                  <Text style={styles.cancelledLabel}>Cancelled</Text>
                </View>
              )}
            </View>

            <Text style={styles.title}>{event.title}</Text>

            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <Feather name="calendar" size={20} color={colors.blue} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Date & Time</Text>
                  <Text style={styles.infoValue}>{formattedData.date}</Text>
                  <Text style={styles.infoValue}>{formattedData.time}</Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <Feather name="map-pin" size={20} color={colors.blue} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue} numberOfLines={2}>
                    {event.location}
                  </Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <Feather name="user" size={20} color={colors.blue} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Organizer</Text>
                  <Text style={styles.infoValue}>{event.organizerName}</Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <Feather name="users" size={20} color={colors.blue} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Players</Text>
                  <Text style={styles.infoValue}>
                    {event.requests.length} / {event.maxPlayers}
                  </Text>
                  <Text
                    style={[
                      styles.spotsText,
                      isEventFull && styles.spotsTextFull,
                    ]}
                  >
                    {isEventFull
                      ? "Event is Full"
                      : event?.isCancelledByOrganizer && checkIsEventExpired()
                        ? "Event Cancelled"
                        : `${availableSpots} spot${availableSpots !== 1 ? "s" : ""} available`}
                  </Text>
                </View>
              </View>
            </View>

            <ParticipantsList
              participants={event.requests}
              maxPlayers={event.maxPlayers}
              organizerId={event.organizerId}
              isUserOrganizer={isUserOrganizer}
              isExpired={checkIsEventExpired()}
              onAcceptParticipant={handleAcceptParticipant}
              onRejectParticipant={handleRejectParticipant}
            />

            <View style={styles.footer}>
              <EventActionButton
                isExpired={checkIsEventExpired()}
                isStarted={checkIsEventStarted()}
                isUserOrganizer={isUserOrganizer}
                hasUserJoined={hasUserJoined}
                isEventFull={isEventFull}
                isCancelledByOrganizer={event?.isCancelledByOrganizer}
                onPress={handleActionPress}
                loading={loading}
              />
            </View>

            <CancelEventConfirmation
              visible={showConfirmation}
              eventTitle={event.title}
              isOrganizer={isUserOrganizer}
              onConfirm={handleCancelEvent}
              onCancel={() => setShowConfirmation(false)}
              loading={loading}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.blue,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "16@ms",
    paddingVertical: "12@ms",
    paddingTop: "16@ms",
  },
  closeButton: {
    padding: "8@ms",
  },
  headerTitle: {
    fontSize: "18@ms",
    fontWeight: "600",
    color: colors.white,
  },
  placeholder: {
    width: "40@ms",
  },

  scrollContent: {
    paddingHorizontal: "16@ms",
    paddingVertical: "20@ms",
    paddingBottom: "80@ms",
    flex: 1,
  },
  sportContainer: {
    alignItems: "center",
    marginBottom: "16@ms",
    gap: "12@ms",
  },
  sportBadge: {
    backgroundColor: colors.blue,
    paddingHorizontal: "20@ms",
    paddingVertical: "8@ms",
    borderRadius: "20@ms",
  },
  sportLabel: {
    fontSize: "14@ms",
    fontWeight: "600",
    color: colors.white,
  },
  cancelledBadge: {
    backgroundColor: "#DC3545",
    paddingHorizontal: "20@ms",
    paddingVertical: "8@ms",
    borderRadius: "20@ms",
  },
  cancelledLabel: {
    fontSize: "14@ms",
    fontWeight: "600",
    color: colors.white,
  },
  availableBadge: {
    backgroundColor: "#28A745",
    paddingHorizontal: "20@ms",
    paddingVertical: "8@ms",
    borderRadius: "20@ms",
  },
  availableLabel: {
    fontSize: "14@ms",
    fontWeight: "600",
    color: colors.white,
  },
  fullBadge: {
    backgroundColor: "#DC3545",
    paddingHorizontal: "20@ms",
    paddingVertical: "8@ms",
    borderRadius: "20@ms",
  },
  fullLabel: {
    fontSize: "14@ms",
    fontWeight: "600",
    color: colors.white,
  },
  title: {
    fontSize: "24@ms",
    fontWeight: "700",
    color: colors.black,
    marginBottom: "24@ms",
    textAlign: "center",
  },
  infoSection: {
    marginBottom: "24@ms",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: "12@ms",
    padding: "16@ms",
    marginBottom: "12@ms",
    alignItems: "flex-start",
  },
  infoIconContainer: {
    width: "40@ms",
    height: "40@ms",
    borderRadius: "20@ms",
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: "12@ms",
    borderWidth: "1@ms",
    borderColor: colors.light_grey,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: "12@ms",
    fontWeight: "600",
    color: colors.grey,
    marginBottom: "4@ms",
  },
  infoValue: {
    fontSize: "14@ms",
    fontWeight: "500",
    color: colors.black,
  },
  spotsText: {
    fontSize: "12@ms",
    color: colors.green,
    marginTop: "4@ms",
    fontWeight: "500",
  },
  spotsTextFull: {
    color: colors.red,
  },
  footer: {
    paddingHorizontal: "16@ms",
    paddingVertical: "16@ms",
    paddingBottom: "24@ms",
    borderTopWidth: "1@ms",
    borderTopColor: colors.light_grey,
  },

  participantsSection: {
    marginBottom: "24@ms",
  },
  participantsTitle: {
    fontSize: "16@ms",
    fontWeight: "700",
    color: colors.black,
    marginBottom: "12@ms",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: "16@ms",
    color: colors.grey,
  },
});

export default eventdetails;
