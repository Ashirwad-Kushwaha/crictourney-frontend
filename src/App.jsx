import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminTournamentDashboard from "./pages/AdminTournamentDashboard";
import UserTournamentDashboard from "./pages/UserTournamentDashboard";
import TournamentDetails from "./pages/TournamentDetails";
import RegisterTeam from "./pages/RegisterTeam";
import CreateSchedule from "./pages/CreateSchedule";
import ViewSchedule from "./pages/ViewSchedule";
import Navbar from "./components/Navbar";
import RAGWidget from "./components/RAGWidget";
import HelpCenter from "./pages/HelpCenter";
import { getUser } from "./auth";
import { Box } from "@mui/material";
import bgImage from "./assets/cricket-stadium-vector.jpg";
import PaymentHistory from "./pages/PaymentHistory";
import MyTeams from "./pages/MyTeams";
import ViewTeam from "./pages/ViewTeam";
import EditTeam from "./pages/EditTeam";

function ProtectedRoute({ children, role }) {
    const user = getUser();
    // If no user, try to get email from URL and fetch user details
    if (!user) {
        const params = new URLSearchParams(window.location.search);
        const email = params.get("email") || params.get("username");
        if (email) {
            return <Navigate to={`/login/user?email=${email}`} replace />;
        }
        return <Navigate to="/login" replace />;
    }
    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }
    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    role: PropTypes.string
};

function RootRedirect({ user, email }) {
    if (user) {
        if (user.role === "ADMIN") {
            const adminPath = "/admin" + (email ? "?email=" + email : "");
            return <Navigate to={adminPath} replace />;
        } else if (user.role === "USER") {
            const userPath = "/user" + (email ? "?email=" + email : "");
            return <Navigate to={userPath} replace />;
        } else {
            return <Navigate to="/login" replace />;
        }
    } else {
        return <Navigate to="/login" replace />;
    }
}

RootRedirect.propTypes = {
    user: PropTypes.object,
    email: PropTypes.string
};

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
                        element={<RootRedirect user={user} email={email} />}
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminTournamentDashboard /></ProtectedRoute>} />
                    <Route path="/user" element={<ProtectedRoute role="USER"><UserTournamentDashboard /></ProtectedRoute>} />
                    <Route path="/register-team" element={<ProtectedRoute><RegisterTeam /></ProtectedRoute>} />
                    <Route path="/create-schedule" element={<ProtectedRoute role="ADMIN"><CreateSchedule /></ProtectedRoute>} />
                    <Route path="/view-schedule" element={<ProtectedRoute><ViewSchedule /></ProtectedRoute>} />
                    <Route path="/tournament-details" element={<ProtectedRoute><TournamentDetails /></ProtectedRoute>} />
                    <Route path="/tournament-details/:tournamentId" element={<ProtectedRoute><TournamentDetails /></ProtectedRoute>} />
                    <Route path="/payment-history" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
                    <Route path="/my-teams" element={<ProtectedRoute><MyTeams /></ProtectedRoute>} />
                    <Route path="/my-team/:teamId" element={<ProtectedRoute><ViewTeam /></ProtectedRoute>} />
                    <Route path="/edit-team/:teamId" element={<ProtectedRoute><EditTeam /></ProtectedRoute>} />
                    <Route path="/help" element={<HelpCenter />} />
                </Routes>
                <RAGWidget />
            </BrowserRouter>
        </Box>
    );
}

export default App;
