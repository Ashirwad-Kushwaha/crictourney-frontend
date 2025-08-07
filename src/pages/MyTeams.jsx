import React, { useEffect, useState } from "react";
import { teamApi } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from "@mui/material";

export default function MyTeams() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        teamApi.get("/teams/my")
            .then(res => setTeams(res.data))
            .catch(() => setTeams([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight={700} mb={3} color="primary">
                My Teams
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : teams.length === 0 ? (
                <Typography>No teams found.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Team Name</TableCell>
                                <TableCell>Tournament ID</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teams.map((team) => (
                                <TableRow key={team.id}>
                                    <TableCell>{team.teamName}</TableCell>
                                    <TableCell>{team.tournamentId}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => navigate(`/my-team/${team.id}`)}
                                            sx={{ mr: 1 }}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => navigate(`/edit-team/${team.id}`)}
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
