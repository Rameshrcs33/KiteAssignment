import React, { useCallback } from "react";
import {
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { colors } from "../utils/colors";

interface Participant {
  userId: string;
  fullName: string;
  isAccepted?: boolean;
}

interface ParticipantsListProps {
  participants: Participant[];
  maxPlayers: number;
  organizerId: string;
  isUserOrganizer?: boolean;
  isExpired?: boolean;
  onAcceptParticipant?: (userId: string) => void;
  onRejectParticipant?: (userId: string) => void;
}

export default function ParticipantsList({
  participants,
  maxPlayers,
  organizerId,
  isUserOrganizer = false,
  isExpired = false,
  onAcceptParticipant,
  onRejectParticipant,
}: ParticipantsListProps) {
  const renderParticipantItem: ListRenderItem<Participant> = useCallback(
    ({ item: participant }) => (
      <View style={styles.participantItem}>
        <View style={styles.participantAvatarContainer}>
          <View style={styles.participantAvatar}>
            <Text style={styles.participantAvatarText}>
              {participant.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.participantInfo}>
          <Text style={styles.participantName}>
            {participant.userId === organizerId
              ? `${participant.fullName} (Organizer)`
              : participant.fullName}
          </Text>
          <Text style={styles.participantId}>{participant.userId}</Text>
          {participant.isAccepted && (
            <Text style={styles.acceptedStatus}>✓ Accepted</Text>
          )}
        </View>
        {participant.userId === organizerId && (
          <View style={styles.organizerBadge}>
            <Text style={styles.organizerBadgeText}>Organizer</Text>
          </View>
        )}
        {isUserOrganizer &&
          !isExpired &&
          participant.userId !== organizerId &&
          !participant.isAccepted && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => onAcceptParticipant?.(participant.userId)}
              >
                <Text style={styles.acceptButtonText}>✓</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => onRejectParticipant?.(participant.userId)}
              >
                <Text style={styles.rejectButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
      </View>
    ),
    [
      organizerId,
      isUserOrganizer,
      isExpired,
      onAcceptParticipant,
      onRejectParticipant,
    ],
  );

  const keyExtractor = useCallback((item: Participant) => item.userId, []);

  return (
    <View style={styles.participantsSection}>
      <Text style={styles.participantsTitle}>
        Participants ({participants.length}/{maxPlayers})
      </Text>
      <FlatList
        data={participants}
        renderItem={renderParticipantItem}
        keyExtractor={keyExtractor}
        scrollEnabled={false}
        style={styles.participantsList}
      />
    </View>
  );
}

const styles = ScaledSheet.create({
  participantsSection: {
    marginBottom: "24@ms",
  },
  participantsTitle: {
    fontSize: "16@ms",
    fontWeight: "700",
    color: colors.black,
    marginBottom: "12@ms",
  },
  participantsList: {
    backgroundColor: "#f9f9f9",
    borderRadius: "12@ms",
    overflow: "hidden",
  },
  participantItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: "12@ms",
    paddingHorizontal: "16@ms",
    borderBottomWidth: "1@ms",
    borderBottomColor: colors.light_grey,
  },
  participantAvatarContainer: {
    marginRight: "12@ms",
  },
  participantAvatar: {
    width: "40@ms",
    height: "40@ms",
    borderRadius: "20@ms",
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
  },
  participantAvatarText: {
    fontSize: "16@ms",
    fontWeight: "600",
    color: colors.white,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: "14@ms",
    fontWeight: "600",
    color: colors.black,
    marginBottom: "2@ms",
  },
  participantId: {
    fontSize: "12@ms",
    color: colors.grey,
  },
  acceptedStatus: {
    fontSize: "11@ms",
    color: colors.green,
    fontWeight: "600",
    marginTop: "4@ms",
  },
  organizerBadge: {
    backgroundColor: colors.blue,
    paddingHorizontal: "8@ms",
    paddingVertical: "4@ms",
    borderRadius: "4@ms",
  },
  organizerBadgeText: {
    fontSize: "11@ms",
    fontWeight: "600",
    color: colors.white,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: "8@ms",
    marginLeft: "8@ms",
  },
  acceptButton: {
    width: "32@ms",
    height: "32@ms",
    borderRadius: "16@ms",
    backgroundColor: colors.green,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptButtonText: {
    fontSize: "16@ms",
    fontWeight: "600",
    color: colors.white,
  },
  rejectButton: {
    width: "32@ms",
    height: "32@ms",
    borderRadius: "16@ms",
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectButtonText: {
    fontSize: "16@ms",
    fontWeight: "600",
    color: colors.white,
  },
});
