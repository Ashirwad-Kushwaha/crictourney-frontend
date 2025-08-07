import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { teamApi } from "../services/api";
import toast, { Toaster } from "react-hot-toast";

const availableRoles = [
    "CAPTAIN",
    "WICKET_KEEPER",
    "LEFT_HANDED_BATSMAN",
    "RIGHT_HANDED_BATSMAN",
    "FAST_BOWLER",
    "MEDIUM_BOWLER",
    "SPIN_BOWLER",
    "OFF_SPIN_BOWLER",
    "LEG_SPIN_BOWLER",
];

const RAZORPAY_KEY_ID = "rzp_test_FL9mEvGqeo5SBL"; // Replace with your actual Razorpay key

export default function RegisterTeam() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tournamentId = searchParams.get("tournamentId");
    const feeFromQuery = searchParams.get("fee");

    const [form, setForm] = useState({
        teamName: "",
        tournamentId: tournamentId || "",
        players: Array(15)
            .fill(null)
            .map((_, index) => ({ id: `Player ${index + 1}`, name: "", roles: [] })),
    });
    const [registrationFee, setRegistrationFee] = useState(feeFromQuery ? Number(feeFromQuery) : null);
    const [loading, setLoading] = useState(false);
    const [paymentDone, setPaymentDone] = useState(false);

    useEffect(() => {
        if (!feeFromQuery && tournamentId) {
            teamApi.get(`/teams/registration-fee/${tournamentId}`)
                .then(res => setRegistrationFee(res.data))
                .catch(() => setRegistrationFee(null));
        }
    }, [tournamentId, feeFromQuery]);

    useEffect(() => {
        if (paymentDone) {
            toast.success("Team registered successfully! Redirecting to home page...");
            const timeout = setTimeout(() => {
                navigate("/");
            }, 1500);
            return () => clearTimeout(timeout);
        }
    }, [paymentDone, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handlePlayerChange = (index, field, value) => {
        const updatedPlayers = [...form.players];
        updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
        setForm({ ...form, players: updatedPlayers });
    };

    const handleAddRole = (index, role) => {
        const updatedPlayers = [...form.players];
        if (!updatedPlayers[index].roles.includes(role)) {
            updatedPlayers[index].roles.push(role);
        }
        setForm({ ...form, players: updatedPlayers });
    };

    const handleRemoveRole = (index, role) => {
        const updatedPlayers = [...form.players];
        updatedPlayers[index].roles = updatedPlayers[index].roles.filter((r) => r !== role);
        setForm({ ...form, players: updatedPlayers });
    };

    // Razorpay handler
    const handlePaymentAndRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!form.teamName || !form.tournamentId) {
                toast.error("Please enter team name and tournament ID.");
                setLoading(false);
                return;
            }
            // 1. Create payment order (send fee)
            const orderRes = await teamApi.post("/teams/create-payment-order", null, {
                params: { tournamentId: form.tournamentId, teamName: form.teamName, fee: registrationFee }
            });
            const order = typeof orderRes.data === "string" ? JSON.parse(orderRes.data) : orderRes.data;

            // 2. Open Razorpay
            const options = {
                key: RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: form.teamName,
                description: "Tournament Registration Fee",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        await teamApi.post("/teams/register", { ...form, fee: registrationFee }, {
                            params: {
                                paymentOrderId: order.id,
                                paymentId: response.razorpay_payment_id
                            }
                        });
                        setPaymentDone(true);
                    } catch (err) {
                        toast.error(err.response?.data || "Failed to register team");
                    }
                },
                prefill: {
                    name: form.teamName,
                },
                theme: { color: "#3399cc" }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            if (err.response && err.response.status === 403) {
                toast.error("You are not authorized. Please login again.");
            } else {
                toast.error("Failed to initiate payment");
            }
        }
        setLoading(false);
    };

    // Autofill handler
    const handleAutofill = () => {
        const playerNames = [
            "Rohit Sharma", "KL Rahul", "Virat Kohli", "Shubman Gill", "Suryakumar Yadav",
            "Hardik Pandya", "Ravindra Jadeja", "Jasprit Bumrah", "Mohammed Shami", "Kuldeep Yadav",
            "Rishabh Pant", "Axar Patel", "Shardul Thakur", "Yuzvendra Chahal", "Ishan Kishan"
        ];
        const battingStyles = ["RIGHT_HANDED_BATSMAN", "LEFT_HANDED_BATSMAN"];
        const autofilledPlayers = form.players.map((player, idx) => {
            let roles = [];
            if (idx === 0) {
                roles = ["CAPTAIN", "RIGHT_HANDED_BATSMAN"];
            } else if (idx === 1) {
                roles = ["WICKET_KEEPER", "LEFT_HANDED_BATSMAN"];
            } else if (idx < 6) {
                roles = [idx % 2 === 0 ? "RIGHT_HANDED_BATSMAN" : "LEFT_HANDED_BATSMAN"];
            } else if (idx < 10) {
                roles = [
                    "FAST_BOWLER",
                    battingStyles[idx % 2]
                ];
            } else if (idx < 13) {
                roles = [
                    "SPIN_BOWLER",
                    battingStyles[idx % 2]
                ];
            } else {
                roles = [
                    "MEDIUM_BOWLER",
                    battingStyles[idx % 2]
                ];
            }
            return {
                ...player,
                name: playerNames[idx] || `Player${idx + 1}`,
                roles,
            };
        });
        setForm({ ...form, players: autofilledPlayers });
    };

    useEffect(() => {
        // Load Razorpay script
        if (!window.Razorpay) {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Toaster position="top-center" reverseOrder={false} />
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Register Team</h2>
            <form onSubmit={handlePaymentAndRegister} className="bg-white p-6 shadow rounded">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Team Name</label>
                    <input
                        type="text"
                        name="teamName"
                        value={form.teamName}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Tournament ID</label>
                    <input
                        type="number"
                        name="tournamentId"
                        value={form.tournamentId}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                        required
                        disabled={!!tournamentId}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Registration Fee</label>
                    <input
                        type="text"
                        value={registrationFee !== null ? `₹${registrationFee}` : "Loading..."}
                        disabled
                        className="border p-2 rounded w-full"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleAutofill}
                    className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Autofill
                </button>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Players</h3>
                {form.players.map((player, index) => (
                    <div key={player.id} className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">{player.id}</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={player.name}
                            onChange={(e) => handlePlayerChange(index, "name", e.target.value)}
                            className="border p-2 rounded w-full mb-2"
                        />
                        <div className="mb-2">
                            <label className="block text-gray-700 font-bold mb-2">Roles</label>
                            <div className="flex flex-wrap gap-2">
                                {availableRoles.map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => handleAddRole(index, role)}
                                        className={`px-3 py-1 rounded ${
                                            player.roles.includes(role)
                                                ? "bg-green-600 text-white"
                                                : "bg-gray-200 text-gray-800"
                                        }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="text-gray-700 font-bold">Selected Roles:</p>
                            <ul className="flex flex-wrap gap-2">
                                {player.roles.map((role) => (
                                    <li
                                        key={role}
                                        className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
                                        onClick={() => handleRemoveRole(index, role)}
                                    >
                                        {role} ✕
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={loading || paymentDone}
                >
                    {loading ? "Processing..." : "Pay & Register"}
                </button>
            </form>
        </div>
    );
}