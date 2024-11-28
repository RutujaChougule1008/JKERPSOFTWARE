import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import SaleBillSummary from './SaleBillSummary';

const GStUtilities = () => {
    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const AccountYear = sessionStorage.getItem('Accounting_Year');
    const Year_Code = sessionStorage.getItem('Year_Code');
    const Company_Code = sessionStorage.getItem('Company_Code');

    useEffect(() => {
        if (AccountYear) {
            const dates = AccountYear.split(' - ');
            if (dates.length === 2) {
                setFromDate(dates[0]);
                setToDate(dates[1]);
            }
        }
    }, [AccountYear]);

    return (
        <div className="container" style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <h1 className="mb-2">GST Utilities</h1>

            <div className="mb-3">
                <label htmlFor="fromDate" className="form-label">From Date</label>
                <input
                    type="date"
                    id="fromDate"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="toDate" className="form-label">To Date</label>
                <input
                    type="date"
                    id="toDate"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <SaleBillSummary
                    fromDate={fromDate}
                    toDate={toDate}
                    companyCode={Company_Code}
                    yearCode={Year_Code}
                />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export default GStUtilities;