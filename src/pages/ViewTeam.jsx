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
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight={700} mb={2} color="primary">
                {team.teamName}
            </Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1">Tournament ID: {team.tournamentId}</Typography>
                <Typography variant="subtitle1">Created By: {team.createdBy}</Typography>
            </Paper>
            <Typography variant="h6" mb={1}>Players</Typography>
            <List>
                {players.map((player, idx) => (
                    <ListItem key={player.id || idx}>
                        <ListItemText
                            primary={player.name}
                            secondary={player.roles && player.roles.length > 0 ? player.roles.join(", ") : ""}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
