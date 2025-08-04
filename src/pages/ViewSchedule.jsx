import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { schedulerApi } from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { getUser } from "../auth"; // Import getUser to check user role
import { Box } from "@mui/material";

export default function ViewSchedule() {
    const [schedule, setSchedule] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tournamentId = queryParams.get("tournamentId");
    const user = getUser(); // Get the logged-in user details

    const fetchSchedule = async () => {
        try {
            const res = await schedulerApi.get(`/schedule/${tournamentId}`);
            setSchedule(res.data);
            toast.success("Schedule fetched successfully!");
        } catch (err) {
            toast.error(err.response?.data || "Failed to fetch schedule");
        }
    };

    const handleDeleteSchedule = async () => {
        try {
            await schedulerApi.delete(`/schedule/delete/${tournamentId}`);
            toast.success("Schedule deleted successfully!");
            setSchedule([]); // Clear the schedule after deletion
        } catch (err) {
            toast.error(err.response?.data || "Failed to delete schedule");
        }
    };

    useEffect(() => {
        if (tournamentId) {
            fetchSchedule();
        }
    }, [tournamentId]);

    return (
        <Box sx={{ p: 6, minHeight: "100vh", background: "rgba(255,255,255,0.7)", borderRadius: 3 }}>
            <Toaster position="top-center" reverseOrder={false} />
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">View Schedule</h2>
            {tournamentId ? (
                schedule.length > 0 ? (
                    <div className="mt-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Schedule for Tournament ID: {tournamentId}</h3>
                        <ul className="space-y-4">
                            {schedule.map((match) => (
                                <li key={match.id} className="bg-gray-100 p-4 rounded shadow">
                                    <p>
                                        <span className="font-bold">Match:</span> {match.team1.teamName} vs{" "}
                                        {match.team2.teamName}
                                    </p>
                                    <p>
                                        <span className="font-bold">Date:</span>{" "}
                                        {new Date(match.dateTime).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                        {user?.role === "ADMIN" && (
                            <button
                                onClick={handleDeleteSchedule}
                                className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Delete Schedule
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-700 text-center">No schedule available for this tournament.</p>
                )
            ) : (
                <p className="text-gray-700 text-center">No tournament selected. Please go back and select a tournament.</p>
            )}
        </Box>
    );
}