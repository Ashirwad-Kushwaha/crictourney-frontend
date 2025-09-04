import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { teamApi } from "../services/api";
import toast from "react-hot-toast";

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

const RAZORPAY_KEY_ID = "rzp_test_FL9mEvGqeo5SBL";

export default function RegisterTeam() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tournamentId = searchParams.get("tournamentId");
    const feeFromQuery = searchParams.get("fee");

    const [form, setForm] = useState({
        teamName: "",
        tournamentId: tournamentId || "",
        players: Array(15).fill(null).map((_, index) => ({ 
            id: `Player ${index + 1}`, 
            name: "", 
            roles: [] 
        })),
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
            const timeout = setTimeout(() => navigate("/"), 1500);
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

    const handlePaymentAndRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!form.teamName || !form.tournamentId) {
                toast.error("Please enter team name and tournament ID.");
                setLoading(false);
                return;
            }
            
            const orderRes = await teamApi.post("/teams/create-payment-order", null, {
                params: { tournamentId: form.tournamentId, teamName: form.teamName, fee: registrationFee }
            });
            const order = typeof orderRes.data === "string" ? JSON.parse(orderRes.data) : orderRes.data;

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
                prefill: { name: form.teamName },
                theme: { color: "#2563eb" }
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

    const handleAutofill = () => {
        const playerNames = [
            "Rohit Sharma", "KL Rahul", "Virat Kohli", "Shubman Gill", "Suryakumar Yadav",
            "Hardik Pandya", "Ravindra Jadeja", "Jasprit Bumrah", "Mohammed Shami", "Kuldeep Yadav",
            "Rishabh Pant", "Axar Patel", "Shardul Thakur", "Yuzvendra Chahal", "Ishan Kishan"
        ];
        const autofilledPlayers = form.players.map((player, idx) => {
            let roles = [];
            if (idx === 0) roles = ["CAPTAIN", "RIGHT_HANDED_BATSMAN"];
            else if (idx === 1) roles = ["WICKET_KEEPER", "LEFT_HANDED_BATSMAN"];
            else if (idx < 6) roles = [idx % 2 === 0 ? "RIGHT_HANDED_BATSMAN" : "LEFT_HANDED_BATSMAN"];
            else if (idx < 10) roles = ["FAST_BOWLER", idx % 2 === 0 ? "RIGHT_HANDED_BATSMAN" : "LEFT_HANDED_BATSMAN"];
            else if (idx < 13) roles = ["SPIN_BOWLER", idx % 2 === 0 ? "RIGHT_HANDED_BATSMAN" : "LEFT_HANDED_BATSMAN"];
            else roles = ["MEDIUM_BOWLER", idx % 2 === 0 ? "RIGHT_HANDED_BATSMAN" : "LEFT_HANDED_BATSMAN"];
            
            return {
                ...player,
                name: playerNames[idx] || `Player${idx + 1}`,
                roles,
            };
        });
        setForm({ ...form, players: autofilledPlayers });
    };

    useEffect(() => {
        if (!window.Razorpay) {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6">
            
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7H16c-.8 0-1.54.37-2.01.99L12 10l-1.99-2.01A2.99 2.99 0 0 0 8 7H6.94c-1.4 0-2.59.93-2.9 2.37L1.5 16H4v6h2v-6h2.5l1.5-4.5L12 14l2-2.5L15.5 16H18v6h2z"/>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-blue-800 mb-2">Register Team</h1>
                    <p className="text-gray-600">Create your cricket team for tournament participation</p>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-blue-100">
                    <form onSubmit={handlePaymentAndRegister} className="space-y-6">
                        {/* Team Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                                <input
                                    type="text"
                                    name="teamName"
                                    value={form.teamName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tournament ID</label>
                                <input
                                    type="number"
                                    name="tournamentId"
                                    value={form.tournamentId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    disabled={!!tournamentId}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Fee</label>
                                <input
                                    type="text"
                                    value={registrationFee !== null ? `₹${registrationFee}` : "Loading..."}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-blue-800">Players (15 Required)</h2>
                            <button
                                type="button"
                                onClick={handleAutofill}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition-all"
                            >
                                Autofill Sample Data
                            </button>
                        </div>

                        {/* Players Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {form.players.map((player, index) => (
                                <div key={player.id} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                    <h3 className="font-semibold text-blue-800 mb-3">{player.id}</h3>
                                    <label htmlFor={`player-name-${index}`} className="block text-sm font-medium text-gray-700 mb-2">Player Name</label>
                                    <input
                                        id={`player-name-${index}`}
                                        type="text"
                                        placeholder="Player Name"
                                        value={player.name}
                                        onChange={(e) => handlePlayerChange(index, "name", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                                    />

                                    <div className="mb-3">
                                        <label htmlFor={`roles-${index}`} className="block text-sm font-medium text-gray-700 mb-2">Available Roles</label>
                                        <div id={`roles-${index}`} className="flex flex-wrap gap-1">
                                            {availableRoles.map((role) => (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() => handleAddRole(index, role)}
                                                    className={`px-2 py-1 text-xs rounded transition-all ${
                                                        player.roles.includes(role)
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                    }`}
                                                >
                                                    {role.replace(/_/g, ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {player.roles.length > 0 && (
                                        <div>
                                            <label htmlFor={`selected-roles-${index}`} className="block text-sm font-medium text-gray-700 mb-2">Selected Roles</label>
                                            <div id={`selected-roles-${index}`} className="flex flex-wrap gap-1" role="group" aria-labelledby={`selected-roles-label-${index}`}>
                                                {player.roles.map((role) => (
                                                    <button
                                                        key={role}
                                                        type="button"
                                                        className="bg-blue-600 text-white px-2 py-1 text-xs rounded cursor-pointer hover:bg-blue-700 transition-colors"
                                                        onClick={() => handleRemoveRole(index, role)}
                                                        aria-label={`Remove role ${role.replace(/_/g, ' ')}`}
                                                    >
                                                        {role.replace(/_/g, ' ')} ✕
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="text-center pt-6">
                            <button
                                type="submit"
                                disabled={loading || paymentDone}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {loading ? "Processing..." : "Pay & Register Team"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}