import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import useLocalState from "../utils/localState";
import Loader from "../components/Loader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState();
  const { showLocalAlert, alert, hideLocalAlert, success, setSuccess } =
    useLocalState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    hideLocalAlert();
    if (!email) {
      showLocalAlert({ text: "please provide email" });
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post("/api/v1/auth/forgot-password", {
        email,
      });
      showLocalAlert({ text: data.msg, type: "success" });
      setSuccess(true);
    } catch (error) {
      showLocalAlert({
        text: "Something went wrong, please try again",
      });
      setSuccess(true);
    }
    setLoading(false);
  };

  if (loading) {
    <Loader />;
  }

  return (
    <>
      <div className="row justify-content-center mt-5">
        {alert.show && (
          <div className={`alert alert-${alert.type}`}>{alert.text} </div>
        )}

        {!success && (
          <div className="col-md-5">
            <div className="bs">
              <h2>Forgot Password?</h2>
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div style={{ textAlign: "center" }}>
                <button
                  className="btn btn-primary mt-3"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Send
                </button>
                <br />
                <p>
                  back to <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ForgotPassword;
