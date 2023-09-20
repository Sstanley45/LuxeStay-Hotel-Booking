import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import Error from "../components/Error";
import Loader from "../components/Loader";
import verifyImage from '../images/verifyEmail.png';


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VerifyPage = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifySuccessMsg, setVerifySuccessMsg] = useState("");
  const query = useQuery();

  const verifyToken = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/auth/verify-email", {
        email: query.get("email"),
        verificationToken: query.get("token"),
      });
      const data = await response.data;
      
      setVerifySuccessMsg(data.msg);
      setError(false);
    } catch (error) {
      console.log(error.response.data.msg);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    verifyToken();
  }, [verifySuccessMsg]);

  if (loading) {
    return <Loader />;
  }

  if (error && !verifySuccessMsg) {
    return (
      <Error
        msg={"Verification error! Check verification link or try to login in"}
      />
    );
  }

  return (
    <>
      <h2>Account Confirmed</h2>
      <div style={{ textAlign: "center" }}>
        <img src={verifyImage} alt="" className="verifyImage" />
      </div>
      <br />
      <div style={{ textAlign: "center" }}>
        <Link to="/login" className="btn">
          <p>Please Login</p>
        </Link>
      </div>
    </>
  );
};

export default VerifyPage;
