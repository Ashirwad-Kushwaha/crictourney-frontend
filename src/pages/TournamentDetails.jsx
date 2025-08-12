
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Divider, Grid, Paper, Button, Chip } from "@mui/material";
import { tournamentApi, teamApi } from "../services/api";

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
                .catch(() => setTournament(null))
                .finally(() => setLoading(false));
        }
    }, [tournament, tournamentId]);

    if (loading) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h5" color="primary">Loading tournament details...</Typography>
            </Box>
        );
    }
    if (!tournament) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h5" color="error">Tournament details not found.</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>Go Back</Button>
            </Box>
        );
    }

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
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3, minWidth: 340, maxWidth: 1200, width: '100%', background: 'rgba(255,255,255,0.88)', boxShadow: 4 }}>
                <Button
                    onClick={() => navigate(-1)}
                    variant="contained"
                    color="secondary"
                    sx={{ mb: 2, borderRadius: 2, fontSize: '0.95rem', py: 0.5, px: 2 }}
                >
                    Back
                </Button>
                {/* Tournament Info Horizontal Card */}
                <Paper elevation={1} sx={{ p: 2, borderRadius: 3, width: "100%", mb: 3, overflowX: "auto", display: "flex", alignItems: "center", minHeight: 80, background: 'rgba(255,255,255,0.93)' }}>
                    <Typography variant="h5" fontWeight={700} color="primary" sx={{ minWidth: 160, mr: 3, fontSize: '1.35rem' }}>
                        {tournament.name}
                    </Typography>
                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                    <Box sx={{ display: "flex", gap: 2, overflowX: "auto", width: "100%" }}>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, fontSize: '0.98rem' }}>
                            <strong>Team Limit:</strong> {tournament.teamLimit}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, fontSize: '0.98rem' }}>
                            <strong>Entry Fee:</strong> ₹{tournament.entryFee}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, fontSize: '0.98rem' }}>
                            <strong>Venue:</strong> {tournament.venue}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, fontSize: '0.98rem' }}>
                            <strong>Street:</strong> {tournament.street}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, fontSize: '0.98rem' }}>
                            <strong>City:</strong> {tournament.city}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, fontSize: '0.98rem' }}>
                            <strong>District:</strong> {tournament.district}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, fontSize: '0.98rem' }}>
                            <strong>State:</strong> {tournament.state}
                        </Typography>
                    </Box>
                </Paper>
                {/* Teams Card Below */}
                <Paper elevation={1} sx={{ p: 2, borderRadius: 3, width: "100%", minHeight: 120, background: 'rgba(255,255,255,0.93)' }}>
                    <Typography variant="subtitle1" fontWeight={700} color="text.secondary" mb={1.5} sx={{ fontSize: '1.08rem' }}>
                        Teams
                    </Typography>
                    {tournament.teams && tournament.teams.length > 0 ? (
                        <Box sx={{ maxHeight: 520, overflowY: 'auto', overflowX: 'auto', pr: 1, minWidth: 340 }}>
                            <Grid container spacing={1.5} sx={{ minWidth: 500 }}>
                                {tournament.teams.map((team) => (
                                    <Grid item xs={12} key={team.id}>
                                        <Paper elevation={2} sx={{ p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.98)' }}>
                                            <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ fontSize: '1.02rem' }}>
                                                {team.teamName}
                                            </Typography>
                                            <Divider sx={{ my: 0.7 }} />
                                            <ul style={{ marginLeft: 12, marginTop: 6, fontSize: '0.97rem', minWidth: 200, padding: 0 }}>
                                                {team.players.map((player, index) => (
                                                    <li key={index} style={{ color: "#374151", marginBottom: 4, listStyle: 'disc', marginLeft: 16 }}>
                                                        <strong>{player.name}</strong> - <span style={{ fontStyle: "italic" }}>{player.roles.join(", ")}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ) : (
                        <Typography color="text.secondary" sx={{ fontSize: '0.98rem' }}>No teams registered yet.</Typography>
                    )}
                </Paper>
            </Paper>
        </Box>
    );
}

