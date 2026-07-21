import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setServerError("");
    try {
      await registerUser(formData);
      navigate("/login", { state: { justRegistered: true } });
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6 py-6">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl px-8 py-9">
        <h1 className="text-2xl font-bold text-heading text-center mb-1.5">
          Create your account
        </h1>
        <p className="text-sm text-paragraph text-center mb-7">
          Join to start creating and collaborating in real time.
        </p>

        {serverError && (
          <div className="bg-field border border-red-500 text-red-400 text-sm rounded-lg px-3 py-2.5 mb-4 text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FormInput label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} placeholder="e.g. Jane Smith" />
          <FormInput label="Username" name="username" value={formData.username} onChange={handleChange} error={errors.username} placeholder="e.g. janesmith" />
          <FormInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="e.g. jane@example.com" />
          <FormInput label="Password" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="At least 6 characters" />
          <FormInput label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="Re-enter your password" />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 rounded-lg text-white text-base font-semibold bg-primary hover:bg-primaryHover transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-paragraph mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:text-primaryHover hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;