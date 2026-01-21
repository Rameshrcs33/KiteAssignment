import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DropdownItem } from "../../components/Dropdown";

export interface Participant {
  userId: string;
  fullName: string;
  isAccepted?: boolean;
}

export interface Event {
  id: string;
  title: string;
  sport: string | number;
  startTime: string;
  startDate: string;
  maxPlayers: number;
  organizerId: string;
  organizerName: string;
  location: string;
  requests: Participant[];
  isCancelledByOrganizer?: boolean;
  cancelledAt?: string;
  originalStartDate?: string;
  originalStartTime?: string;
}

interface EventState {
  sports: DropdownItem[];
  events: Event[];
}

interface JoinEventPayload {
  eventId: string;
  userId: string;
  fullName: string;
}

interface CancelJoinPayload {
  eventId: string;
  userId: string;
}

interface AcceptParticipantPayload {
  eventId: string;
  userId: string;
}

interface RejectParticipantPayload {
  eventId: string;
  userId: string;
}

interface OrganizerActionPayload {
  eventId: string;
  organizerId: string;
}

interface ReactivateEventPayload extends OrganizerActionPayload {
  organizerName: string;
  originalStartDate?: string;
  originalStartTime?: string;
}

const SPORTS: DropdownItem[] = [
  { id: 1, label: "Cricket" },
  { id: 2, label: "Football" },
  { id: 3, label: "Basketball" },
  { id: 4, label: "Tennis" },
  { id: 5, label: "Badminton" },
  { id: 6, label: "Volleyball" },
  { id: 7, label: "Hockey" },
];

const initialState: EventState = {
  sports: SPORTS,
  events: [],
};

const findEventById = (events: Event[], eventId: string): Event | undefined => {
  return events.find((e) => e.id === eventId);
};

const hasParticipant = (requests: Participant[], userId: string): boolean => {
  return requests.some((p) => p.userId === userId);
};

const removeParticipant = (
  requests: Participant[],
  userId: string,
): Participant[] => {
  return requests.filter((p) => p.userId !== userId);
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setSports: (state, action: PayloadAction<DropdownItem[]>) => {
      state.sports = action.payload;
    },

    createEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },

    joinEvent: (state, action: PayloadAction<JoinEventPayload>) => {
      const event = findEventById(state.events, action.payload.eventId);
      if (!event) return;

      const { userId, fullName } = action.payload;
      const isFull = event.requests.length >= event.maxPlayers;
      const alreadyJoined = hasParticipant(event.requests, userId);

      if (!alreadyJoined && !isFull) {
        event.requests.push({ userId, fullName });
      }
    },

    cancelJoinEvent: (state, action: PayloadAction<CancelJoinPayload>) => {
      const event = findEventById(state.events, action.payload.eventId);
      if (!event) return;

      event.requests = removeParticipant(event.requests, action.payload.userId);
    },

    cancelEvent: (state, action: PayloadAction<OrganizerActionPayload>) => {
      const event = findEventById(state.events, action.payload.eventId);
      if (!event) return;

      event.isCancelledByOrganizer = true;
      event.cancelledAt = new Date().toISOString();
      event.originalStartDate = event.startDate;
      event.originalStartTime = event.startTime;
      event.startDate = new Date().toISOString().split("T")[0];
      event.startTime = "00:00";
      event.requests = removeParticipant(
        event.requests,
        action.payload.organizerId,
      );
    },

    reactivateEvent: (state, action: PayloadAction<ReactivateEventPayload>) => {
      const event = findEventById(state.events, action.payload.eventId);
      if (!event) return;

      event.isCancelledByOrganizer = false;
      event.cancelledAt = undefined;

      if (event.originalStartDate && event.originalStartTime) {
        event.startDate = event.originalStartDate;
        event.startTime = event.originalStartTime;
      }

      if (!hasParticipant(event.requests, action.payload.organizerId)) {
        event.requests.push({
          userId: action.payload.organizerId,
          fullName: action.payload.organizerName,
        });
      }
    },

    rejectEvent: (state, action: PayloadAction<OrganizerActionPayload>) => {
      const event = findEventById(state.events, action.payload.eventId);
      if (!event) return;

      event.isCancelledByOrganizer = true;
      event.cancelledAt = new Date().toISOString();
      event.originalStartDate = event.startDate;
      event.originalStartTime = event.startTime;
      event.startDate = new Date().toISOString().split("T")[0];
      event.startTime = "00:00";
      event.requests = removeParticipant(
        event.requests,
        action.payload.organizerId,
      );
    },

    acceptParticipant: (
      state,
      action: PayloadAction<AcceptParticipantPayload>,
    ) => {
      const event = findEventById(state.events, action.payload.eventId);
      if (!event) return;

      const participant = event.requests.find(
        (p) => p.userId === action.payload.userId,
      );
      if (participant) {
        participant.isAccepted = true;
      }
    },

    rejectParticipant: (
      state,
      action: PayloadAction<RejectParticipantPayload>,
    ) => {
      const event = findEventById(state.events, action.payload.eventId);
      if (!event) return;

      event.requests = removeParticipant(event.requests, action.payload.userId);
    },
  },
});

export const {
  setSports,
  createEvent,
  joinEvent,
  cancelJoinEvent,
  cancelEvent,
  reactivateEvent,
  rejectEvent,
  acceptParticipant,
  rejectParticipant,
} = eventSlice.actions;

export default eventSlice.reducer;
