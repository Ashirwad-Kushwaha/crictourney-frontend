import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminTournamentDashboard from "./pages/AdminTournamentDashboard";
import UserTournamentDashboard from "./pages/UserTournamentDashboard";
import TournamentDetails from "./pages/TournamentDetails";
import RegisterTeam from "./pages/RegisterTeam";
import CreateSchedule from "./pages/CreateSchedule";
import ViewSchedule from "./pages/ViewSchedule";
import Navbar from "./components/Navbar";
import { getUser } from "./auth";
import { Box } from "@mui/material";
import bgImage from "./assets/cricket-stadium-vector.jpg";

function ProtectedRoute({ children, role }) {
    const user = getUser();
    // If no user, try to get email from URL and fetch user details
    if (!user) {
        const params = new URLSearchParams(window.location.search);
        const email = params.get("email") || params.get("username");
        if (email) {
            // You may want to fetch user details from backend here and save token/user info
            // For now, redirect to login with email in query
            return <Navigate to={`/login?email=${email}`} replace />;
        }
        return <Navigate to="/login" replace />;
    }
    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }
    return children;
}

function App() {
    const user = getUser();
    // Get email from URL if present
    const params = new URLSearchParams(window.location.search);
    const email = params.get("username") || params.get("email");

    return (
        <Box sx={{
            minHeight: "100vh",
            width: "100vw",
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route
                        path="/"
                        element={
                            user ? (
                                user.role === "ADMIN" ? (
                                    <Navigate to={`/admin${email ? `?email=${email}` : ""}`} replace />
                                ) : user.role === "USER" ? (
                                    <Navigate to={`/user${email ? `?email=${email}` : ""}`} replace />
                                ) : (
                                    <Navigate to={`/login${email ? `?email=${email}` : ""}`} replace />
                                )
                            ) : (
                                <Navigate to={`/login${email ? `?email=${email}` : ""}`} replace />
                            )
                        }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminTournamentDashboard /></ProtectedRoute>} />
                    <Route path="/user" element={<ProtectedRoute role="USER"><UserTournamentDashboard /></ProtectedRoute>} />
                    <Route path="/register-team" element={<ProtectedRoute role="USER"><RegisterTeam /></ProtectedRoute>} />
                    <Route path="/create-schedule" element={<ProtectedRoute role="ADMIN"><CreateSchedule /></ProtectedRoute>} />
                    <Route path="/view-schedule" element={<ProtectedRoute role="USER"><ViewSchedule /></ProtectedRoute>} />
                    <Route path="/tournament-details" element={<TournamentDetails />} />
                </Routes>
            </BrowserRouter>
        </Box>
    );
}

export default App;
