import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import "../assets/login.css"; // Reuse login styles

export default function VerificationPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [otp, setOtp] = useState({ email: "", phone: "" });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    if (!user) return null;

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${API_URL}/verify`, {
                userId: user._id,
                otp: otp.email
            });
            toast.success("Email Verified!");
            // Update local storage
            const updatedUser = { ...user, isEmailVerified: true };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP");
        }
    };

    const handleContinue = () => {
        if (!user.isEmailVerified) {
            toast.warning("Please verify email to continue.");
            return;
        }
        navigate("/");
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Security Verification</h2>
                <p>Please verify your contact details.</p>

                {/* Email Verification */}
                <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', background: user.isEmailVerified ? '#f0fdf4' : 'white' }}>
                    <label>Email OTP ({user.email})</label>
                    {user.isEmailVerified ? (
                        <p style={{ color: 'green', fontWeight: 'bold' }}>✓ Verified</p>
                    ) : (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                            <input
                                type="text"
                                maxLength="4"
                                placeholder="4-digit Code"
                                value={otp.email}
                                onChange={e => setOtp({ ...otp, email: e.target.value })}
                                style={{ flex: 1 }}
                            />
                            <button onClick={handleVerifyEmail} className="login-button" style={{ width: 'auto', padding: '0 15px' }}>Verify</button>
                        </div>
                    )}
                </div>
                <button onClick={handleContinue} className="login-button" style={{ marginTop: '10px', background: user.isEmailVerified ? '#0f172a' : '#94a3b8' }}>
                    Continue to Dashboard
                </button>
            </div>
        </div>
    );
}
