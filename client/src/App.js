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

function App() {
  return (
    <div className="App container">
      <Navbar />

      <Routes>
        <Route exact path="/home" element={<HomeScreen />}></Route>
        <Route
          exact
          path="/bookingscreen/:id/:fromDate/:toDate"
          element={
            <ProtectedRoute>
              <BookingScreen />
            </ProtectedRoute>
          }
        ></Route>
        <Route exact path="/register" element={<RegisterScreen />}></Route>
        <Route exact path="/login" element={<LoginScreen />}></Route>
        <Route exact path="/user/verify-email" element={<Verify />}></Route>
        <Route
          exact
          path="/user/reset-password"
          element={<ResetPassword />}
        ></Route>
        <Route
          exact
          path="/user/forgot-password"
          element={<ForgotPassword />}
        ></Route>

        <Route
          exact
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        ></Route>
        <Route exact path='/admin' element={<AdminScreen />}></Route>
      </Routes>
    </div>
  );
}

export default App;
