import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { tournamentApi, schedulerApi } from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import { State, City } from "country-state-city";
import { getUser } from "../services/authService";

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
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select as MuiSelect
} from "@mui/material";

export default function AdminTournamentDashboard() {

    const [tournaments, setTournaments] = useState([]);
    const [form, setForm] = useState({
        name: "",
        teamLimit: 0,
        entryFee: 0,
        venue: "",
        street: "",
        state: "",
        district: "",
        city: "",
        pincode: ""
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
        const email = params.get("username") || params.get("email");
        const user = getUser();
        // If email is missing in URL, redirect with email
        if (user && user.role === "ADMIN" && !email && user.email) {
            navigate(`/admin?email=${user.email}`, { replace: true });
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
            toast.error("Failed to fetch tournaments");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleStateChange = (selected) => {
        setForm({ ...form, state: selected ? selected.value : "", district: "", city: "" });
        if (selected) {
            // Use cities as districts for simplicity (country-state-city doesn't have districts)
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
        setForm({ ...form, district: selected ? selected.value : "" });
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
        navigate('/tournament-details', { state: { tournament } });
    };

    // Removed handleBackClick, not needed anymore

    const handleRegisterTeam = (tournamentId, entryFee) => {
        navigate(`/register-team?tournamentId=${tournamentId}&fee=${entryFee}`);
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
        // Fetch user's teams for "register with existing team"
        import("../services/api").then(({ teamApi }) => {
            teamApi.get("/teams/my")
                .then(res => setMyTeams(res.data))
                .catch(() => setMyTeams([]));
        });
    }, []);
    const handleRegisterWithExistingTeam = (tournament) => {
        setSelectedTournamentForExisting(tournament);
        setRegisterDialogOpen(true);
    };

    const handleExistingTeamRegister = async () => {
        if (!selectedTeamId || !selectedTournamentForExisting) return;
        try {
            const { teamApi } = await import("../services/api");
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

    return (
        <Box sx={{
            minHeight: '100vh',
            p: 4,
            backgroundImage: 'url(/assets/cricket-stadium-vector.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
        }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, minWidth: 340, maxWidth: 1200, width: '100%', background: 'rgba(255,255,255,0.88)', boxShadow: 4 }}>
                <Toaster position="top-center" reverseOrder={false} />
                <Grid container spacing={2} alignItems="flex-start" wrap="nowrap">
                    {/* Left Sidebar: Create Tournament */}
                    <Grid item sx={{ minWidth: 300, maxWidth: 340, flex: '0 0 320px' }}>
                        <Paper elevation={1} sx={{ p: 2, borderRadius: 3, position: "sticky", top: 32, minWidth: 260, maxWidth: 340, background: 'rgba(255,255,255,0.93)' }}>
                            <Typography variant="h6" fontWeight={700} mb={2} color="text.secondary">
                                Create a New Tournament
                            </Typography>
                            <form onSubmit={handleCreate}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Tournament Name"
                                        required
                                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                                    />
                                    <input
                                        name="teamLimit"
                                        type="number"
                                        value={form.teamLimit}
                                        onChange={handleChange}
                                        placeholder="Team Limit"
                                        required
                                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                                    />
                                    <input
                                        name="entryFee"
                                        type="number"
                                        value={form.entryFee}
                                        onChange={handleChange}
                                        placeholder="Entry Fee"
                                        required
                                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                                    />
                                    <input
                                        name="venue"
                                        value={form.venue}
                                        onChange={handleChange}
                                        placeholder="Venue"
                                        required
                                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                                    />
                                    <input
                                        name="street"
                                        value={form.street}
                                        onChange={handleChange}
                                        placeholder="Street"
                                        required
                                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                                    />
                                    <Select
                                        options={stateOptions}
                                        value={stateOptions.find((opt) => opt.value === form.state)}
                                        onChange={handleStateChange}
                                        placeholder="Select State"
                                        isClearable
                                    />
                                    <Select
                                        options={districtOptions}
                                        value={districtOptions.find((opt) => opt.value === form.district)}
                                        onChange={handleDistrictChange}
                                        placeholder="Select District"
                                        isClearable
                                    />
                                    <input
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        required
                                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                                    />
                                    <input
                                        name="pincode"
                                        value={form.pincode}
                                        onChange={handleChange}
                                        placeholder="Pincode"
                                        required
                                        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                                    />
                                    <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: 2 }}>
                                        Create Tournament
                                    </Button>
                                </Box>
                            </form>
                        </Paper>
                    </Grid>
                    {/* Right Main Content: Tournaments */}
                    <Grid item sx={{ minWidth: 350, maxWidth: '100%', flex: '1 1 0' }}>
                        <Card sx={{ height: '75vh', overflowY: 'auto', p: 2, borderRadius: 3, boxShadow: 3, minWidth: 320, maxWidth: '100%', background: 'rgba(255,255,255,0.93)' }}>
                            <Typography variant="h5" fontWeight={700} mb={3} color="primary">
                                Tournaments
                            </Typography>
                            <Grid container spacing={3}>
                                {tournaments.map((tournament) => (
                                    <Grid item xs={12} md={6} lg={4} key={tournament.id}>
                                        <Card
                                            sx={{ borderRadius: 3, boxShadow: 3, transition: "0.2s", cursor: "pointer", '&:hover': { boxShadow: 6 }, background: 'rgba(255,255,255,0.98)' }}
                                            onClick={() => handleTournamentClick(tournament)}
                                        >
                                            <CardContent>
                                                <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>
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
                                                    <strong>State:</strong> {tournament.state}<br />
                                                    <strong>Pincode:</strong> {tournament.pincode}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleRegisterTeam(tournament.id, tournament.entryFee);
                                                    }}
                                                    variant="contained"
                                                    color="success"
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    Register Team
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleRegisterWithExistingTeam(tournament);
                                                    }}
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    Register with Existing Team
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCreateSchedule(tournament.id);
                                                    }}
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    Create Schedule
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleViewSchedule(tournament.id);
                                                    }}
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    View Schedule
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(tournament.id);
                                                    }}
                                                    variant="contained"
                                                    color="error"
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    Delete
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
                <Dialog open={registerDialogOpen} onClose={() => setRegisterDialogOpen(false)}>
                    <DialogTitle>Register with Existing Team</DialogTitle>
                    <DialogContent>
                        <MuiSelect
                            value={selectedTeamId}
                            onChange={e => setSelectedTeamId(e.target.value)}
                            fullWidth
                            displayEmpty
                        >
                            <MenuItem value="" disabled>Select your team</MenuItem>
                            {myTeams.map(team => (
                                <MenuItem key={team.id} value={team.id}>
                                    {team.teamName} (ID: {team.id})
                                </MenuItem>
                            ))}
                        </MuiSelect>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setRegisterDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleExistingTeamRegister} variant="contained" disabled={!selectedTeamId}>Register</Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Box>
)}