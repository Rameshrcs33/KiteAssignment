import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../../components/Button";
import Dropdown, { DropdownItem } from "../../../../components/Dropdown";
import Header from "../../../../components/Header";
import {
  showErrorAlert,
  showSuccessAlert,
} from "../../../../components/SuccessAlert";
import TextInput from "../../../../components/TextInput";
import { createEvent as createEventAction } from "../../../../redux/reducer/eventSlice";
import { RootState } from "../../../../redux/store";
import { colors } from "../../../../utils/colors";

interface FormErrors {
  eventName?: string;
  sport?: string;
  startDate?: string;
  startTime?: string;
  numberOfPlayers?: string;
  location?: string;
}

const CreateEvent = () => {
  const dispatch = useDispatch();
  const sports = useSelector((state: RootState) => state.event.sports);
  const user = useSelector((state: RootState) => state.auth.user);
  const [eventName, setEventName] = useState<string>("");
  const [sport, setSport] = useState<string | number>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [numberOfPlayers, setNumberOfPlayers] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [showStartDatePicker, setShowStartDatePicker] =
    useState<boolean>(false);

  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [timePickerDate, setTimePickerDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);

  const resetForm = () => {
    setEventName("");
    setSport("");
    setStartDate(null);
    setStartTime("");
    setNumberOfPlayers("");
    setLocation("");
    setErrors({});
  };

  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, []),
  );

  const validateEventName = (name: string): string | undefined => {
    if (!name.trim()) {
      return "Event name is required";
    }
    if (name.trim().length < 3) {
      return "Event name must be at least 3 characters";
    }
    if (name.trim().length > 50) {
      return "Event name cannot exceed 50 characters";
    }
    return undefined;
  };

  const validateSport = (sport: string | number): string | undefined => {
    if (!sport || sport === "") {
      return "Please select a sport";
    }
    return undefined;
  };

  const validateStartDate = (date: Date | null): string | undefined => {
    if (!date) {
      return "Event start date is required";
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return "Event start date must be today or in the future";
    }
    return undefined;
  };

  const validateStartTime = (time: string): string | undefined => {
    if (!time || !time.trim()) {
      return "Event start time is required";
    }
    return undefined;
  };

  const validateNumberOfPlayers = (players: string): string | undefined => {
    if (!players.trim()) {
      return "Number of players is required";
    }
    const playerCount = parseInt(players, 10);
    if (isNaN(playerCount)) {
      return "Number of players must be a valid number";
    }
    if (playerCount < 1) {
      return "Number of players must be at least 1";
    }
    if (playerCount > 1000) {
      return "Number of players cannot exceed 1000";
    }
    return undefined;
  };

  const validateLocation = (location: string): string | undefined => {
    if (!location.trim()) {
      return "Event location is required";
    }
    if (location.trim().length < 3) {
      return "Location must be at least 3 characters";
    }
    if (location.trim().length > 100) {
      return "Location cannot exceed 100 characters";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const eventNameError = validateEventName(eventName);
    if (eventNameError) newErrors.eventName = eventNameError;

    const sportError = validateSport(sport);
    if (sportError) newErrors.sport = sportError;

    const startDateError = validateStartDate(startDate);
    if (startDateError) newErrors.startDate = startDateError;

    const startTimeError = validateStartTime(startTime);
    if (startTimeError) newErrors.startTime = startTimeError;

    const playersError = validateNumberOfPlayers(numberOfPlayers);
    if (playersError) newErrors.numberOfPlayers = playersError;

    const locationError = validateLocation(location);
    if (locationError) newErrors.location = locationError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEventNameChange = (text: string) => {
    setEventName(text);
    const error = validateEventName(text);
    setErrors({ ...errors, eventName: error });
  };

  const handleSportChange = (selectedItem: DropdownItem) => {
    setSport(selectedItem.id);
    const error = validateSport(selectedItem.id);
    setErrors({ ...errors, sport: error });
  };

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    const error = validateStartDate(date);
    setErrors({ ...errors, startDate: error });
  };

  const handlePlayersChange = (text: string) => {
    setNumberOfPlayers(text);
    const error = validateNumberOfPlayers(text);
    setErrors({ ...errors, numberOfPlayers: error });
  };

  const handleLocationChange = (text: string) => {
    setLocation(text);
    const error = validateLocation(text);
    setErrors({ ...errors, location: error });
  };

  const handleTimeConfirm = (time: Date) => {
    setTimePickerDate(time);
    const timeString = time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setStartTime(timeString);
    const error = validateStartTime(timeString);
    setErrors({ ...errors, startTime: error });
    setShowTimePicker(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showErrorAlert({
        title: "Validation Error",
        message: "Please fix all errors before submitting",
      });
      return;
    }

    setLoading(true);
    if (!user) {
      showErrorAlert({
        title: "Error",
        message: "User information not found. Please login again.",
      });
      setLoading(false);
      return;
    }

    const year = startDate!.getFullYear();
    const month = String(startDate!.getMonth() + 1).padStart(2, "0");
    const day = String(startDate!.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    const organizerFullName = `${user.firstName} ${user.lastName}`;
    const eventData = {
      id: Date.now().toString(),
      title: eventName,
      sport,
      startTime: startTime,
      startDate: dateString,
      maxPlayers: parseInt(numberOfPlayers, 10),
      organizerId: user.id,
      organizerName: organizerFullName,
      location,
      requests: [
        {
          userId: user.id,
          fullName: organizerFullName,
        },
      ],
    };

    dispatch(createEventAction(eventData));
    showSuccessAlert({
      title: "Success",
      message: "Event created successfully!",
      onOkay: () => {
        resetForm();
      },
    });
    setLoading(false);
  };

  const formatDateOnly = (date: Date | null): string => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Create New Event" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <TextInput
          label="Event Name"
          placeholder="Enter event name"
          value={eventName}
          onChangeText={handleEventNameChange}
          error={errors.eventName}
          editable={!loading}
          maxLength={50}
        />

        <Dropdown
          label="Sport"
          items={sports}
          selectedValue={sport}
          onSelect={handleSportChange}
          placeholder="Select a sport"
          disabled={loading}
          error={!!errors.sport}
        />
        {errors.sport && <Text style={styles.errorText}>{errors.sport}</Text>}

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Event Start Date</Text>
          <TouchableOpacity
            style={[
              styles.dateSelector,
              errors.startDate && styles.dateSelectorError,
            ]}
            onPress={() => setShowStartDatePicker(true)}
            disabled={loading}
          >
            <Text
              style={[
                styles.dateSelectorText,
                !startDate && styles.placeholderText,
              ]}
            >
              {formatDateOnly(startDate)}
            </Text>
          </TouchableOpacity>
          {errors.startDate && (
            <Text style={styles.errorText}>{errors.startDate}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Event Start Time</Text>
          <TouchableOpacity
            style={[
              styles.dateSelector,
              errors.startTime && styles.dateSelectorError,
            ]}
            onPress={() => setShowTimePicker(true)}
            disabled={loading}
          >
            <Text
              style={[
                styles.dateSelectorText,
                !startTime && styles.placeholderText,
              ]}
            >
              {startTime || "Select time"}
            </Text>
          </TouchableOpacity>
          {errors.startTime && (
            <Text style={styles.errorText}>{errors.startTime}</Text>
          )}
        </View>

        {showStartDatePicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, date) => {
              if (Platform.OS === "android") {
                setShowStartDatePicker(false);
                if (date) {
                  handleStartDateChange(date);
                }
              } else if (date) {
                handleStartDateChange(date);
              }
            }}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={timePickerDate}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            is24Hour={false}
            onChange={(event, time) => {
              if (Platform.OS === "android") {
                setShowTimePicker(false);
                if (time) {
                  handleTimeConfirm(time);
                }
              } else if (time) {
                handleTimeConfirm(time);
              }
            }}
          />
        )}

        <TextInput
          label="Number of Players"
          placeholder="Enter number of players"
          value={numberOfPlayers}
          onChangeText={handlePlayersChange}
          error={errors.numberOfPlayers}
          keyboardType="number-pad"
          editable={!loading}
          maxLength={4}
        />

        <TextInput
          label="Event Location"
          placeholder="Enter event location"
          value={location}
          onChangeText={handleLocationChange}
          error={errors.location}
          editable={!loading}
          maxLength={100}
        />

        <Button
          title="Create Event"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
        />
      </ScrollView>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: "16@ms",
    paddingVertical: "24@ms",
    paddingBottom: "32@ms",
  },

  fieldContainer: {
    marginTop: "16@ms",
    marginBottom: "16@ms",
    width: "100%",
  },
  label: {
    fontSize: "14@ms",
    fontWeight: "600",
    color: colors.black,
    marginBottom: "8@ms",
  },
  dateSelector: {
    borderWidth: "1@ms",
    borderColor: colors.light_grey,
    borderRadius: "8@ms",
    paddingHorizontal: "16@ms",
    paddingVertical: "12@ms",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  dateSelectorError: {
    borderColor: colors.red,
  },
  dateSelectorText: {
    fontSize: "16@ms",
    color: colors.black,
  },
  placeholderText: {
    color: colors.light_grey,
  },
  errorText: {
    fontSize: "12@ms",
    color: colors.red,
    marginTop: "6@ms",
  },
});

export default CreateEvent;
