import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import useLocalState from "../utils/localState";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const navigate = useNavigate();

  const {
    alert,
    showLocalAlert,
    loading,
    setLoading,
    success,
    setSuccess,
    hideLocalAlert,
  } = useLocalState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setEmail("");
      setPassword("");
      showLocalAlert({ text: "please fill all values", type: "danger" });
      hideLocalAlert();
      return;
    }
    const user = {
      email,
      password,
    };

    try {
      const response = await axios.post("/api/v1/auth/login", user);
      const data = await response;
      console.log(data);
      showLocalAlert({ text: "logging in..", type: "success" });
      hideLocalAlert();
      setTimeout(() => {
        navigate("/home");
      }, 2000);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("error when logging user", error);
      console.log(error.response.data.msg);
      showLocalAlert({ text: error.response.data.msg, type: "danger" });
      hideLocalAlert();
    }
  };

  return (
    <div>
      <div className="row justify-content-center mt-5">
        <div className="col-md-5">
          <div className="bs">
            <h2>Login</h2>
            {alert.show && (
              <div className={`alert-local alert-local-${alert.type}`}>
                {alert.text}
              </div>
            )}

            <input
              type="text"
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

            <button
              className="btn btn-primary mt-3"
              type="submit"
              onClick={login}
            >
              Login
            </button>
            <p>
              Not yet Registered ? <a href="/register">register</a>
            </p>
            <p>
              Forgot Password ?
              <Link to="/user/forgot-password">Reset Password</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
