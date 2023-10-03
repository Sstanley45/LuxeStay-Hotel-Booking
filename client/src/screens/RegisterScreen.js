import React, { useEffect, useState } from "react";
import axios from "axios";
import useLocalState from "../utils/localState";
import Loader from "../components/Loader";

const RegisterScreen = () => {
  const {
    alert,
    showLocalAlert,
    loading,
    setLoading,
    success,
    setSuccess,
    hideLocalAlert,
  } = useLocalState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlert, setShowAlert] = useState();
  const [passwordMismatch, setPasswordMismatch] = useState();
  const [userExists, setUserExists] = useState();

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      setShowAlert(true);
      hideAlert();
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      hidePasswordAlert();
      setLoading(false);
      return;
    } else {
      const user = {
        name,
        email,
        password,
        confirmPassword,
      };

      try {
        const response = await axios.post("/api/v1/auth/register", user);
        setSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        const { msg } = response.data;
        showLocalAlert({ text: msg, type: "success" });
      } catch (error) {
        const { msg } = error.response.data;
        if (msg) {
          setUserExists(true);
          hideUserExistsAlert();
          setLoading(false);
          return;
        } else {
          setSuccess(true);
          showLocalAlert({ text: "there was an error, try again later" });
          setLoading(false);
        }
      }
    }
    setLoading(false);
  };

  const hideAlert = () => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const hidePasswordAlert = () => {
    setTimeout(() => {
      setPasswordMismatch(false);
    }, 3000);
  };
  const hideUserExistsAlert = () => {
    setTimeout(() => {
      setUserExists(false);
    }, 3000);
  };

  return (
    <div>
      <div className="row justify-content-center mt-5">
        {alert.show && (
          <div className={`alert-local alert-local-${alert.type}`}>
            {alert.text}
          </div>
        )}

        {!success && (
          <div className="col-md-5">
            <div className="bs">
              <h2>Register</h2>
              {showAlert && (
                <p className="alert-danger">Please fill all values</p>
              )}
              {passwordMismatch && (
                <p className="alert-danger">Passwords do not match!</p>
              )}
              {userExists && (
                <p className="alert-danger">User Already Exists!</p>
              )}
              <input
                type="text"
                className="form-control"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                className="form-control"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="form-control"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                className="form-control"
                placeholder="confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                className="btn btn-primary mt-3"
                type="submit"
                onClick={register}
                disabled ={loading}
              >
                {loading ? "loading.." : "submit"}
              </button>
              <p>
                Already have an account? <a href="/login">login</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterScreen;
