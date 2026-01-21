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
import { showErrorAlert } from "../../components/SuccessAlert";
import TextInput from "../../components/TextInput";
import { login as loginAction } from "../../redux/reducer/authSlice";
import type { RootState } from "../../redux/store";
import { colors } from "../../utils/colors";

interface FormErrors {
  email?: string;
  password?: string;
}

const login = () => {
  const router: any = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [isLoginAttempt, setIsLoginAttempt] = useState(false);

  useEffect(() => {
    if (isLoginAttempt) {
      if (authState.loginStatus === "success" && authState.isLoggedIn) {
        setIsLoginAttempt(false);
        setLoading(false);
        router.push("/(dashboard)/(drawer)/(tabs)/home");
      } else if (authState.loginStatus === "failed") {
        showErrorAlert({
          title: "Login Failed",
          message:
            authState.errorMessage ||
            "Invalid email or password. Please try again.",
        });
        setIsLoginAttempt(false);
        setLoading(false);
      }
    }
  }, [authState, isLoginAttempt, router]);

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

    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setIsLoginAttempt(true);
    Keyboard.dismiss();
    dispatch(loginAction({ email, password }));
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

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in with your email and password
        </Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          label="Email"
          placeholder="Enter your email"
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

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
        />

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <Text style={styles.signupLink}>Sign up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default login;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: "24@ms",
    paddingVertical: "20@ms",
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
  signupLink: {
    fontSize: "14@ms",
    color: colors.blue,
    fontWeight: "600",
  },
});
