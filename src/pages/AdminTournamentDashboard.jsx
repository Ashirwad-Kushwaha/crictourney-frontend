import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tournamentApi, schedulerApi } from "../services/api"; // Import schedulerApi
import toast, { Toaster } from "react-hot-toast";

export default function AdminTournamentDashboard() {
    const [tournaments, setTournaments] = useState([]);
    const [form, setForm] = useState({ name: "", teamLimit: 0, entryFee: 0 });
    const [selectedTournament, setSelectedTournament] = useState(null);
    const navigate = useNavigate();

    const fetchTournaments = async () => {
        try {
            const res = await tournamentApi.get("/tournament/all");
            setTournaments(res.data);
        } catch (err) {
            toast.error("Failed to fetch tournaments");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await tournamentApi.post("/tournament/create", form);
            toast.success("Tournament created successfully!");
            fetchTournaments();
        } catch (err) {
            toast.error("Failed to create tournament");
        }
    };

    const handleDelete = async (id) => {
        try {
            await tournamentApi.delete(`/tournament/delete/${id}`);
            toast.success("Tournament deleted successfully!");
            fetchTournaments();
        } catch (err) {
            toast.error("Failed to delete tournament");
        }
    };

    const handleTournamentClick = (tournament) => {
        setSelectedTournament(tournament);
    };

    const handleBackClick = () => {
        setSelectedTournament(null);
    };

    const handleRegisterTeam = (tournamentId) => {
        navigate(`/register-team?tournamentId=${tournamentId}`);
    };

    const handleCreateSchedule = async (tournamentId) => {
        try {
            await schedulerApi.post(`/schedule/${tournamentId}`); // Use schedulerApi here
            toast.success("Schedule created successfully!");
            navigate(`/view-schedule?tournamentId=${tournamentId}`); // Navigate to ViewSchedule page
        } catch (err) {
            toast.error("Failed to create schedule");
        }
    };

    const handleViewSchedule = (tournamentId) => {
        navigate(`/view-schedule?tournamentId=${tournamentId}`); // Navigate to ViewSchedule page
    };

    useEffect(() => {
        fetchTournaments();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Toaster position="top-center" reverseOrder={false} />
            {!selectedTournament ? (
                <>
                    <form onSubmit={handleCreate} className="bg-white p-6 shadow rounded mb-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Create a New Tournament</h3>
                        <div className="flex flex-wrap gap-4">
                            <input
                                name="name"
                                placeholder="Tournament Name"
                                onChange={handleChange}
                                className="border p-2 rounded w-full md:w-1/3"
                                required
                            />
                            <input
                                name="teamLimit"
                                type="number"
                                placeholder="Team Limit"
                                onChange={handleChange}
                                className="border p-2 rounded w-full md:w-1/3"
                                required
                            />
                            <input
                                name="entryFee"
                                type="number"
                                placeholder="Entry Fee"
                                onChange={handleChange}
                                className="border p-2 rounded w-full md:w-1/3"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Create Tournament
                        </button>
                    </form>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Tournaments</h3>
                    <ul className="space-y-4">
                        {tournaments.map((tournament) => (
                            <div
                                key={tournament.id}
                                className="bg-white p-4 shadow rounded flex justify-between items-center cursor-pointer hover:bg-gray-50"
                                onClick={() => handleTournamentClick(tournament)}
                            >
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800">{tournament.name}</h4>
                                    <p className="text-gray-700">
                                        <span className="font-bold">Team Limit:</span> {tournament.teamLimit}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-bold">Entry Fee:</span> ₹{tournament.entryFee}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(tournament.id);
                                        }}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRegisterTeam(tournament.id);
                                        }}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        Register Team
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCreateSchedule(tournament.id);
                                        }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Create Schedule
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewSchedule(tournament.id);
                                        }}
                                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                                    >
                                        View Schedule
                                    </button>
                                </div>
                            </div>
                        ))}
                    </ul>
                </>
            ) : (
                <div className="bg-white p-6 shadow rounded">
                    <button
                        onClick={handleBackClick}
                        className="bg-gray-600 text-white px-4 py-2 rounded mb-4 hover:bg-gray-700"
                    >
                        Back to Tournaments
                    </button>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">{selectedTournament.name}</h3>
                    <p className="text-gray-700 mb-2">
                        <span className="font-bold">Team Limit:</span> {selectedTournament.teamLimit}
                    </p>
                    <p className="text-gray-700 mb-4">
                        <span className="font-bold">Entry Fee:</span> ₹ {selectedTournament.entryFee}
                    </p>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Teams</h4>
                    {selectedTournament.teams.length > 0 ? (
                        <ul className="space-y-4">
                            {selectedTournament.teams.map((team) => (
                                <li key={team.id} className="bg-gray-100 p-4 rounded shadow">
                                    <h5 className="text-lg font-bold text-blue-700">{team.teamName}</h5>
                                    <ul className="ml-4 mt-2 space-y-1">
                                        {team.players.map((player, index) => (
                                            <li key={index} className="text-gray-700">
                                                <span className="font-bold">{player.name}</span> -{" "}
                                                <span className="italic">{player.roles.join(", ")}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700">No teams registered yet.</p>
                    )}
                </div>
            )}
        </div>
    );
}