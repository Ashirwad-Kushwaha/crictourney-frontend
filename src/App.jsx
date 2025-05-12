import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminTournamentDashboard from "./pages/AdminTournamentDashboard";
import UserTournamentDashboard from "./pages/UserTournamentDashboard";
import RegisterTeam from "./pages/RegisterTeam";
import CreateSchedule from "./pages/CreateSchedule";
import ViewSchedule from "./pages/ViewSchedule";
import Navbar from "./components/Navbar";
import { getUser } from "./auth";

function ProtectedRoute({ children, role }) {
    const user = getUser();
    console.log("User in ProtectedRoute:", user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === "ADMIN") {
        return children;
    }

    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function App() {
    const user = getUser();
    console.log("User in App:", user);

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route
                    path="/"
                    element={
                        user ? (
                            user.role === "ADMIN" ? (
                                <Navigate to="/admin" replace />
                            ) : user.role === "USER" ? (
                                <Navigate to="/user" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        ) : (
                            <Navigate to="/login" replace />
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
            </Routes>
        </BrowserRouter>
    );
}

export default App;
