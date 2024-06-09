import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './BillList.css';

const BillList = () => {
    const [bills, setBills] = useState([]);
    const [userType, setUserType] = useState('');
    const [paymentRefNumbers, setPaymentRefNumbers] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [filterOptions, setFilterOptions] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');

    useEffect(() => {
        checkLoginStatus();
        if (loggedInUserEmail) {
            fetchBills();
            fetchUserType();
        }
    }, [currentPage, selectedFilter]);

    useEffect(() => {
        if (userType) {
            fetchFilterOptions();
        }
    }, [userType]);

    const checkLoginStatus = () => {
        const loggedIn = !!loggedInUserEmail;
        setIsLoggedIn(loggedIn);
    };

    const fetchBills = async () => {
        try {
            const response = await fetch(`/bills/user/${encodeURIComponent(loggedInUserEmail)}?filter=${encodeURIComponent(selectedFilter)}&page=${currentPage}&limit=${itemsPerPage}`);
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

    const fetchUserType = async () => {
        try {
            const response = await fetch(`/user-details/${encodeURIComponent(loggedInUserEmail)}`);
            if (response.ok) {
                const userData = await response.json();
                setUserType(userData.userType);
            } else {
                console.error('Failed to fetch user type');
            }
        } catch (error) {
            console.error('Error fetching user type:', error);
        }
    };

    const fetchFilterOptions = async () => {
        try {
            const response = await fetch('/bills/unique-receivers');
            if (response.ok) {
                const data = await response.json();
                console.log('Filter options:', data);
                setFilterOptions(data);
            } else {
                throw new Error('Failed to fetch filter options');
            }
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };
    
    

    const currentDate = new Date();

    const unpaidOverdueBills = bills.filter((bill) => !bill.paid && new Date(bill.dueDate) < currentDate);
    const upcomingUnpaidBills = bills.filter((bill) => !bill.paid && new Date(bill.dueDate) >= currentDate);
    const paidBills = bills.filter((bill) => bill.paid);

    const handleMarkAsPaid = async (billId) => {
        try {
            const response = await fetch(`/bills/${billId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paid: true })
            });

            if (response.ok) {
                console.log('Bill marked as paid successfully');
                toast.success('Bill marked as paid successfully');
                fetchBills();
            } else {
                console.error('Failed to mark bill as paid');
                toast.error('Failed to mark bill as paid');
            }
        } catch (error) {
            console.error('Error marking bill as paid:', error);
            toast.error('Error marking bill as paid');
        }
    };

    const handlePayBill = async (billId) => {
        const paymentRefNumber = paymentRefNumbers[billId];
        console.log('Payment Reference Number:', paymentRefNumber);
        try {
            const response = await fetch(`/bills/${billId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentRefNumber })
            });

            if (response.ok) {
                console.log('Bill payment submitted successfully');
                toast.success('Bill payment submitted successfully');
                fetchBills();
            } else {
                console.error('Failed to update bill payment');
                toast.error('Failed to update bill payment');
            }
        } catch (error) {
            console.error('Error updating bill payment:', error);
            toast.error('Error updating bill payment');
        }
    };

    const handlePaymentRefNumberChange = (billId, value) => {
        setPaymentRefNumbers((prev) => ({ ...prev, [billId]: value }));
    };

    const renderBillRow = (bill) => (
        <tr key={bill._id}>
            <td>{bill.category}</td>
            <td>{bill.amount}</td>
            <td>{bill.dueDate}</td>
            <td>{bill.receiver}</td>
            <td>{bill.biller}</td>
            <td>
                {userType === 'manager' ? (
                    bill.paymentRefNumber || 'N/A'
                ) : (
                    <>
                        <input
                            type="text"
                            value={paymentRefNumbers[bill._id] || ''}
                            onChange={(e) => handlePaymentRefNumberChange(bill._id, e.target.value)}
                        />
                        <button onClick={() => handlePayBill(bill._id)}>Submit Payment</button>
                    </>
                )}
            </td>
            {userType === 'manager' && <td><button onClick={() => handleMarkAsPaid(bill._id)}>Mark as Paid</button></td>}
        </tr>
    );

    if (!isLoggedIn) {
        return (
            <div className="login-message">
                <h3>Please log in to view your bills.</h3>
            </div>
        );
    }

    return (
        <div className="bill-list-container">
            <ToastContainer />
            {userType === 'manager' && (
                <div className="filter-container">
                    <label htmlFor="receiver-filter">Filter by Receiver:</label>
                    <select
    id="receiver-filter"
    value={selectedFilter}
    onChange={(e) => {
        console.log('Selected filter:', e.target.value); // Log selected filter
        setSelectedFilter(e.target.value); // Update selected filter state
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
            )}
            <h2>Unpaid and Overdue Bills</h2>
            <table className="bill-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Receiver</th>
                        <th>Biller</th>
                        <th>Payment Ref Number</th>
                        {userType === 'manager' && <th>Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {unpaidOverdueBills.map(renderBillRow)}
                </tbody>
            </table>

            <h2>Upcoming Unpaid Bills</h2>
            <table className="bill-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Receiver</th>
                        <th>Biller</th>
                        <th>Payment Ref Number</th>
                        {userType === 'manager' && <th>Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {upcomingUnpaidBills.map(renderBillRow)}
                </tbody>
            </table>

            <h2>Paid Bills</h2>
            <table className="bill-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Receiver</th>
                        <th>Biller</th>
                        <th>Payment Ref Number</th>
                    </tr>
                </thead>
                <tbody>
                    {paidBills.map(renderBillRow)}
                </tbody>
            </table>

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
                    disabled={bills.length < itemsPerPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default BillList;
