import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import useLocalState from "../utils/localState";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const { showLocalAlert, alert, hideLocalAlert, success, setSuccess } =
    useLocalState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const query = useQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!password) {
      showLocalAlert({ text: "please enter password" });
      setLoading(true);
      return;
    }
    try {
      const { data } = await axios.post("/api/v1/auth/reset-password", {
        password,
        token: query.get("token"),
        email: query.get("email"),
      });
      setLoading(false);
      setSuccess(true);
      showLocalAlert({
        text: "Success, redirecting to login page shortly",
        type: "success",
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      showLocalAlert({ text: error.response.data.msg });
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="row justify-content-center mt-5">
        {alert.show && (
          <div className={`alert alert-${alert.type}`}>{alert.text} </div>
        )}

        {!success && (
          <div className="col-md-5">
            <h2>Reset Password</h2> 
            <div className="bs">
              <input
                type="password"
                className="form-control"
                placeholder=" new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div style={{ textAlign: "center" }}>
                <button
                  className="btn btn-primary mt-3"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResetPassword;
