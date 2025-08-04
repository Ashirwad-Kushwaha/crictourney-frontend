import { useState } from "react";
import { userApi } from "../services/api";
import { saveToken, getUser } from "../auth";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // Import react-hot-toast

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in both email and password.");
            return;
        }

        try {
            const res = await userApi.post("/auth/login", null, {
                params: { email, password }
            });
            saveToken(res.data);
            const user = getUser();
            toast.success(`Welcome, ${user.sub}! You are logged in.`); // Success toast with username
            if (user?.role === "ADMIN") navigate(`/admin?username=${user.sub}`);
            else navigate(`/user?username=${user.sub}`);
        } catch (err) {
            toast.error("Invalid email or password."); // Error toast
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded">
            {/* Toaster Component */}
            <Toaster position="top-center" reverseOrder={false} />

            <div className="flex justify-center mb-4">
                <img
                    src="/logo.png" // Replace with the actual path to your logo
                    alt="Logo"
                    className="h-16"
                />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <form onSubmit={login}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Login</button>
            </form>
        </div>
    );
}