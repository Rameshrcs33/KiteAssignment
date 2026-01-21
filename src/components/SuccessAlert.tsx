import { Alert } from "react-native";

interface SuccessAlertProps {
  title: string;
  message: string;
  onOkay: () => void;
}

export const showSuccessAlert = ({
  title,
  message,
  onOkay,
}: SuccessAlertProps) => {
  Alert.alert(title, message, [
    {
      text: "Okay",
      onPress: onOkay,
    },
  ]);
};

interface ErrorAlertProps {
  title: string;
  message: string;
}

export const showErrorAlert = ({ title, message }: ErrorAlertProps) => {
  Alert.alert(title, message);
};

interface ConfirmAlertProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const showConfirmAlert = ({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmAlertProps) => {
  Alert.alert(title, message, [
    {
      text: "Cancel",
      onPress: onCancel,
      style: "cancel",
    },
    {
      text: "Okay",
      onPress: onConfirm,
      style: "destructive",
    },
  ]);
};
