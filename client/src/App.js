import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import BookingScreen from "./screens/BookingScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import Verify from "./screens/Verify";
import ResetPassword from "./screens/ResetPassword";
import ForgotPassword from "./screens/ForgotPassword";
import Profile from "./screens/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminScreen from "./screens/AdminScreen";
import LandingScreen from "./screens/LandingScreen";

function App() {
  return (
    <div className="App container">
      <Navbar />

      <Routes>
        <Route exact path="/" element={<LandingScreen />}></Route>
        <Route path="/home" element={<HomeScreen />}></Route>
        <Route
          path="/bookingscreen/:id/:fromDate/:toDate"
          element={
            <ProtectedRoute>
              <BookingScreen />
            </ProtectedRoute>
          }
        ></Route>
        <Route path="/register" element={<RegisterScreen />}></Route>
        <Route path="/login" element={<LoginScreen />}></Route>
        <Route path="/user/verify-email" element={<Verify />}></Route>
        <Route path="/user/reset-password" element={<ResetPassword />}></Route>
        <Route
          path="/user/forgot-password"
          element={<ForgotPassword />}
        ></Route>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        ></Route>
        <Route path="/admin" element={<AdminScreen />}></Route>
      </Routes>
    </div>
  );
}

export default App;
