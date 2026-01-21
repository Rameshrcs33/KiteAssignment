import { Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  TextInput as RNTextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import {
  showErrorAlert,
  showSuccessAlert,
} from "../../components/SuccessAlert";
import TextInput from "../../components/TextInput";
import {
  resetSignupStatus,
  signup as signupAction,
} from "../../redux/reducer/authSlice";
import { colors } from "../../utils/colors";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const signup = () => {
  const router: any = useRouter();
  const dispatch = useDispatch();
  const signupStatus = useSelector((state: any) => state.auth.signupStatus);
  const errorMessage = useSelector((state: any) => state.auth.errorMessage);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (signupStatus === "duplicate") {
      setLoading(false);
      showErrorAlert({
        title: "Registration Failed",
        message:
          errorMessage ||
          "This account is already registered. Please use different credentials.",
      });
      dispatch(resetSignupStatus());
    } else if (signupStatus === "success") {
      setLoading(false);
      const timestamp = new Date().getTime();
      const userId = `USER_${timestamp}`;
      showSuccessAlert({
        title: "Signup Successful!",
        message: `Your account has been created successfully with ID: ${userId}`,
        onOkay: () => {
          setFirstName("");
          setLastName("");
          setMobileNumber("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          dispatch(resetSignupStatus());
          router.push("/(auth)/login");
        },
      });
    }
  }, [signupStatus, errorMessage, dispatch, router]);

  const validateFirstName = (name: string): string | undefined => {
    if (!name.trim()) {
      return "First name is required";
    }

    if (name.trim().length < 2) {
      return "First name must be at least 2 characters";
    }

    if (name.trim().length > 50) {
      return "First name must not exceed 50 characters";
    }

    if (!/^[a-zA-Z\s'-]*$/.test(name)) {
      return "First name can only contain letters, spaces, hyphens, and apostrophes";
    }

    return undefined;
  };

  const validateLastName = (name: string): string | undefined => {
    if (!name.trim()) {
      return "Last name is required";
    }

    if (name.trim().length < 2) {
      return "Last name must be at least 2 characters";
    }

    if (name.trim().length > 50) {
      return "Last name must not exceed 50 characters";
    }

    if (!/^[a-zA-Z\s'-]*$/.test(name)) {
      return "Last name can only contain letters, spaces, hyphens, and apostrophes";
    }

    return undefined;
  };

  const validateMobileNumber = (phone: string): string | undefined => {
    if (!phone.trim()) {
      return "Mobile number is required";
    }

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      return "Mobile number must be exactly 10 digits";
    }

    if (!/^\d+$/.test(cleanPhone)) {
      return "Mobile number must contain only digits";
    }

    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address";
    }

    return undefined;
  };

  const validatePassword = (pwd: string): string | undefined => {
    if (!pwd) {
      return "Password is required";
    }

    if (pwd.length < 8) {
      return "Password must be at least 8 characters";
    }

    if (pwd.length > 50) {
      return "Password cannot exceed 50 characters";
    }

    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least one uppercase letter";
    }

    if (!/[a-z]/.test(pwd)) {
      return "Password must contain at least one lowercase letter";
    }

    if (!/[0-9]/.test(pwd)) {
      return "Password must contain at least one number";
    }

    if (!/[!@#$%^&*]/.test(pwd)) {
      return "Password must contain at least one special character (!@#$%^&*)";
    }

    return undefined;
  };

  const validateConfirmPassword = (
    pwd: string,
    confirmPwd: string,
  ): string | undefined => {
    if (!confirmPwd) {
      return "Please confirm your password";
    }

    if (pwd !== confirmPwd) {
      return "Passwords do not match";
    }

    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const firstNameError = validateFirstName(firstName);
    if (firstNameError) {
      newErrors.firstName = firstNameError;
    }

    const lastNameError = validateLastName(lastName);
    if (lastNameError) {
      newErrors.lastName = lastNameError;
    }

    const mobileError = validateMobileNumber(mobileNumber);
    if (mobileError) {
      newErrors.mobileNumber = mobileError;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword,
    );
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    Keyboard.dismiss();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const timestamp = new Date().getTime();
    const userId = `USER_${timestamp}`;

    dispatch(
      signupAction({
        id: userId,
        firstName,
        lastName,
        mobileNumber,
        email,
        password,
      }),
    );
  };

  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
    if (errors.firstName) {
      setErrors({ ...errors, firstName: undefined });
    }
  };

  const handleLastNameChange = (text: string) => {
    setLastName(text);
    if (errors.lastName) {
      setErrors({ ...errors, lastName: undefined });
    }
  };

  const handleMobileChange = (text: string) => {
    const numericText = text.replace(/[^\d]/g, "");
    setMobileNumber(numericText);
    if (errors.mobileNumber) {
      setErrors({ ...errors, mobileNumber: undefined });
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) {
      setErrors({ ...errors, email: undefined });
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) {
      setErrors({ ...errors, password: undefined });
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: undefined });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      style={styles.container}
      scrollEnabled={true}
      nestedScrollEnabled={true}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          label="First Name"
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={handleFirstNameChange}
          keyboardType="default"
          error={errors.firstName}
          editable={!loading}
          maxLength={50}
        />

        <TextInput
          label="Last Name"
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={handleLastNameChange}
          keyboardType="default"
          error={errors.lastName}
          editable={!loading}
          maxLength={50}
        />

        <TextInput
          label="Mobile Number"
          placeholder="Enter your mobile number"
          value={mobileNumber}
          onChangeText={handleMobileChange}
          keyboardType="phone-pad"
          error={errors.mobileNumber}
          editable={!loading}
          maxLength={10}
        />

        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          error={errors.email}
          editable={!loading}
          maxLength={100}
        />
        {/* Password Field */}
        <View style={styles.passwordFieldContainer}>
          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.passwordInputWrapper,
              errors.password && styles.passwordInputWrapperError,
            ]}
          >
            <RNTextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor={colors.light_grey}
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={!showPassword}
              editable={!loading}
              maxLength={50}
            />
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={colors.grey}
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Confirm Password Field */}
        <View style={styles.passwordFieldContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View
            style={[
              styles.passwordInputWrapper,
              errors.confirmPassword && styles.passwordInputWrapperError,
            ]}
          >
            <RNTextInput
              style={styles.passwordInput}
              placeholder="Confirm your password"
              placeholderTextColor={colors.light_grey}
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
              maxLength={50}
            />
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              <Feather
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color={colors.grey}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        <Button
          title="Sign Up"
          onPress={handleSignup}
          loading={loading}
          disabled={loading}
        />

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Text style={styles.loginLink}>Sign in</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default signup;
const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: "24@ms",
    paddingTop: "40@ms",
    paddingBottom: "60@ms",
  },
  headerContainer: {
    marginBottom: "40@ms",
    alignItems: "center",
  },
  title: {
    fontSize: "28@ms",
    fontWeight: "700",
    color: colors.black,
    marginBottom: "8@ms",
  },
  subtitle: {
    fontSize: "14@ms",
    color: colors.grey,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: "14@ms",
    fontWeight: "600",
    color: colors.black,
    marginBottom: "8@ms",
  },
  passwordFieldContainer: {
    marginBottom: "16@ms",
    width: "100%",
  },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: "1@ms",
    borderColor: colors.light_grey,
    borderRadius: "8@ms",
    paddingHorizontal: "12@ms",
    backgroundColor: colors.white,
  },
  passwordInputWrapperError: {
    borderColor: colors.red,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: "4@ms",
    paddingVertical: "12@ms",
    fontSize: "16@ms",
    color: colors.black,
  },
  toggleButton: {
    padding: "8@ms",
  },
  errorText: {
    fontSize: "12@ms",
    color: colors.red,
    marginTop: "6@ms",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "24@ms",
  },
  footerText: {
    fontSize: "14@ms",
    color: colors.grey,
  },
  loginLink: {
    fontSize: "14@ms",
    color: colors.blue,
    fontWeight: "600",
  },
});
