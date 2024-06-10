import React, { useState } from 'react';
import { toast } from 'react-toastify'; // Import toast
import { useNavigate } from 'react-router-dom';
import './BillForm.css';

const BillForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        dueDate: '',
        amount: '',
        receiver: '',
        biller: '',
        paymentRefNumber: '',
        category: '', // Include category in the initial state
        paymentProof: null, // Initialize paymentProof as null
        datePaid: null, // Initialize datePaid as null
        modeOfPayment: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/create-bill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                toast.success('Bill created successfully!'); // Display success notification
                navigate('/bills');
            } else {
                toast.error('Failed to create bill!'); // Display error notification
            }
        } catch (error) {
            console.error('Server error:', error);
        }
    };

    return (
        <div className="bill-form-container">
            <h2>Create Bill</h2>
            <form onSubmit={handleSubmit} className="bill-form">
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} placeholder="Due Date" required />
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" required />
                <input type="text" name="receiver" value={formData.receiver} onChange={handleChange} placeholder="Receiver" required />
                <input type="text" name="biller" value={formData.biller} onChange={handleChange} placeholder="Biller" required />
               
                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category and month" required /> {/* Add category input field */}
                <button type="submit">Create Bill</button>
            </form>
        </div>
    );
};

export default BillForm;
