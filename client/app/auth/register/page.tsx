"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRegisterMutation } from "../../../lib/apis";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setCredentials } from "@/lib/authSlice";
import Link from "next/link";
import PageHeader from "@/app/components/PageHeader";

type RegisterFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [registerApi, { isLoading, error }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password");

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      const registerData = {
        name: data.firstName + " " + data.lastName,
        email: data.email,
        username: data.username,
        mobileNumber: data.mobileNumber,
        password: data.password,
      };
      const res = await registerApi(registerData).unwrap();
      dispatch(setCredentials({ token: res.accessToken, user: res.user }));
      router.push("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <>
      <PageHeader title="Register" />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex bg-white rounded-full p-1 shadow-sm max-w-xs mx-auto border-[0.5px] border-primary">
            <div className="flex-1 bg-primary text-white text-center py-2 px-4 rounded-full text-sm font-medium">
              Register
            </div>
            <Link
              href="/auth/login"
              className="flex-1 text-gray-600 text-center py-2 px-4 rounded-full text-sm font-medium hover:text-gray-800"
            >
              Login
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Register</h2>
              <p className="text-sm text-gray-600 mt-2">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
                  Login Here
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Personal Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name*
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      {...register("firstName", { required: "First name is required", maxLength: 50 })}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      {...register("lastName", { maxLength: 50 })}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="space-y-4 mt-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                    })}
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username*
                  </label>
                  <input
                    id="username"
                    type="text"
                    {...register("username", { required: "Username is required", maxLength: 30 })}
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>}
                </div>

                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number*
                  </label>
                  <input
                    id="mobileNumber"
                    type="tel"
                    {...register("mobileNumber", {
                      required: "Mobile number is required",
                      pattern: { value: /^[0-9]{7,15}$/, message: "Invalid mobile number" },
                    })}
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.mobileNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.mobileNumber && <p className="text-red-600 text-sm mt-1">{errors.mobileNumber.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password*
                    </label>
                    <input
                      id="password"
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Minimum 6 characters" },
                        maxLength: { value: 50, message: "Maximum 50 characters" },
                      })}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password*
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword", {
                        required: "Confirm password is required",
                        validate: (value) => value === password || "Passwords do not match",
                      })}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-4">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  {...register("agreeToTerms", { required: "You must agree to the Terms & Conditions" })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-600">
                  I agree to the Terms & Conditions
                </label>
              </div>
              {errors.agreeToTerms && <p className="text-red-600 text-sm mt-1">{errors.agreeToTerms.message}</p>}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-3">
                  <p className="text-red-600 text-sm">
                    {"data" in error ? (error.data as { message?: string })?.message || "Registration failed" : "Registration failed. Please try again."}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white rounded-md py-3 px-4 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm mt-4"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
