import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Divider, Grid, Paper, Button, Chip } from "@mui/material";

export default function TournamentDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const tournament = location.state?.tournament;

    if (!tournament) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h5" color="error">Tournament details not found.</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>Go Back</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: "#f3f4f6", minHeight: "100vh", p: 4 }}>
            <Button
                onClick={() => navigate(-1)}
                variant="contained"
                color="secondary"
                sx={{ mb: 3, borderRadius: 2 }}
            >
                Back
            </Button>
            {/* Tournament Info Horizontal Card */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, width: "100%", mb: 4, overflowX: "auto", display: "flex", alignItems: "center", minHeight: 120 }}>
                <Typography variant="h3" fontWeight={700} color="primary" sx={{ minWidth: 220, mr: 4 }}>
                    {tournament.name}
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                <Box sx={{ display: "flex", gap: 4, overflowX: "auto", width: "100%" }}>
                    <Typography variant="body1" color="text.secondary" sx={{ minWidth: 180 }}>
                        <strong>Team Limit:</strong> {tournament.teamLimit}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ minWidth: 180 }}>
                        <strong>Entry Fee:</strong> ₹{tournament.entryFee}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ minWidth: 180 }}>
                        <strong>Venue:</strong> {tournament.venue}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ minWidth: 180 }}>
                        <strong>Street:</strong> {tournament.street}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ minWidth: 180 }}>
                        <strong>City:</strong> {tournament.city}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ minWidth: 180 }}>
                        <strong>District:</strong> {tournament.district}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ minWidth: 180 }}>
                        <strong>State:</strong> {tournament.state}
                    </Typography>
                </Box>
            </Paper>
            {/* Teams Card Below */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, width: "100%", minHeight: 200 }}>
                <Typography variant="h6" fontWeight={700} color="text.secondary" mb={2}>
                    Teams
                </Typography>
                {tournament.teams && tournament.teams.length > 0 ? (
                    <Grid container spacing={2}>
                        {tournament.teams.map((team) => (
                            <Grid item xs={12} key={team.id}>
                                <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                                    <Typography variant="subtitle1" fontWeight={700} color="primary">
                                        {team.teamName}
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <ul style={{ marginLeft: 16, marginTop: 8 }}>
                                        {team.players.map((player, index) => (
                                            <li key={index} style={{ color: "#374151" }}>
                                                <strong>{player.name}</strong> - <span style={{ fontStyle: "italic" }}>{player.roles.join(", ")}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography color="text.secondary">No teams registered yet.</Typography>
                )}
            </Paper>
        </Box>
    );
}
