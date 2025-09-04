import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Toaster } from "react-hot-toast";
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
import PaymentHistory from "./pages/PaymentHistory";
import MyTeams from "./pages/MyTeams";
import ViewTeam from "./pages/ViewTeam";
import EditTeam from "./pages/EditTeam";

function ProtectedRoute({ children, role }) {
    const user = getUser();
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
    const params = new URLSearchParams(window.location.search);
    const email = params.get("username") || params.get("email");

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
            <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full bg-repeat" style={{backgroundImage: "url('data:image/svg+xml;utf8,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\"><g fill=\"%230ea5e9\" fill-opacity=\"0.03\"><circle cx=\"30\" cy=\"30\" r=\"4\"/></g></g></svg>')"}}></div>
            </div>
            <BrowserRouter>
                <Navbar />
                <div className="relative z-10">
                    <Routes>
                        <Route path="/" element={<RootRedirect user={user} email={email} />} />
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
                </div>
                <RAGWidget />
                <Toaster position="top-right" />
            </BrowserRouter>
        </div>
    );
}

export default App;