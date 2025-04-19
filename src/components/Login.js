import React, { useState } from "react";
import axios from "axios";
import { toast} from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../assets/login.css";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/login", credentials);
      toast.success("Login Successful!");
      const {id, isAdmin} = response.data.user;
      if(isAdmin) {
        navigate("/AdminPage")
      }
      else{
        navigate(`/Order/${id}`)
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleGoBack = () => {
    navigate("/company-website-reactjs");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            value={credentials.email} 
            onChange={handleChange} 
            placeholder="Enter your email" 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            value={credentials.password} 
            onChange={handleChange} 
            placeholder="Enter your password" 
            required 
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <button className="go-back-button" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
}
