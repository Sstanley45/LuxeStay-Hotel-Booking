import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import BookingScreen from "./screens/BookingScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import Verify from "./screens/Verify";

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route exact path="/home" element={<HomeScreen />}></Route>
          <Route
            exact
            path="/bookingscreen/:id"
            element={<BookingScreen />}
          ></Route>
          <Route exact path="/register" element={<RegisterScreen />}></Route>
          <Route exact path="/login" element={<LoginScreen />}></Route>
          <Route exact path="/user/verify-email" element={<Verify />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
