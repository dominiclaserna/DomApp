import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './ReceiptList.css'; // Assuming you'll create a separate CSS file for ReceiptList
import ReceiptPDF from './ReceiptPdf'; // Import the ReceiptPDF component

const ReceiptList = () => {
    const [receipts, setReceipts] = useState([]);
    const [userType, setUserType] = useState('');
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
            fetchReceipts();
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

    const fetchReceipts = async () => {
        try {
            const response = await fetch(`/bills/user/${encodeURIComponent(loggedInUserEmail)}?filter=${encodeURIComponent(selectedFilter)}&page=${currentPage}&limit=${itemsPerPage}`);
            if (response.ok) {
                const data = await response.json();
                const paidReceipts = data.filter(receipt => receipt.paid === true); // Filter only paid receipts
                setReceipts(paidReceipts);
            } else {
                console.error('Failed to fetch receipts');
            }
        } catch (error) {
            console.error('Error fetching receipts:', error);
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

    const handleMarkAsUnpaid = async (receiptId) => {
        try {
            const response = await fetch(`/receipts/${receiptId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paid: false })
            });

            if (response.ok) {
                console.log('Receipt marked as unpaid successfully');
                toast.success('Receipt marked as unpaid successfully');
                fetchReceipts();
            } else {
                console.error('Failed to mark receipt as unpaid');
                toast.error('Failed to mark receipt as unpaid');
            }
        } catch (error) {
            console.error('Error marking receipt as unpaid:', error);
            toast.error('Error marking receipt as unpaid');
        }
    };

    const renderReceiptRow = (receipt) => (
        <tr key={receipt._id}>
            <td>{receipt.category}</td>
            <td>{receipt.amount}</td>
            <td>{receipt.receiver}</td>
            <td>{receipt.biller}</td>
            <td>{receipt.datePaid || 'N/A'}</td>
            <td>
                {userType === 'manager' ? (
                    <>
                        {receipt.paymentRefNumber || 'N/A'}<br />
                        {receipt.modeOfPayment || 'N/A'}<br/>
                    </>
                ) : (
                    <>
                       
                    </>
                )}
                {/* Render PDF download link for each receipt */}
                <ReceiptPDF receiptData={receipt} />
            </td>
        </tr>
    );

    const handleCreateReceiptClick = () => {
        navigate('/create-receipt'); // Navigate to the create receipt route
    };

    if (!isLoggedIn) {
        return (
            <div className="login-message">
                <h3>Please log in to view your receipts.</h3>
            </div>
        );
    }

    return (
        <div className="receipt-list-container">
            <ToastContainer />

            
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
            
            <h2>Paid Receipts</h2>
            <table className="receipt-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Receiver</th>
                        <th>Biller</th>
                        <th>Date Paid</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {receipts.map(renderReceiptRow)}
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
                    disabled={receipts.length < itemsPerPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ReceiptList;
