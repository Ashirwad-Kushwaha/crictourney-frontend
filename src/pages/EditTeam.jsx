import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { teamApi } from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { Box, Typography, Button, Paper, CircularProgress } from "@mui/material";

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

export default function EditTeam() {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let teamData = null;
        let playersData = null;
        Promise.all([
            teamApi.get(`/teams/${teamId}`)
                .then(res => { teamData = res.data; })
                .catch(() => {}),
            teamApi.get(`/teams/${teamId}/players`)
                .then(res => { playersData = res.data; })
                .catch(() => {})
        ]).then(() => {
            if (teamData) {
                setForm({
                    teamName: teamData.teamName,
                    tournamentId: teamData.tournamentId,
                    players: playersData ? playersData.map(p => ({ name: p.name, roles: p.roles })) : [],
                });
            } else {
                setForm(null);
            }
            setLoading(false);
        });
    }, [teamId]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await teamApi.put(`/teams/${teamId}`, form);
            toast.success("Team updated successfully!");
            setTimeout(() => navigate(`/my-team/${teamId}`), 1200);
        } catch (err) {
            toast.error(err.response?.data || "Failed to update team");
        }
    };

    if (loading || !form) return <CircularProgress sx={{ m: 4 }} />;

    return (
        <Box sx={{ p: 4 }}>
            <Toaster position="top-center" reverseOrder={false} />
            <Typography variant="h4" fontWeight={700} mb={3} color="primary">
                Edit Team
            </Typography>
            <Paper sx={{ p: 3, maxHeight: 600, overflowY: 'auto', backgroundColor: 'rgba(255,255,255,0.85)' }}>
                <form onSubmit={handleSubmit}>
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
                            disabled
                        />
                    </div>
                    <Typography variant="h6" mb={1}>Players</Typography>
                    {form.players.map((player, index) => (
                        <div key={index} className="mb-6">
                            <input
                                type="text"
                                placeholder="Name"
                                value={player.name}
                                onChange={(e) => handlePlayerChange(index, "name", e.target.value)}
                                className="border p-2 rounded w-full mb-2"
                            />
                            <div className="mb-2">
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
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, borderRadius: 2 }}
                    >
                        Save Changes
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}
