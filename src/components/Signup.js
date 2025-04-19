import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../assets/login.css"; // Reusing Login.css for both Login and SignUp forms
import {useNavigate} from "react-router-dom"

export default function SignUp() {
  const [formData, setFormData] = useState({ userName: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  function handleGoBack(){
    navigate("/company-website-reactjs");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/signup", formData);
      console.log(response);
      toast.success("Signup Success!")
      const orderId = response.data.user._id;

      navigate(`/Order/${orderId}`)
    } catch (error) {
      console.log(error)
      toast.error("Signup Failed. Please try again.")
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div className="form-group">
          <label htmlFor="userName">Username:</label>
          <input 
            type="text" 
            name="userName" 
            id="userName" 
            placeholder="Enter your username" 
            value={formData.userName} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            placeholder="Enter your email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            placeholder="Enter your password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" className="login-button">Sign Up</button>
      </form>

      <button onClick={handleGoBack} className="go-back-button">Go Back</button>
    </div>
  );
}
