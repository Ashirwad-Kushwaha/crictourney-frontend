import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { teamApi } from "../services/api";
import { Box, Typography, Paper, List, ListItem, ListItemText, CircularProgress } from "@mui/material";

export default function ViewTeam() {
    const { teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        teamApi.get(`/teams/${teamId}`)
            .then(res => setTeam(res.data))
            .catch(() => setTeam(null));
        teamApi.get(`/teams/${teamId}/players`)
            .then(res => setPlayers(res.data))
            .catch(() => setPlayers([]))
            .finally(() => setLoading(false));
    }, [teamId]);

    if (loading) return <CircularProgress sx={{ m: 4 }} />;
    if (!team) return <Typography sx={{ m: 4 }}>Team not found.</Typography>;

    return (
        <Box sx={{ p: 2, minHeight: '100vh', bgcolor: 'rgba(243,244,246,0.7)' }}>
            <Typography variant="h6" fontWeight={600} mb={1.5} color="primary" sx={{ fontSize: '1.2rem' }}>
                {team.teamName}
            </Typography>
            <Paper sx={{ p: 1.5, mb: 2, borderRadius: 2, background: 'rgba(255,255,255,0.7)', boxShadow: 2 }}>
                <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>Tournament ID: {team.tournamentId}</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>Created By: {team.createdBy}</Typography>
            </Paper>
            <Typography variant="subtitle2" mb={0.5} sx={{ fontWeight: 600, fontSize: '1rem' }}>Players</Typography>
            <Paper sx={{ p: 1, borderRadius: 2, background: 'rgba(255,255,255,0.6)', boxShadow: 1, maxHeight: 320, overflowY: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {players.map((player, idx) => (
                        <Paper key={player.id || idx} sx={{ width: '100%', m: 0.5, p: 1, borderRadius: 1.5, background: 'rgba(255,255,255,0.85)', boxShadow: 0 }}>
                            <Typography variant="subtitle2" fontWeight={600} color="primary" sx={{ fontSize: '1rem' }}>
                                {player.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                Roles: {player.roles && player.roles.length > 0 ? player.roles.join(", ") : "-"}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
}
