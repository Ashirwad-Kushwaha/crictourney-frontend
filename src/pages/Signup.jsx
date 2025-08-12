import { useState } from "react";
import { userApi } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    TextField,
    Typography,
    Select,
    MenuItem,
    Snackbar,
    Paper,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
} from "@mui/material";

export default function Signup() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        username: "",
        email: "",
        otp: "",
        name: "",
        password: "",
        role: "USER"
    });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
    const [dialog, setDialog] = useState({ open: false, title: "", content: "" });
    const navigate = useNavigate();

    const showSnackbar = (message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    };

    const showDialog = (title, content) => {
        setDialog({ open: true, title, content });
    };

    // Step 1: Send username/email for registration
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await userApi.post("/auth/user-register", {
                username: form.username,
                email: form.email
            });
            // Check backend message for already registered/taken
            if (
                res.data?.message === "Email already registered." ||
                res.data?.message === "Username already taken."
            ) {
                showSnackbar(res.data.message, "error");
                // Stay on registration page
            } else {
                showDialog("OTP Sent", "An OTP has been sent to your email.");
                setStep(2);
            }
        } catch {
            showSnackbar("Registration failed. Try again.", "error");
        }
        setLoading(false);
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await userApi.post("/auth/user-verify", null, {
                params: { email: form.email, otp: form.otp }
            });
            showDialog("OTP Verified", "OTP verified. Please enter your details.");
            setStep(3);
        } catch {
            showSnackbar("OTP verification failed.", "error");
        }
        setLoading(false);
    };

    // Step 3: Submit user details
    const handleDetails = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await userApi.post("/auth/user-details", null, {
                params: {
                    email: form.email,
                    name: form.name,
                    password: form.password,
                    role: form.role
                }
            });
            showDialog("Success", "Details saved. You can now login.");
            setTimeout(() => navigate("/login"), 1500);
        } catch {
            showSnackbar("Failed to save details.", "error");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded">
            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            {/* Dialog for important info */}
            <Dialog
                open={dialog.open}
                onClose={() => setDialog({ ...dialog, open: false })}
            >
                <DialogTitle>{dialog.title}</DialogTitle>
                <DialogContent>
                    <Typography>{dialog.content}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialog({ ...dialog, open: false })} color="success">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            <h2 className="text-2xl font-bold mb-4 text-center">
                {step === 1 && "Register"}
                {step === 2 && "Verify OTP"}
                {step === 3 && "User Details"}
            </h2>
            {step === 1 && (
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="w-full p-2 mb-2 border rounded"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full p-2 mb-2 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-2"
                        disabled={loading}
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>
            )}
            {step === 2 && (
                <form onSubmit={handleVerifyOtp}>
                    <input
                        type="text"
                        placeholder="OTP"
                        value={form.otp}
                        onChange={(e) => setForm({ ...form, otp: e.target.value })}
                        className="w-full p-2 mb-2 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-2"
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
            )}
            {step === 3 && (
                <form onSubmit={handleDetails}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full p-2 mb-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full p-2 mb-2 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-2"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Details"}
                    </button>
                </form>
            )}
            <p className="text-center mt-3 text-sm">
                Already have an account?{' '}
                <button className="text-blue-600 underline" type="button" onClick={() => navigate('/login')}>
                    Login
                </button>
            </p>
        </div>
    );
}