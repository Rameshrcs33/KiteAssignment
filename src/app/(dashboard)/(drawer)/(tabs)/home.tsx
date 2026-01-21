import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { useSelector } from "react-redux";
import EventCard from "../../../../components/EventCard";
import Header from "../../../../components/Header";
import { Event } from "../../../../redux/reducer/eventSlice";
import { RootState } from "../../../../redux/store";
import { colors } from "../../../../utils/colors";
import { isEventExpired } from "../../../../utils/dateTimeUtils";

const home = () => {
  const router = useRouter();
  const events = useSelector((state: RootState) => state.event.events);

  const sortedEvents = useMemo(() => {
    const upcomingEvents = events.filter((event) => {
      return !isEventExpired(event.startDate, event.startTime);
    });

    return upcomingEvents.sort((a, b) => {
      const dateComparison = a.startDate.localeCompare(b.startDate);
      if (dateComparison !== 0) {
        return dateComparison;
      }

      return a.startTime.localeCompare(b.startTime);
    });
  }, [events]);

  const handleEventPress = useCallback(
    (eventId: string) => {
      router.push({
        pathname: "/eventdetails",
        params: { eventId },
      });
    },
    [router],
  );

  const renderEventCard: ListRenderItem<Event> = useCallback(
    ({ item }) => <EventCard event={item} onPress={handleEventPress} />,
    [handleEventPress],
  );

  const keyExtractor = useCallback((item: Event) => item.id, []);

  const emptyListComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Events Yet</Text>
        <Text style={styles.emptyText}>
          Create your first event to get started!
        </Text>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <Header title={"Event List"} />
      <FlatList
        data={sortedEvents}
        renderItem={renderEventCard}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={emptyListComponent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default home;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingVertical: "12@ms",
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "24@ms",
  },
  emptyTitle: {
    fontSize: "18@ms",
    fontWeight: "600",
    color: colors.black,
    marginBottom: "8@ms",
  },
  emptyText: {
    fontSize: "14@ms",
    color: colors.grey,
    textAlign: "center",
  },
});
