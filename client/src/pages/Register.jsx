import React, { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  Navigate,
} from "react-router-dom";
import FormInput from "../components/FormInput";
import { validateRegisterForm } from "../utils/validation";
import { registerUser } from "../services/authService";

const initialFormState = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const nextParam = searchParams.get("next");

  const loginLinkTo = nextParam
    ? `/login?next=${encodeURIComponent(nextParam)}`
    : "/login";

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (token) {
    return <Navigate to={nextParam || "/dashboard"} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (serverError) {
      setServerError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm(formData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser(formData);
      navigate(loginLinkTo);
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F0F7FF",
      fontFamily: "Arial, sans-serif",
      padding: "40px 20px",
      boxSizing: "border-box",
    },

    card: {
      width: "100%",
      maxWidth: "460px",
      backgroundColor: "#FFFFFF",
      border: "1px solid #DBEAFE",
      borderRadius: "16px",
      padding: "40px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
      boxSizing: "border-box",
    },

    heading: {
      textAlign: "center",
      color: "#1E3A8A",
      marginBottom: "10px",
      fontSize: "32px",
      fontWeight: "bold",
    },

    subHeading: {
      textAlign: "center",
      color: "#64748B",
      marginBottom: "30px",
      fontSize: "15px",
      lineHeight: "1.5",
    },

    button: {
      width: "100%",
      backgroundColor: "#2563EB",
      color: "#FFFFFF",
      border: "none",
      padding: "17px",
      borderRadius: "8px",
      fontSize: "18px",
      fontWeight: "600",
      marginTop: "25px",
      cursor: isSubmitting ? "not-allowed" : "pointer",
      boxShadow: "0 4px 10px rgba(37, 99, 235, 0.20)",
      transition: "all 0.2s ease",
      opacity: isSubmitting ? 0.7 : 1,
    },

    footer: {
      textAlign: "center",
      marginTop: "20px",
      color: "#475569",
      fontSize: "15px",
    },

    link: {
      color: "#2563EB",
      textDecoration: "none",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Create your account</h1>

        <p style={styles.subHeading}>
          Join to start creating and collaborating in real time.
        </p>

        {nextParam && (
          <div
            style={{
              padding: "10px 12px",
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: "8px",
              color: "#1E3A8A",
              fontSize: "13px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            Create an account to join your shared room.
          </div>
        )}

        {serverError && (
          <div
            style={{
              padding: "10px 12px",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "8px",
              color: "#DC2626",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <FormInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Jane Smith"
              error={errors.fullName}
            />

            <FormInput
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. janesmith"
              error={errors.username}
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. jane@example.com"
              error={errors.email}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              error={errors.password}
            />

            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              error={errors.confirmPassword}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={styles.button}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = "#1D4ED8";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 14px rgba(37, 99, 235, 0.25)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2563EB";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 10px rgba(37, 99, 235, 0.20)";
            }}
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to={loginLinkTo} style={styles.link}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;