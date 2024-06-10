import React, { useState, useEffect } from 'react';
import './BillSummary.css';

const BillSummary = () => {
    const [filterOptions, setFilterOptions] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [bills, setBills] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Define currentPage state
    const [itemsPerPage] = useState(10); // Define itemsPerPage state
    const [selectedUser, setSelectedUser] = useState(localStorage.getItem('loggedInUserEmail'));

    useEffect(() => {
        fetchFilterOptions();
        fetchBills();
    }, [currentPage, selectedFilter, selectedUser]); // Fetch filter options and bills when component mounts and when currentPage, selectedFilter, or selectedUser changes

    const fetchFilterOptions = async () => {
        try {
            const response = await fetch('/bills/unique-receivers');
            if (response.ok) {
                const data = await response.json();
                setFilterOptions(data);
            } else {
                console.error('Failed to fetch filter options');
            }
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    const fetchBills = async () => {
        try {
            const response = await fetch(`/bills/user/${encodeURIComponent(selectedUser)}?filter=${encodeURIComponent(selectedFilter)}&page=${currentPage}&limit=${itemsPerPage}`);
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

    // Calculate summary counts
    const userBills = bills.filter(bill => bill.receiver === selectedUser || bill.biller === selectedUser);

    // Add pagination functionality
    const indexOfLastBill = currentPage * itemsPerPage;
    const indexOfFirstBill = indexOfLastBill - itemsPerPage;
    const currentBills = userBills.slice(indexOfFirstBill, indexOfLastBill);

    // Calculate summary counts for current bills
    const unpaidOverdueBills = currentBills.filter(bill => !bill.paid && new Date(bill.dueDate) < new Date());
    const upcomingUnpaidBills = currentBills.filter(bill => !bill.paid && new Date(bill.dueDate) >= new Date());
    const paidBills = currentBills.filter(bill => bill.paid);
    const paidLateBills = userBills.filter(bill => bill.paid && new Date(bill.datePaid) > new Date(bill.dueDate));

    const totalAmountPaid = paidBills.reduce((sum, bill) => sum + bill.amount, 0);
    const totalAmountUnpaidOverdue = unpaidOverdueBills.reduce((sum, bill) => sum + bill.amount, 0);
    const totalAmountUnpaidUpcoming = upcomingUnpaidBills.reduce((sum, bill) => sum + bill.amount, 0);
    const totalAmountUnpaid = totalAmountUnpaidOverdue + totalAmountUnpaidUpcoming;
    const totalAmountPaidLate = paidLateBills.reduce((sum, bill) => sum + bill.amount, 0);

    return (
        <div className="bill-summary-container">
            {/* Filter dropdown */}
            <div className="filter-container">
                <label htmlFor="receiver-filter">Filter by Receiver:</label>
                <select
                    id="receiver-filter"
                    value={selectedFilter}
                    onChange={(e) => {
                        setSelectedFilter(e.target.value);
                        setCurrentPage(1); // Reset to the first page when filter changes
                    }}
                >
                    <option value="">All</option>
                    {filterOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {/* Display bill summary */}
            <h2 className="summary-title">Bill Summary</h2>

            {/* Summary counts */}
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
                <div>
                    <p>Total Amount Paid Late</p>
                    <p>₱{totalAmountPaidLate.toFixed(2)}</p>
                    <p>Total Paid Late Bills</p>
                    <p>{paidLateBills.length}</p>
                </div>
            </div>

            {/* Summary tables */}
            <div className="summary-table-container">
                <h3>Summary Table for Unpaid Overdue Bills</h3>
                <table className="summary-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Map through the categories and display the corresponding data */}
                        {unpaidOverdueBills.map(bill => (
                            <tr key={bill._id}>
                                <td>{bill.category}</td>
                                <td>₱{bill.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="summary-table-container">
                <h3>Summary Table for Upcoming Unpaid Bills</h3>
                <table className="summary-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Map through the categories and display the corresponding data */}
                        {upcomingUnpaidBills.map(bill => (
                            <tr key={bill._id}>
                                <td>{bill.category}</td>
                                <td>₱{bill.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Add similar tables for other categories if needed */}
            
            {/* Table to display bill summary */}
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
                    {currentBills.map(bill => (
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

            {/* Pagination */}
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentBills.length < itemsPerPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default BillSummary;
