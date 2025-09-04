import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser } from "../auth";
import { tournamentApi } from "../services/api";
import Select from "react-select";
import { State, City } from "country-state-city";
import toast from "react-hot-toast";

export default function AdminTournamentDashboard() {
    const [tournaments, setTournaments] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        teamLimit: "",
        entryFee: "",
        venue: "",
        street: "",
        state: "",
        district: "",
        city: "",
        pincode: ""
    });
    const [stateOptions, setStateOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const username = params.get("username");
        const user = getUser();
        if (user && user.role === "ADMIN" && !username && user.sub) {
            navigate(`/admin?username=${user.sub}`, { replace: true });
        }
    }, [location, navigate]);

    useEffect(() => {
        const states = State.getStatesOfCountry("IN").map((s) => ({
            value: s.name,
            label: s.name,
            isoCode: s.isoCode
        }));
        setStateOptions(states);
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const res = await tournamentApi.get("/tournament/all");
            setTournaments(res.data);
        } catch (err) {
            console.error("Error fetching tournaments:", err);
            toast.error("Failed to fetch tournaments");
            setTournaments([]);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStateChange = (selected) => {
        setFormData({ ...formData, state: selected ? selected.value : "", district: "" });
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
        setFormData({ ...formData, district: selected ? selected.value : "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await tournamentApi.post("/tournament/create", formData);
            toast.success("Tournament created successfully!");
            setFormData({
                name: "",
                teamLimit: "",
                entryFee: "",
                venue: "",
                street: "",
                state: "",
                district: "",
                city: "",
                pincode: ""
            });
            fetchTournaments();
        } catch (err) {
            toast.error(err.response?.data || "Failed to create tournament");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTournamentClick = (tournament) => {
        navigate(`/tournament-details?tournamentId=${tournament.id}`, { state: { tournament } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Create Tournament Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100 sticky top-6">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-blue-800">Create Tournament</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Tournament Name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        name="teamLimit"
                                        type="number"
                                        value={formData.teamLimit}
                                        onChange={handleInputChange}
                                        placeholder="Team Limit"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    <input
                                        name="entryFee"
                                        type="number"
                                        value={formData.entryFee}
                                        onChange={handleInputChange}
                                        placeholder="Entry Fee"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <input
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleInputChange}
                                    placeholder="Venue Name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />

                                <input
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    placeholder="Street Address"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />

                                <Select
                                    options={stateOptions}
                                    onChange={handleStateChange}
                                    placeholder="Select State"
                                    isClearable
                                    className="text-sm"
                                />

                                <Select
                                    options={districtOptions}
                                    onChange={handleDistrictChange}
                                    placeholder="Select District"
                                    isClearable
                                    isDisabled={!formData.state}
                                    className="text-sm"
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="City"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    <input
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        placeholder="Pincode"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50"
                                >
                                    {isLoading ? "Creating..." : "Create Tournament"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Tournaments List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold text-blue-800">All Tournaments</h1>
                            </div>

                            {tournaments.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No tournaments created yet</h3>
                                    <p className="text-gray-500">Create your first tournament using the form</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {tournaments.map((tournament) => (
                                        <button
                                            key={tournament.id}
                                            className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-200 transform hover:-translate-y-1 cursor-pointer w-full text-left"
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
                                                    <span className="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                                        {tournament.teamLimit} Teams
                                                    </span>
                                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                                        ₹{tournament.entryFee}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 text-sm text-gray-600 mb-4">
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

                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); navigate(`/register-team?tournamentId=${tournament.id}&fee=${tournament.entryFee}`); }}
                                                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-3 rounded-lg transition-all text-sm"
                                                    >
                                                        Register Team
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); navigate(`/create-schedule?tournamentId=${tournament.id}`); }}
                                                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-3 rounded-lg transition-all text-sm"
                                                    >
                                                        Create Schedule
                                                    </button>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}