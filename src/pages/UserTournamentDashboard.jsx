import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { tournamentApi } from "../services/api";

export default function UserTournamentDashboard() {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null); // Track selected tournament
    const navigate = useNavigate(); // Initialize navigate

    const fetchTournaments = async () => {
        try {
            const res = await tournamentApi.get("/tournament/all");
            setTournaments(res.data);
        } catch (err) {
            alert("Failed to fetch tournaments");
        }
    };

    const handleTournamentClick = (tournament) => {
        setSelectedTournament(tournament); // Set the selected tournament
    };

    const handleBackClick = () => {
        setSelectedTournament(null); // Reset the selected tournament
    };

    const handleRegisterClick = (tournamentId) => {
        navigate(`/register-team?tournamentId=${tournamentId}`); // Navigate to RegisterTeam with tournamentId
    };

    const handleViewScheduleClick = (tournamentId) => {
        navigate(`/view-schedule?tournamentId=${tournamentId}`); // Navigate to ViewSchedule with tournamentId
    };

    useEffect(() => {
        fetchTournaments();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
                {selectedTournament ? "Tournament Details" : "Available Tournaments"}
            </h2>
            {!selectedTournament ? (
                <ul className="space-y-6">
                    {tournaments.map((tournament) => (
                        <li
                            key={tournament.id}
                            className="bg-white p-6 shadow rounded cursor-pointer hover:bg-gray-50"
                            onClick={() => handleTournamentClick(tournament)}
                        >
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{tournament.name}</h3>
                            <p className="text-gray-700 mb-1">
                                <span className="font-bold">Team Limit:</span> {tournament.teamLimit}
                            </p>
                            <p className="text-gray-700 mb-4">
                                <span className="font-bold">Entry Fee:</span> ${tournament.entryFee}
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering the card click
                                        handleRegisterClick(tournament.id);
                                    }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Register
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering the card click
                                        handleViewScheduleClick(tournament.id);
                                    }}
                                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                                >
                                    View Schedule
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="bg-white p-6 shadow rounded">
                    <button
                        onClick={handleBackClick}
                        className="bg-gray-600 text-white px-4 py-2 rounded mb-4 hover:bg-gray-700"
                    >
                        Back to Tournaments
                    </button>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{selectedTournament.name}</h3>
                    <p className="text-gray-700 mb-2">
                        <span className="font-bold">Team Limit:</span> {selectedTournament.teamLimit}
                    </p>
                    <p className="text-gray-700 mb-4">
                        <span className="font-bold">Entry Fee:</span> ${selectedTournament.entryFee}
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