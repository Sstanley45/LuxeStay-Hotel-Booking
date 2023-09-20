import React, { useState } from "react";
import axios from 'axios';


const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {

    e.preventDefault()
    if (!email || !password) {
     return alert('fill all values')
    }
    const user = {
      email,
      password,
    };

      try {
        const response = await axios.post("/api/v1/auth/login", user); 
        const data = await response; 
        console.log(data);
      } catch (error) {
        console.log("error when logging user", error); 
        console.log(error.response);
      }
  };

  return (
    <div>
      <div className="row justify-content-center mt-5">
        <div className="col-md-5">
          <div className="bs">
            <h2>Login</h2>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;  
