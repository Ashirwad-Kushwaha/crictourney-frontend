import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { schedulerApi } from "../services/api";
import toast from "react-hot-toast";

export default function ViewSchedule() {
    const [searchParams] = useSearchParams();
    const tournamentId = searchParams.get("tournamentId");
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tournamentName, setTournamentName] = useState("");

    useEffect(() => {
        if (tournamentId) {
            fetchSchedule();
        }
    }, [tournamentId]);

    const fetchSchedule = async () => {
        try {
            const res = await schedulerApi.get(`/schedule/${tournamentId}`);
            setSchedule(res.data.matches || res.data || []);
            setTournamentName(res.data.tournamentName || `Tournament ${tournamentId}`);
        } catch (err) {
            toast.error("Failed to fetch schedule");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'TBD';
        return new Date(timeString).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMatchStatus = (match) => {
        if (match.status) return match.status;
        const now = new Date();
        const matchDate = new Date(match.date || match.scheduledDate);
        
        if (matchDate > now) return 'Upcoming';
        if (matchDate < now && !match.result) return 'In Progress';
        if (match.result) return 'Completed';
        return 'Scheduled';
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'upcoming':
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-blue-800">Loading schedule...</h2>
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
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-blue-800 mb-2">Match Schedule</h1>
                    <p className="text-gray-600">{tournamentName}</p>
                </div>

                {schedule.length === 0 ? (
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-blue-100 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-4">No matches scheduled yet</h3>
                        <p className="text-gray-500">The tournament schedule will be available once matches are created</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Schedule Overview */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{schedule.length}</div>
                                    <div className="text-sm text-gray-600">Total Matches</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {schedule.filter(m => getMatchStatus(m).toLowerCase() === 'completed').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Completed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {schedule.filter(m => getMatchStatus(m).toLowerCase() === 'in progress').length}
                                    </div>
                                    <div className="text-sm text-gray-600">In Progress</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {schedule.filter(m => ['upcoming', 'scheduled'].includes(getMatchStatus(m).toLowerCase())).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Upcoming</div>
                                </div>
                            </div>
                        </div>

                        {/* Matches List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {schedule.map((match, index) => (
                                <div
                                    key={match.id || index}
                                    className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-white font-semibold">
                                                Match {match.matchNumber || index + 1}
                                            </h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(getMatchStatus(match))}`}>
                                                {getMatchStatus(match)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Teams */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7H16c-.8 0-1.54.37-2.01.99L12 10l-1.99-2.01A2.99 2.99 0 0 0 8 7H6.94c-1.4 0-2.59.93-2.9 2.37L1.5 16H4v6h2v-6h2.5l1.5-4.5L12 14l2-2.5L15.5 16H18v6h2z"/>
                                                        </svg>
                                                    </div>
                                                    <span className="font-medium text-gray-800">
                                                        {match.team1Name || (typeof match.team1 === 'object' ? match.team1?.teamName : match.team1) || 'Team A'}
                                                    </span>
                                                </div>
                                                {match.team1Score && (
                                                    <span className="font-bold text-blue-600">{match.team1Score}</span>
                                                )}
                                            </div>
                                            
                                            <div className="text-center text-gray-400 text-sm mb-2">VS</div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7H16c-.8 0-1.54.37-2.01.99L12 10l-1.99-2.01A2.99 2.99 0 0 0 8 7H6.94c-1.4 0-2.59.93-2.9 2.37L1.5 16H4v6h2v-6h2.5l1.5-4.5L12 14l2-2.5L15.5 16H18v6h2z"/>
                                                        </svg>
                                                    </div>
                                                    <span className="font-medium text-gray-800">
                                                        {match.team2Name || (typeof match.team2 === 'object' ? match.team2?.teamName : match.team2) || 'Team B'}
                                                    </span>
                                                </div>
                                                {match.team2Score && (
                                                    <span className="font-bold text-orange-600">{match.team2Score}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Match Details */}
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                                </svg>
                                                <span>{formatDate(match.date || match.scheduledDate)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                </svg>
                                                <span>{formatTime(match.time || match.scheduledTime)}</span>
                                            </div>
                                            {match.venue && (
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                    </svg>
                                                    <span>{match.venue}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Result */}
                                        {match.result && (
                                            <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                                <div className="text-sm font-medium text-green-800">
                                                    Result: {match.result}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}