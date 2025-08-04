import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { teamApi } from "../services/api";

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

export default function RegisterTeam() {
    const [searchParams] = useSearchParams();
    const tournamentId = searchParams.get("tournamentId"); // Extract tournamentId from query params

    const [form, setForm] = useState({
        teamName: "",
        tournamentId: tournamentId || "", // Pre-fill tournamentId if available
        players: Array(15)
            .fill(null)
            .map((_, index) => ({ id: `Player ${index + 1}`, name: "", roles: [] })), // Assign unique IDs
    });

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
            updatedPlayers[index].roles.push(role); // Add role if not already present
        }
        setForm({ ...form, players: updatedPlayers });
    };

    const handleRemoveRole = (index, role) => {
        const updatedPlayers = [...form.players];
        updatedPlayers[index].roles = updatedPlayers[index].roles.filter((r) => r !== role); // Remove role
        setForm({ ...form, players: updatedPlayers });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await teamApi.post("/teams/register", form);
            alert("Team registered successfully!");
        } catch (err) {
            alert(err.response?.data || "Failed to register team");
        }
    };

    // Autofill handler
    const handleAutofill = () => {
        // Example random names (can be shuffled for randomness)
        const playerNames = [
            "Rohit Sharma", "KL Rahul", "Virat Kohli", "Shubman Gill", "Suryakumar Yadav",
            "Hardik Pandya", "Ravindra Jadeja", "Jasprit Bumrah", "Mohammed Shami", "Kuldeep Yadav",
            "Rishabh Pant", "Axar Patel", "Shardul Thakur", "Yuzvendra Chahal", "Ishan Kishan"
        ];

        // Batting styles to assign to bowlers
        const battingStyles = ["RIGHT_HANDED_BATSMAN", "LEFT_HANDED_BATSMAN"];

        const autofilledPlayers = form.players.map((player, idx) => {
            let roles = [];
            if (idx === 0) {
                roles = ["CAPTAIN", "RIGHT_HANDED_BATSMAN"];
            } else if (idx === 1) {
                roles = ["WICKET_KEEPER", "LEFT_HANDED_BATSMAN"];
            } else if (idx < 6) {
                // Top order batsmen
                roles = [idx % 2 === 0 ? "RIGHT_HANDED_BATSMAN" : "LEFT_HANDED_BATSMAN"];
            } else if (idx < 10) {
                // Fast bowlers with batting style
                roles = [
                    "FAST_BOWLER",
                    battingStyles[idx % 2]
                ];
            } else if (idx < 13) {
                // Spin bowlers with batting style
                roles = [
                    "SPIN_BOWLER",
                    battingStyles[idx % 2]
                ];
            } else {
                // Medium bowlers with batting style
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

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Register Team</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded">
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
                        disabled={!!tournamentId} // Disable if pre-filled
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
                >
                    Register Team
                </button>
            </form>
        </div>
    );
}