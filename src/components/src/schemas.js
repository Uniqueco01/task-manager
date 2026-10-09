import * as yup from "yup";

export const signupSchema = yup.object({
  username: yup
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters")
    .required("Username is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    )
    .required("Password is required"),
  // securityQuestion: yup.string().required("Choose a security question"),
  // securityAnswer: yup
  //   .string()
  //   .trim()
  //   .min(3, "At least 3 characters")
  //   .required("Answer is required"),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is requried"),
  password: yup.string().required("Password is required"),
});

export const forgotSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is requried"),
});
export const securityResetSchema = yup.object({
  securityAnswer: yup.string().trim().required("Answer is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});
