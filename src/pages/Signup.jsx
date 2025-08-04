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
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f3f4f6">
            <Box maxWidth={400} width="100%" p={4} bgcolor="white" boxShadow={3} borderRadius={3}>
                <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
                    {step === 1 && "Register"}
                    {step === 2 && "Verify OTP"}
                    {step === 3 && "User Details"}
                </Typography>
                {step === 1 && (
                    <form onSubmit={handleRegister}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            required
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            fullWidth
                            sx={{ mt: 2 }}
                            disabled={loading}
                            startIcon={loading && <CircularProgress size={20} color="inherit" />}
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </Button>
                    </form>
                )}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <TextField
                            label="OTP"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={form.otp}
                            onChange={(e) => setForm({ ...form, otp: e.target.value })}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            fullWidth
                            sx={{ mt: 2 }}
                            disabled={loading}
                            startIcon={loading && <CircularProgress size={20} color="inherit" />}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </Button>
                    </form>
                )}
                {step === 3 && (
                    <form onSubmit={handleDetails}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        {/* Role selection hidden, always USER */}
                        {/* <Select
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            fullWidth
                            margin="normal"
                        >
                            <MenuItem value="USER">User</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                        </Select> */}
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            fullWidth
                            sx={{ mt: 2 }}
                            disabled={loading}
                            startIcon={loading && <CircularProgress size={20} color="inherit" />}
                        >
                            {loading ? "Saving..." : "Save Details"}
                        </Button>
                    </form>
                )}
                <Typography variant="body2" textAlign="center" mt={3}>
                    Already have an account?{" "}
                    <Button variant="text" color="success" onClick={() => navigate("/login")}>
                        Login
                    </Button>
                </Typography>
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
            </Box>
        </Box>
    );
}