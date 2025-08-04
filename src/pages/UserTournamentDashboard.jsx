import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser } from "../auth";
import { tournamentApi } from "../services/api";
import Select from "react-select";
import { State, City } from "country-state-city";
import {
    Box,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Grid,
    Paper,
    Divider,
    Chip
} from "@mui/material";

export default function UserTournamentDashboard() {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [search, setSearch] = useState({
        state: "",
        district: "",
        city: "",
        minFee: "",
        maxFee: "",
        minTeams: "",
        maxTeams: ""
    });
    const [filteredTournaments, setFilteredTournaments] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
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
        // Load Indian states
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
            alert("Failed to fetch tournaments");
        }
    };

    useEffect(() => {
        fetchTournaments();
    }, []);

    // Only filter when user clicks Apply
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
        if (search.minFee) {
            filtered = filtered.filter(t => t.entryFee >= Number(search.minFee));
        }
        if (search.maxFee) {
            filtered = filtered.filter(t => t.entryFee <= Number(search.maxFee));
        }
        if (search.minTeams) {
            filtered = filtered.filter(t => t.teamLimit >= Number(search.minTeams));
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
        navigate('/tournament-details', { state: { tournament } });
    };

    const handleBackClick = () => {
        setSelectedTournament(null);
    };

    const handleRegisterClick = (tournamentId) => {
        navigate(`/register-team?tournamentId=${tournamentId}`);
    };

    const handleViewScheduleClick = (tournamentId) => {
        navigate(`/view-schedule?tournamentId=${tournamentId}`);
    };

    return (
        <Box sx={{ bgcolor: "#f3f4f6", minHeight: "100vh", p: 4 }}>
            <Grid container spacing={2} alignItems="flex-start" wrap="nowrap">
                {/* Left Sidebar: Search & Filter */}
                <Grid item sx={{ minWidth: 300, maxWidth: 340, flex: '0 0 320px' }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, position: "sticky", top: 32, minWidth: 260, maxWidth: 340 }}>
                        <Typography variant="h6" fontWeight={700} mb={2} color="text.secondary">
                            Search & Filter
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Select
                                options={stateOptions}
                                onChange={handleStateChange}
                                placeholder="Select State"
                                isClearable
                                className="w-full"
                            />
                            <Select
                                options={districtOptions}
                                onChange={handleDistrictChange}
                                placeholder="Select District/City"
                                isClearable
                                isDisabled={!search.state}
                                className="w-full"
                            />
                            <input
                                name="city"
                                value={search.city}
                                onChange={handleSearchChange}
                                placeholder="City"
                                className="border p-2 rounded w-full"
                            />
                            <input
                                name="maxFee"
                                value={search.maxFee}
                                onChange={handleSearchChange}
                                placeholder="Max Entry Fee"
                                type="number"
                                className="border p-2 rounded w-full"
                            />
                            <input
                                name="maxTeams"
                                value={search.maxTeams}
                                onChange={handleSearchChange}
                                placeholder="Max Team Limit"
                                type="number"
                                className="border p-2 rounded w-full"
                            />
                            <Button
                                onClick={handleApplyFilter}
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2, borderRadius: 2 }}
                                fullWidth
                            >
                                Apply
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item sx={{ minWidth: 350, maxWidth: '100%', flex: '1 1 0' }}>
                    <Card sx={{ height: '75vh', overflowY: 'auto', p: 2, borderRadius: 3, boxShadow: 3, minWidth: 320, maxWidth: '100%' }}>
                        <Typography variant="h5" fontWeight={700} mb={3} color="primary">
                            Available Tournaments
                        </Typography>
                        <Grid container spacing={3}>
                            {(filteredTournaments.length > 0
                                ? filteredTournaments
                                : (search.state || search.district || search.city || search.minFee || search.maxFee || search.minTeams || search.maxTeams)
                                    ? []
                                    : tournaments
                            ).map((tournament) => (
                                <Grid item xs={12} md={6} lg={4} key={tournament.id}>
                                    <Card
                                        sx={{ cursor: "pointer", borderRadius: 3, boxShadow: 3, transition: "0.2s", '&:hover': { boxShadow: 6 } }}
                                        onClick={() => handleTournamentClick(tournament)}
                                    >
                                        <CardContent>
                                            <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
                                                {tournament.name}
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <Chip label={`Team Limit: ${tournament.teamLimit}`} color="info" sx={{ mr: 1, mb: 1 }} />
                                            <Chip label={`Entry Fee: ₹${tournament.entryFee}`} color="success" sx={{ mb: 1 }} />
                                            <Typography variant="body2" color="text.secondary" mt={2}>
                                                <strong>Venue:</strong> {tournament.venue}<br />
                                                <strong>Street:</strong> {tournament.street}<br />
                                                <strong>City:</strong> {tournament.city}<br />
                                                <strong>District:</strong> {tournament.district}<br />
                                                <strong>State:</strong> {tournament.state}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button
                                                onClick={(e) => { e.stopPropagation(); handleRegisterClick(tournament.id); }}
                                                variant="contained"
                                                color="success"
                                                sx={{ borderRadius: 2 }}
                                            >
                                                Register
                                            </Button>
                                            <Button
                                                onClick={(e) => { e.stopPropagation(); handleViewScheduleClick(tournament.id); }}
                                                variant="contained"
                                                color="secondary"
                                                sx={{ borderRadius: 2 }}
                                            >
                                                View Schedule
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                            {(filteredTournaments.length === 0 &&
                                (search.state || search.district || search.city || search.minFee || search.maxFee || search.minTeams || search.maxTeams)) && (
                                <Grid item xs={12}>
                                    <Paper elevation={0} sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
                                        No tournaments found for the selected filters.
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}