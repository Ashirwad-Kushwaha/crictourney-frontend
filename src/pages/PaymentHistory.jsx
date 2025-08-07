import React, { useEffect, useState } from "react";
import { teamApi } from "../services/api";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress } from "@mui/material";

export default function PaymentHistory() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        teamApi.get(`/teams/payments/history`)
            .then(res => setPayments(res.data))
            .catch(() => setPayments([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight={700} mb={3} color="primary">
                Payment History
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : payments.length === 0 ? (
                <Typography>No payment history found.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Team ID</TableCell>
                                <TableCell>Tournament ID</TableCell>
                                <TableCell>Payment ID</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Currency</TableCell>
                                <TableCell>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>{payment.teamId}</TableCell>
                                    <TableCell>{payment.tournamentId}</TableCell>
                                    <TableCell>{payment.paymentId}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={payment.status}
                                            color={payment.status === "SUCCESS" ? "success" : payment.status === "FAILED" ? "error" : "warning"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>₹{payment.amount}</TableCell>
                                    <TableCell>{payment.currency}</TableCell>
                                    <TableCell>{payment.createdAt ? new Date(payment.createdAt).toLocaleString() : ""}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
