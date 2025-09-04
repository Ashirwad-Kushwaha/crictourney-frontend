import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {schedulerApi} from "../services/api";
import toast from "react-hot-toast";

export default function CreateSchedule() {
    const [searchParams] = useSearchParams();
    const [tournamentId, setTournamentId] = useState("");
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        const paramTournamentId = searchParams.get("tournamentId");
        if (paramTournamentId) {
            setTournamentId(paramTournamentId);
        }
    }, [searchParams]);

    const handleCreateSchedule = async () => {
        try {
            const res = await schedulerApi.post(`/schedule/${tournamentId}`);
            setSchedule(res.data);
            toast.success("Schedule created successfully!");
        } catch (err) {
            toast.error(err.response?.data || "Failed to create schedule");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Create Schedule</h2>
            <div className="bg-white p-6 shadow rounded">
                <label htmlFor="tournamentId" className="block text-gray-700 font-bold mb-2">Tournament ID</label>
                <input
                    id="tournamentId"
                    type="number"
                    value={tournamentId}
                    onChange={(e) => setTournamentId(e.target.value)}
                    className="border p-2 rounded w-full mb-4"
                    placeholder="Enter Tournament ID"
                />
                <button
                    onClick={handleCreateSchedule}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create Schedule
                </button>
            </div>
            {schedule.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Generated Schedule</h3>
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
                </div>
            )}
        </div>
    );
}