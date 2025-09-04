import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser } from "../auth";
import { tournamentApi, teamApi } from "../services/api";
import Select from "react-select";
import { State, City } from "country-state-city";
import toast from "react-hot-toast";

export default function UserTournamentDashboard() {
    const [tournaments, setTournaments] = useState([]);
    const [filteredTournaments, setFilteredTournaments] = useState([]);
    const [search, setSearch] = useState({
        state: "",
        district: "",
        city: "",
        maxFee: "",
        maxTeams: ""
    });
    const [stateOptions, setStateOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [myTeams, setMyTeams] = useState([]);
    const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
    const [selectedTournamentForExisting, setSelectedTournamentForExisting] = useState(null);
    const [selectedTeamId, setSelectedTeamId] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const username = params.get("username");
        const user = getUser && getUser();
        if (user && user.role === "USER" && !username && user.sub) {
            navigate(`/user?username=${user.sub}`, { replace: true });
        }
    }, [location, navigate]);

    useEffect(() => {
        const states = State.getStatesOfCountry("IN").map((s) => ({
            value: s.name,
            label: s.name,
            isoCode: s.isoCode
        }));
        setStateOptions(states);
    }, []);

    const fetchTournaments = async () => {
        try {
            const res = await tournamentApi.get("/tournament/all");
            setTournaments(res.data);
        } catch (err) {
            toast.error("Failed to fetch tournaments");
        }
    };

    useEffect(() => {
        fetchTournaments();
        teamApi.get("/teams/my")
            .then(res => setMyTeams(res.data))
            .catch(() => setMyTeams([]));
    }, []);

    const handleApplyFilter = () => {
        let filtered = tournaments;
        if (search.state) {
            filtered = filtered.filter(t => t.state?.toLowerCase().includes(search.state.toLowerCase()));
        }
        if (search.district) {
            filtered = filtered.filter(t => t.district?.toLowerCase().includes(search.district.toLowerCase()));
        }
        if (search.city) {
            filtered = filtered.filter(t => t.city?.toLowerCase().includes(search.city.toLowerCase()));
        }
        if (search.maxFee) {
            filtered = filtered.filter(t => t.entryFee <= Number(search.maxFee));
        }
        if (search.maxTeams) {
            filtered = filtered.filter(t => t.teamLimit <= Number(search.maxTeams));
        }
        setFilteredTournaments(filtered);
    };

    const handleStateChange = (selected) => {
        setSearch({ ...search, state: selected ? selected.value : "", district: "" });
        if (selected) {
            const cities = City.getCitiesOfState("IN", selected.isoCode).map((c) => ({
                value: c.name,
                label: c.name
            }));
            setDistrictOptions(cities);
        } else {
            setDistrictOptions([]);
        }
    };

    const handleDistrictChange = (selected) => {
        setSearch({ ...search, district: selected ? selected.value : "" });
    };

    const handleSearchChange = (e) => {
        setSearch({ ...search, [e.target.name]: e.target.value });
    };

    const handleTournamentClick = (tournament) => {
        navigate(`/tournament-details?tournamentId=${tournament.id}`, { state: { tournament } });
    };

    const handleRegisterClick = (tournamentId, entryFee) => {
        navigate(`/register-team?tournamentId=${tournamentId}&fee=${entryFee}`);
    };

    const handleViewScheduleClick = (tournamentId) => {
        navigate(`/view-schedule?tournamentId=${tournamentId}`);
    };

    const handleRegisterWithExistingTeam = (tournament) => {
        setSelectedTournamentForExisting(tournament);
        setRegisterDialogOpen(true);
    };

    const handleExistingTeamRegister = async () => {
        if (!selectedTeamId || !selectedTournamentForExisting) return;
        try {
            await teamApi.post("/teams/register-existing", {
                teamId: selectedTeamId,
                tournamentId: selectedTournamentForExisting.id,
                fee: selectedTournamentForExisting.entryFee
            });
            toast.success("Team registered to tournament successfully!");
            setRegisterDialogOpen(false);
        } catch (err) {
            toast.error(err.response?.data || "Failed to register team to tournament");
        }
    };

    const displayTournaments = filteredTournaments.length > 0 ? filteredTournaments : 
        (search.state || search.district || search.city || search.maxFee || search.maxTeams) ? [] : tournaments;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar - Search & Filter */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100 sticky top-6">
                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-blue-800">Search & Filter</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                    <Select
                                        options={stateOptions}
                                        onChange={handleStateChange}
                                        placeholder="Select State"
                                        isClearable
                                        className="text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">District/City</label>
                                    <Select
                                        options={districtOptions}
                                        onChange={handleDistrictChange}
                                        placeholder="Select District/City"
                                        isClearable
                                        isDisabled={!search.state}
                                        className="text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <input
                                        name="city"
                                        value={search.city}
                                        onChange={handleSearchChange}
                                        placeholder="Enter city name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Entry Fee</label>
                                    <input
                                        name="maxFee"
                                        value={search.maxFee}
                                        onChange={handleSearchChange}
                                        placeholder="Enter max fee"
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Team Limit</label>
                                    <input
                                        name="maxTeams"
                                        value={search.maxTeams}
                                        onChange={handleSearchChange}
                                        placeholder="Enter max teams"
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <button
                                    onClick={handleApplyFilter}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Tournaments */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100 min-h-[80vh]">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold text-blue-800">Available Tournaments</h1>
                            </div>

                            {displayTournaments.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No tournaments found</h3>
                                    <p className="text-gray-500">Try adjusting your search filters</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {displayTournaments.map((tournament) => (
                                        <div
                                            key={tournament.id}
                                            className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-200 transform hover:-translate-y-1 cursor-pointer"
                                            onClick={() => handleTournamentClick(tournament)}
                                        >
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <h3 className="text-lg font-bold text-blue-800 flex-1">{tournament.name}</h3>
                                                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center ml-2">
                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                                        tournament.teams?.length >= tournament.teamLimit 
                                                            ? 'bg-red-100 text-red-800' 
                                                            : 'bg-sky-100 text-sky-800'
                                                    }`}>
                                                        {tournament.teams?.length || 0}/{tournament.teamLimit} Teams
                                                    </span>
                                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                                        ₹{tournament.entryFee}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 text-sm text-gray-600 mb-6">
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                                        </svg>
                                                        <span><strong>Start Date:</strong> {new Date(tournament.startingDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                        </svg>
                                                        <span><strong>Venue:</strong> {tournament.venue}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                                        </svg>
                                                        <span><strong>Location:</strong> {tournament.city}, {tournament.state}</span>
                                                    </div>
                                                </div>

                                                {(() => {
                                                    const today = new Date();
                                                    const startDate = new Date(tournament.startingDate);
                                                    const daysDiff = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
                                                    const isFull = tournament.teams?.length >= tournament.teamLimit;
                                                    const canRegister = daysDiff >= 2 && !isFull;
                                                    
                                                    return (
                                                        <div className="space-y-3">
                                                            {!canRegister && (
                                                                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                                                                    {isFull ? 'Tournament is full!' : `Registration closed - Tournament starts in ${daysDiff} day${daysDiff !== 1 ? 's' : ''}`}
                                                                </div>
                                                            )}
                                                            <div className="flex flex-wrap gap-2">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleRegisterClick(tournament.id, tournament.entryFee); }}
                                                                    disabled={!canRegister}
                                                                    className={`flex-1 font-semibold py-2 px-3 rounded-lg transition-all duration-200 text-sm flex items-center justify-center space-x-1 ${
                                                                        canRegister 
                                                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white' 
                                                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                    }`}
                                                                >
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7H16c-.8 0-1.54.37-2.01.99L12 10l-1.99-2.01A2.99 2.99 0 0 0 8 7H6.94c-1.4 0-2.59.93-2.9 2.37L1.5 16H4v6h2v-6h2.5l1.5-4.5L12 14l2-2.5L15.5 16H18v6h2z"/>
                                                                    </svg>
                                                                    <span>Register</span>
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleRegisterWithExistingTeam(tournament); }}
                                                                    disabled={!canRegister}
                                                                    className={`flex-1 font-semibold py-2 px-3 rounded-lg transition-all duration-200 text-sm flex items-center justify-center space-x-1 ${
                                                                        canRegister 
                                                                            ? 'border border-blue-600 text-blue-700 hover:bg-blue-50' 
                                                                            : 'border border-gray-300 text-gray-500 cursor-not-allowed'
                                                                    }`}
                                                                >
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                                    </svg>
                                                                    <span>Use Team</span>
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleViewScheduleClick(tournament.id); }}
                                                                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 text-sm flex items-center justify-center"
                                                                >
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal for existing team registration */}
                {registerDialogOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                            <h3 className="text-xl font-bold text-blue-800 mb-4">Register with Existing Team</h3>
                            <select
                                value={selectedTeamId}
                                onChange={e => setSelectedTeamId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
                            >
                                <option value="" disabled>Select your team</option>
                                {myTeams.map(team => (
                                    <option key={team.id} value={team.id}>
                                        {team.teamName} (ID: {team.id})
                                    </option>
                                ))}
                            </select>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setRegisterDialogOpen(false)}
                                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleExistingTeamRegister}
                                    disabled={!selectedTeamId}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}