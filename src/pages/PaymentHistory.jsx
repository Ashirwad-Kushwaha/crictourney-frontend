import React, { useEffect, useState } from "react";
import { teamApi } from "../services/api";
import toast from "react-hot-toast";

export default function PaymentHistory() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await teamApi.get("/teams/payments/history");
            setPayments(res.data);
        } catch (err) {
            console.error("Error fetching payment history:", err);
            toast.error("Failed to fetch payment history");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'success':
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-blue-800">Loading payment history...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-blue-800 mb-2">Payment History</h1>
                    <p className="text-gray-600">Track all your tournament registration payments</p>
                </div>

                {payments.length === 0 ? (
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-blue-100 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-4">No payment history found</h3>
                        <p className="text-gray-500">Your tournament registration payments will appear here</p>
                    </div>
                ) : (
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                            <h2 className="text-xl font-bold text-white">Transaction History</h2>
                            <p className="text-blue-100">Total Transactions: {payments.length}</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-blue-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">Transaction ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">Team Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">Tournament</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">Amount</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {payments.map((payment, index) => (
                                        <tr key={payment.id || index} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {payment.transactionId || payment.paymentId || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Order: {payment.orderId || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {payment.teamName || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {payment.tournamentName || `Tournament ${payment.tournamentId}` || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-green-600">
                                                    ₹{payment.amount || payment.fee || 0}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                                                    {payment.status || 'Completed'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {payment.createdAt ? formatDate(payment.createdAt) : 
                                                     payment.date ? formatDate(payment.date) : 'N/A'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary */}
                        <div className="bg-gray-50 p-6 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        ₹{payments.reduce((sum, p) => sum + (p.amount || p.fee || 0), 0)}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Spent</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {payments.filter(p => (p.status || 'completed').toLowerCase() === 'completed' || (p.status || 'completed').toLowerCase() === 'success').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Successful Payments</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {payments.length}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Transactions</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}