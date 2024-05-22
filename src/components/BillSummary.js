import React, { useEffect, useState } from 'react';
import './BillSummary.css'; // Import the BillSummary stylesheet

const BillSummary = () => {
    const [bills, setBills] = useState([]);
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const response = await fetch('/bills');
            if (response.ok) {
                const data = await response.json();
                setBills(data);
            } else {
                console.error('Failed to fetch bills');
            }
        } catch (error) {
            console.error('Error fetching bills:', error);
        }
    };

    const userBills = bills.filter(bill => bill.receiver === loggedInUserEmail || bill.biller === loggedInUserEmail);

    const unpaidOverdueBills = userBills.filter(bill => !bill.paid && new Date(bill.dueDate) < new Date());
    const upcomingUnpaidBills = userBills.filter(bill => !bill.paid && new Date(bill.dueDate) >= new Date());
    const paidBills = userBills.filter(bill => bill.paid);

    const totalAmountPaid = paidBills.reduce((sum, bill) => sum + bill.amount, 0);
    const totalAmountUnpaidOverdue = unpaidOverdueBills.reduce((sum, bill) => sum + bill.amount, 0);
    const totalAmountUnpaidUpcoming = upcomingUnpaidBills.reduce((sum, bill) => sum + bill.amount, 0);
    const totalAmountUnpaid = totalAmountUnpaidOverdue + totalAmountUnpaidUpcoming;

    return (
        <div className="bill-summary-container">
            <h2 className="summary-title">Bill Summary</h2>
            <div className="summary-counts">
                <div>
                    <p>Total Paid Bills</p>
                    <p>{paidBills.length}</p>
                    <p>Total Amount Paid: ₱{totalAmountPaid.toFixed(2)}</p>
                </div>
                <div>
                    <p>Overdue Unpaid Bills</p>
                    <p>{unpaidOverdueBills.length}</p>
                    <p>Total Amount Overdue: ₱{totalAmountUnpaidOverdue.toFixed(2)}</p>
                </div>
                <div>
                    <p>Upcoming Unpaid Bills</p>
                    <p>{upcomingUnpaidBills.length}</p>
                    <p>Total Amount Upcoming: ₱{totalAmountUnpaidUpcoming.toFixed(2)}</p>
                </div>
                <div>
                    <p>Total Amount Unpaid</p>
                    <p>₱{totalAmountUnpaid.toFixed(2)}</p>
                </div>
            </div>
            <table className="summary-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Receiver</th>
                        <th>Biller</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {userBills.map(bill => (
                        <tr key={bill._id}>
                            <td>{bill.category}</td>
                            <td>₱{bill.amount.toFixed(2)}</td>
                            <td>{bill.dueDate}</td>
                            <td>{bill.receiver}</td>
                            <td>{bill.biller}</td>
                            <td>{bill.paid ? 'Paid' : 'Unpaid'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BillSummary;
