import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teamApi } from "../services/api";
import toast from "react-hot-toast";

export default function MyTournaments() {
    const [registeredTournaments, setRegisteredTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRegisteredTournaments();
    }, []);

    const fetchRegisteredTournaments = async () => {
        try {
            const res = await teamApi.get("/teams/my-tournaments");
            setRegisteredTournaments(res.data);
        } catch (err) {
            toast.error("Failed to fetch registered tournaments");
            setRegisteredTournaments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTournamentClick = (tournament) => {
        const tournamentId = tournament.id || tournament.tournamentId;
        navigate(`/tournament-details?tournamentId=${tournamentId}`, { state: { tournament } });
    };

    const handleViewScheduleClick = (tournamentId) => {
        navigate(`/view-schedule?tournamentId=${tournamentId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-blue-600 font-medium">Loading tournaments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100">
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-blue-800">My Registered Tournaments</h1>
                    </div>

                    {registeredTournaments.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tournaments registered yet</h3>
                            <p className="text-gray-500 mb-4">Register for tournaments to see them here</p>
                            <button
                                onClick={() => navigate("/user")}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-all"
                            >
                                Browse Tournaments
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {registeredTournaments.map((tournament) => (
                                <div
                                    key={tournament.id}
                                    className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-200 transform hover:-translate-y-1 cursor-pointer"
                                    onClick={() => handleTournamentClick(tournament)}
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-lg font-bold text-blue-800 flex-1">{tournament.name}</h3>
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ml-2">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                                Registered
                                            </span>
                                            <span className="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                                {tournament.teamLimit} Teams
                                            </span>
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                                ₹{tournament.entryFee}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600 mb-6">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                                </svg>
                                                <span><strong>Start Date:</strong> {new Date(tournament.startingDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                </svg>
                                                <span><strong>Venue:</strong> {tournament.venue}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                                </svg>
                                                <span><strong>Location:</strong> {tournament.city}, {tournament.state}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleViewScheduleClick(tournament.id); }}
                                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-3 rounded-lg transition-all text-sm flex items-center justify-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                                </svg>
                                                View Schedule
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}