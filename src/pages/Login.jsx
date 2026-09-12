import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Phone,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Building2,
} from "lucide-react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";


function Login({ onLogin }) {
  const [mode, setMode] = useState("Login");
  const [role, setRole] = useState("Patient");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [workerType, setWorkerType] = useState(
    "Community Health Worker"
  );

  const [specialization, setSpecialization] = useState(
    "General Medicine"
  );

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  // --------------------------------------------------
  // Password validation
  // --------------------------------------------------

  const validatePassword = (value) => {
    if (value.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number.";
    }

    if (!/[^A-Za-z0-9]/.test(value)) {
      return "Password must contain at least one special character.";
    }

    return "";
  };


  // --------------------------------------------------
  // Mobile number handler
  // --------------------------------------------------

  const handleMobileChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setMobile(value);
    setErrorMessage("");
  };


  // --------------------------------------------------
  // Create a Firebase-friendly email
  //
  // The current UI uses mobile number instead of email.
  // Firebase Email/Password authentication requires an
  // email, so we create an internal email from the mobile.
  // --------------------------------------------------

  const createLoginEmail = (mobileNumber) => {
    return `${mobileNumber}@caremitra.com`;
  };


  // --------------------------------------------------
  // Save user information in localStorage
  // --------------------------------------------------

  const saveUserLocally = (userData) => {
    localStorage.setItem(
      "caremitraUser",
      JSON.stringify(userData)
    );
  };


  // --------------------------------------------------
  // Login
  // --------------------------------------------------

  const handleLogin = async () => {
    const loginEmail = createLoginEmail(mobile);

    try {
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          loginEmail,
          password
        );

      const firebaseUser = userCredential.user;

      // Get the user's profile from Firestore
      const userDocRef = doc(
        db,
        "users",
        firebaseUser.uid
      );

      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        setErrorMessage(
          "User profile was not found. Please register this account first."
        );
        return;
      }

      const userData = {
        uid: firebaseUser.uid,
        ...userDoc.data(),
      };

      saveUserLocally(userData);

      setSuccessMessage("Login successful!");

      // Send the logged-in user to the main application
      if (onLogin) {
        onLogin(userData.role, userData);
      }

    } catch (error) {
      console.error("Login error:", error);

      let message =
        "Login failed. Please check your details.";

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        message =
          "Invalid mobile number or password.";
      } else if (
        error.code === "auth/too-many-requests"
      ) {
        message =
          "Too many login attempts. Please try again later.";
      } else if (
        error.code === "auth/network-request-failed"
      ) {
        message =
          "Network error. Please check your internet connection.";
      }

      setErrorMessage(message);
    }
  };


  // --------------------------------------------------
  // Registration
  // --------------------------------------------------

  const handleRegister = async () => {
    const passwordError = validatePassword(password);

    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (mobile.length !== 10) {
      setErrorMessage(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    const loginEmail = createLoginEmail(mobile);

    try {
      // Create Firebase Authentication account
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          loginEmail,
          password
        );

      const firebaseUser = userCredential.user;

      // Data stored in Firestore
      const userData = {
        uid: firebaseUser.uid,
        name: name.trim(),
        mobile: mobile,
        email: loginEmail,
        role: role,
        workerType:
          role === "Health Worker"
            ? workerType
            : "",
        specialization:
          role === "Doctor"
            ? specialization
            : "",
        createdAt: serverTimestamp(),
      };

      // Create users/{uid} document
      await setDoc(
        doc(db, "users", firebaseUser.uid),
        userData
      );

      // LocalStorage version
      const localUserData = {
        uid: firebaseUser.uid,
        name: name.trim(),
        mobile: mobile,
        email: loginEmail,
        role: role,
        workerType:
          role === "Health Worker"
            ? workerType
            : "",
        specialization:
          role === "Doctor"
            ? specialization
            : "",
        createdAt: new Date().toISOString(),
      };

      saveUserLocally(localUserData);

      setSuccessMessage(
        "Account created successfully!"
      );

      // Log the user into the application
      if (onLogin) {
        onLogin(role, localUserData);
      }

    } catch (error) {
      console.error("Registration error:", error);

      let message =
        "Registration failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        message =
          "An account already exists with this mobile number. Please login.";
      } else if (
        error.code === "auth/weak-password"
      ) {
        message =
          "Password is too weak. Please use a stronger password.";
      } else if (
        error.code === "auth/network-request-failed"
      ) {
        message =
          "Network error. Please check your internet connection.";
      }

      setErrorMessage(message);
    }
  };


  // --------------------------------------------------
  // Form submit
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!mobile || mobile.length !== 10) {
      setErrorMessage(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "Login") {
        await handleLogin();
      } else {
        await handleRegister();
      }
    } finally {
      setLoading(false);
    }
  };


  // --------------------------------------------------
  // Change between Login and Register
  // --------------------------------------------------

  const changeMode = (newMode) => {
    setMode(newMode);

    setErrorMessage("");
    setSuccessMessage("");

    // Clear form fields when switching
    setName("");
    setMobile("");
    setPassword("");
  };


  // --------------------------------------------------
  // Role icon
  // --------------------------------------------------

  const getRoleIcon = (selectedRole) => {
    if (selectedRole === "Patient") {
      return <HeartPulse size={18} />;
    }

    if (selectedRole === "Health Worker") {
      return <ShieldCheck size={18} />;
    }

    if (selectedRole === "Doctor") {
      return <Stethoscope size={18} />;
    }

    if (selectedRole === "Government Admin") {
      return <Building2 size={18} />;
    }

    return <User size={18} />;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        {/* ------------------------------------------------ */}
        {/* Logo / Header */}
        {/* ------------------------------------------------ */}

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg mb-4">
            <HeartPulse size={34} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            CareMitra
          </h1>

          <p className="text-gray-600 mt-2">
            Your healthcare companion
          </p>

        </div>


        {/* ------------------------------------------------ */}
        {/* Login Card */}
        {/* ------------------------------------------------ */}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">

          {/* Mode tabs */}

          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">

            <button
              type="button"
              onClick={() => changeMode("Login")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                mode === "Login"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => changeMode("Register")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                mode === "Register"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
            </button>

          </div>


          {/* Heading */}

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "Login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {mode === "Login"
                ? "Login to continue to CareMitra"
                : "Create your CareMitra account"}
            </p>

          </div>


          {/* ------------------------------------------------ */}
          {/* Role */}
          {/* ------------------------------------------------ */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>

            <div className="grid grid-cols-2 gap-2">

              {[
                "Patient",
                "Health Worker",
                "Doctor",
                "Government Admin",
              ].map((item) => (

                <button
                  key={item}
                  type="button"
                  onClick={() => setRole(item)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition ${
                    role === item
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                  }`}
                >
                  {getRoleIcon(item)}
                  <span>{item}</span>
                </button>

              ))}

            </div>

          </div>


          <form onSubmit={handleSubmit}>

            {/* ------------------------------------------------ */}
            {/* Full Name */}
            {/* ------------------------------------------------ */}

            {mode === "Register" && (

              <div className="mb-4">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                </div>

              </div>

            )}


            {/* ------------------------------------------------ */}
            {/* Mobile Number */}
            {/* ------------------------------------------------ */}

            <div className="mb-4">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>

              <div className="relative">

                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="tel"
                  inputMode="numeric"
                  value={mobile}
                  onChange={handleMobileChange}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

              </div>

              <p className="text-xs text-gray-400 mt-1">
                Enter your 10-digit mobile number
              </p>

            </div>


            {/* ------------------------------------------------ */}
            {/* Health Worker Type */}
            {/* ------------------------------------------------ */}

            {mode === "Register" &&
              role === "Health Worker" && (

                <div className="mb-4">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Health Worker Type
                  </label>

                  <select
                    value={workerType}
                    onChange={(event) =>
                      setWorkerType(event.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >

                    <option>
                      Community Health Worker
                    </option>

                    <option>
                      ASHA Worker
                    </option>

                    <option>
                      ANM
                    </option>

                    <option>
                      Field Health Worker
                    </option>

                  </select>

                </div>

              )}


            {/* ------------------------------------------------ */}
            {/* Doctor Specialization */}
            {/* ------------------------------------------------ */}

            {mode === "Register" &&
              role === "Doctor" && (

                <div className="mb-4">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>

                  <select
                    value={specialization}
                    onChange={(event) =>
                      setSpecialization(event.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >

                    <option>
                      General Medicine
                    </option>

                    <option>
                      Pediatrics
                    </option>

                    <option>
                      Cardiology
                    </option>

                    <option>
                      Dermatology
                    </option>

                    <option>
                      Gynecology
                    </option>

                    <option>
                      Orthopedics
                    </option>

                    <option>
                      Emergency Medicine
                    </option>

                  </select>

                </div>

              )}


            {/* ------------------------------------------------ */}
            {/* Password */}
            {/* ------------------------------------------------ */}

            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>


              {mode === "Register" && (

                <p className="text-xs text-gray-400 mt-1">
                  At least 8 characters with uppercase,
                  lowercase, number and special character.
                </p>

              )}

            </div>


            {/* ------------------------------------------------ */}
            {/* Error */}
            {/* ------------------------------------------------ */}

            {errorMessage && (

              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">

                <p className="text-sm text-red-600">
                  {errorMessage}
                </p>

              </div>

            )}


            {/* ------------------------------------------------ */}
            {/* Success */}
            {/* ------------------------------------------------ */}

            {successMessage && (

              <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3">

                <p className="text-sm text-green-600">
                  {successMessage}
                </p>

              </div>

            )}


            {/* ------------------------------------------------ */}
            {/* Submit */}
            {/* ------------------------------------------------ */}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-white font-semibold transition shadow-md ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >

              {loading
                ? "Please wait..."
                : mode === "Login"
                ? "Login to CareMitra"
                : "Create CareMitra Account"}

            </button>

          </form>


          {/* ------------------------------------------------ */}
          {/* Footer */}
          {/* ------------------------------------------------ */}

          <div className="mt-6 text-center">

            <p className="text-xs text-gray-400">
              By continuing, you agree to use CareMitra
              responsibly for healthcare assistance.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;