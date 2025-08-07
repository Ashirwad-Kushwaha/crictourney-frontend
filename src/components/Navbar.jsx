import { Link, useNavigate } from "react-router-dom";
import { getUser, removeToken } from "../auth";

export default function Navbar() {
    const user = getUser();
    const navigate = useNavigate();

    const logout = () => {
        removeToken();
        navigate("/login");
    };

    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
            {/* Clickable Logo */}
            <Link to="/">
                <img
                    src="/logo-wh.png" // Replace with the actual path to your logo
                    alt="Crictourney Logo"
                    className="h-8" // Adjust the height as needed
                />
            </Link>
            <div className="flex items-center">
                {!user ? (
                    <>
                        <Link to="/login" className="mx-2">Login</Link>
                        <Link to="/signup" className="mx-2">Signup</Link>
                    </>
                ) : (
                    <>
                        <span className="mr-2">Hello, {user.sub}</span>
                        <button onClick={logout} className="bg-white text-blue-600 px-2 py-1 rounded">Logout</button>
                        <button
                            onClick={() => navigate("/payment-history")}
                            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Payment History
                        </button>
                        <button
                            onClick={() => navigate("/my-teams")}
                            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            My Teams
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
