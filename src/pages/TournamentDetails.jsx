import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { tournamentApi } from "../services/api";
import toast from "react-hot-toast";

export default function TournamentDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [tournament, setTournament] = useState(location.state?.tournament || null);
    const [loading, setLoading] = useState(false);
    const tournamentId = params.tournamentId || new URLSearchParams(location.search).get("tournamentId");

    useEffect(() => {
        if (!tournament && tournamentId) {
            setLoading(true);
            tournamentApi.get(`/tournament/${tournamentId}`)
                .then(res => setTournament(res.data))
                .catch(() => {
                    setTournament(null);
                    toast.error("Failed to load tournament details");
                })
                .finally(() => setLoading(false));
        }
    }, [tournament, tournamentId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-blue-800">Loading tournament details...</h2>
                </div>
            </div>
        );
    }

    if (!tournament) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-4">Tournament details not found.</h2>
                    <button 
                        onClick={() => navigate(-1)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg transition-all"
                >
                    ← Back
                </button>

                {/* Tournament Header */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100 mb-6">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-blue-800">{tournament.name}</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <h3 className="font-semibold text-blue-800 mb-1">Team Limit</h3>
                            <p className="text-2xl font-bold text-blue-600">{tournament.teamLimit}</p>
                        </div>
                        <div className="bg-sky-50 p-4 rounded-xl">
                            <h3 className="font-semibold text-sky-800 mb-1">Entry Fee</h3>
                            <p className="text-2xl font-bold text-sky-600">₹{tournament.entryFee}</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-xl">
                            <h3 className="font-semibold text-orange-800 mb-1">Venue</h3>
                            <p className="text-lg font-semibold text-orange-600">{tournament.venue}</p>
                        </div>
                        <div className="bg-cyan-50 p-4 rounded-xl">
                            <h3 className="font-semibold text-cyan-800 mb-1">Location</h3>
                            <p className="text-sm font-medium text-cyan-600">{tournament.city}, {tournament.state}</p>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                        <h3 className="font-semibold text-gray-800 mb-2">Full Address</h3>
                        <p className="text-gray-600">{tournament.street}, {tournament.city}, {tournament.district}, {tournament.state}</p>
                    </div>
                </div>

                {/* Teams Section */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100">
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7H16c-.8 0-1.54.37-2.01.99L12 10l-1.99-2.01A2.99 2.99 0 0 0 8 7H6.94c-1.4 0-2.59.93-2.9 2.37L1.5 16H4v6h2v-6h2.5l1.5-4.5L12 14l2-2.5L15.5 16H18v6h2z"/>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-blue-800">Registered Teams</h2>
                    </div>

                    {tournament.teams && tournament.teams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tournament.teams.map((team) => (
                                <div key={team.id} className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 border border-blue-100">
                                    <h3 className="text-lg font-bold text-blue-800 mb-4">{team.teamName}</h3>
                                    <div className="space-y-2">
                                        {team.players.map((player, index) => (
                                            <div key={index} className="flex justify-between items-center py-2 border-b border-blue-100 last:border-b-0">
                                                <span className="font-medium text-gray-800">{player.name}</span>
                                                <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                                    {player.roles.join(", ")}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7H16c-.8 0-1.54.37-2.01.99L12 10l-1.99-2.01A2.99 2.99 0 0 0 8 7H6.94c-1.4 0-2.59.93-2.9 2.37L1.5 16H4v6h2v-6h2.5l1.5-4.5L12 14l2-2.5L15.5 16H18v6h2z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No teams registered yet</h3>
                            <p className="text-gray-500">Teams will appear here once they register for this tournament</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}