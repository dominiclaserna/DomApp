import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './BillList.css';

const BillList = () => {
    const [bills, setBills] = useState([]);
    const [userType, setUserType] = useState('');
    const [paymentDetails, setPaymentDetails] = useState({ modeOfPayment: '' });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [filterOptions, setFilterOptions] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    const navigate = useNavigate(); // Initialize navigate function

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
    const handleMarkAsUnpaid = async (billId) => {
        try {
            const response = await fetch(`/bills/${billId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paid: false })
            });
    
            if (response.ok) {
                console.log('Bill marked as unpaid successfully');
                toast.success('Bill marked as unpaid successfully');
                fetchBills();
            } else {
                console.error('Failed to mark bill as unpaid');
                toast.error('Failed to mark bill as unpaid');
            }
        } catch (error) {
            console.error('Error marking bill as unpaid:', error);
            toast.error('Error marking bill as unpaid');
        }
    };
    

    const handlePayBill = async (billId) => {
        const { paymentRefNumber, modeOfPayment } = paymentDetails[billId] || {};
        console.log('Payment Details:', { paymentRefNumber, modeOfPayment });
        try {
            const response = await fetch(`/bills/${billId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentRefNumber, modeOfPayment, datePaid: new Date(), paid: true })
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

    const handlePaymentDetailChange = (billId, field, value) => {
        setPaymentDetails((prev) => ({
            ...prev,
            [billId]: {
                ...prev[billId],
                [field]: value
            }
        }));
    };

    const renderBillRow = (bill) => (
        <tr key={bill._id}>
            <td>{bill.category}</td>
            <td>{bill.amount}</td>
            <td>{bill.dueDate}</td>
            <td>{bill.receiver}</td>
            <td>{bill.biller}</td>
            <td>{bill.datePaid || 'N/A'}</td>
            <td>
                {userType === 'manager' ? (
                    <>
                        {bill.paymentRefNumber || 'N/A'}<br />
                        {bill.modeOfPayment || 'N/A'}<br/>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Payment Reference Number"
                            value={paymentDetails[bill._id]?.paymentRefNumber || ''}
                            onChange={(e) => handlePaymentDetailChange(bill._id, 'paymentRefNumber', e.target.value)}
                        /><br />
                        <select
                            value={paymentDetails[bill._id]?.modeOfPayment || ''}
                            onChange={(e) => handlePaymentDetailChange(bill._id, 'modeOfPayment', e.target.value)}
                        >
                            <option value="">Select Mode of Payment</option>
                            <option value="GCash">GCash</option>
                            <option value="PayMaya">PayMaya</option>
                        </select><br />
                        <button onClick={() => handlePayBill(bill._id)}>Submit Payment</button>
                    </>
                )}
            </td>
            {userType === 'manager' && <td>{bill.paid ? 'Paid' : <button onClick={() => handleMarkAsPaid(bill._id)}>Mark as Paid</button>}</td>}
            {userType === 'manager' && (
    <td>
        {bill.paid ? (
            <button onClick={() => handleMarkAsUnpaid(bill._id)}>Cancel Payment</button>
        ) : (
            'Unpaid'
        )}
    </td>
)}

        </tr>
    );

    const handleCreateBillClick = () => {
        navigate('/create-bill'); // Navigate to the create bill route
    };

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
                <div className="fixed-create-bill-button">
                    <button className="create-bill-button" onClick={handleCreateBillClick}>Create Bill</button>
                </div>
            )}
            {userType === 'tenant' && (
                <div className="fixed-payment-info">
<p>
    <strong>Pay to:</strong>{' '}
    <span>
        <strong>[GCash: 09157015668] </strong>
    </span>{' '}
    <span>
        <strong>[Paymaya: 09157015668]</strong>
    </span>
</p>

                </div>
            )}
            
            {userType === 'manager' && (
                <div className="filter-container">
                    <label htmlFor="receiver-filter">Filter by Receiver:</label>
                    <select
                        id="receiver-filter"
                        value={selectedFilter}
                        onChange={(e) => {
                            console.log('Selected filter:', e.target.value);
                            setSelectedFilter(e.target.value);
                            setCurrentPage(1);
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
                        <th>Date Paid</th>
                        <th>Payment Details</th>
                        {userType === 'manager' && <th>Action</th>}
                        {userType === 'manager' && <th>Status</th>}
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
                        <th>Date Paid</th>
                        <th>Payment Details</th>
                        {userType === 'manager' && <th>Action</th>}
                        {userType === 'manager' && <th>Status</th>}
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
                        <th>Date Paid</th>
                        <th>Payment Details</th>
                        {userType === 'manager' && <th>Action</th>}
                        {userType === 'manager' && <th>Status</th>}
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
