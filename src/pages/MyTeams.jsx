import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teamApi } from "../services/api";
import toast from "react-hot-toast";

export default function MyTeams() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const res = await teamApi.get("/teams/my");
            setTeams(res.data);
        } catch (err) {
            toast.error("Failed to fetch teams");
        } finally {
            setLoading(false);
        }
    };

    const handleViewTeam = (teamId) => {
        navigate(`/my-team/${teamId}`);
    };

    const handleEditTeam = (teamId) => {
        navigate(`/edit-team/${teamId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-blue-800">Loading your teams...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7H16c-.8 0-1.54.37-2.01.99L12 10l-1.99-2.01A2.99 2.99 0 0 0 8 7H6.94c-1.4 0-2.59.93-2.9 2.37L1.5 16H4v6h2v-6h2.5l1.5-4.5L12 14l2-2.5L15.5 16H18v6h2z"/>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-blue-800 mb-2">My Teams</h1>
                    <p className="text-gray-600">Manage your registered cricket teams</p>
                </div>

                {teams.length === 0 ? (
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-blue-100 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7H16c-.8 0-1.54.37-2.01.99L12 10l-1.99-2.01A2.99 2.99 0 0 0 8 7H6.94c-1.4 0-2.59.93-2.9 2.37L1.5 16H4v6h2v-6h2.5l1.5-4.5L12 14l2-2.5L15.5 16H18v6h2z"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-4">No teams registered yet</h3>
                        <p className="text-gray-500 mb-6">Start by registering your first team for a tournament</p>
                        <button
                            onClick={() => navigate("/user")}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all"
                        >
                            Browse Tournaments
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teams.map((team) => (
                            <div
                                key={team.id}
                                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                                    <h3 className="text-xl font-bold text-white mb-1">{team.teamName}</h3>
                                    <p className="text-blue-100 text-sm">Team ID: {team.id}</p>
                                </div>

                                <div className="p-6">
                                    <div className="mb-4">
                                        <div className="flex items-center mb-2">
                                            <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                            <span className="font-medium text-gray-700">Captain: {team.captainName}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7H16c-.8 0-1.54.37-2.01.99L12 10l-1.99-2.01A2.99 2.99 0 0 0 8 7H6.94c-1.4 0-2.59.93-2.9 2.37L1.5 16H4v6h2v-6h2.5l1.5-4.5L12 14l2-2.5L15.5 16H18v6h2z"/>
                                            </svg>
                                            <span className="text-gray-600">Players: {team.players?.length || 0}</span>
                                        </div>
                                    </div>

                                    {team.players && team.players.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="font-medium text-gray-700 mb-2">Key Players:</h4>
                                            <div className="space-y-1">
                                                {team.players.slice(0, 3).map((player, index) => (
                                                    <div key={index} className="flex justify-between text-sm">
                                                        <span className="text-gray-600">{player.name}</span>
                                                        <span className="text-blue-600 text-xs">
                                                            {player.roles?.slice(0, 2).join(", ") || "Player"}
                                                        </span>
                                                    </div>
                                                ))}
                                                {team.players.length > 3 && (
                                                    <div className="text-xs text-gray-500">
                                                        +{team.players.length - 3} more players
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleViewTeam(team.id)}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg transition-all text-sm font-medium"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleEditTeam(team.id)}
                                            className="flex-1 border border-blue-600 text-blue-700 hover:bg-blue-50 py-2 px-4 rounded-lg transition-all text-sm font-medium"
                                        >
                                            Edit Team
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}