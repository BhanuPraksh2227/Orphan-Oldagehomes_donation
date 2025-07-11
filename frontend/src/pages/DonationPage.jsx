import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MoneyDonationForm from '../components/donations/MoneyDonationForm';
import FoodDonationForm from '../components/donations/FoodDonationForm';
import ClothesDonationForm from '../components/donations/ClothesDonationForm';
import BooksDonationForm from '../components/donations/BooksDonationForm';
import HealthDonationForm from '../components/donations/HealthDonationForm';
import api from '../services/api';
import '../styles/donation.css';

const DonationPage = () => {
    const { type } = useParams();
    const [alert, setAlert] = useState(null);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/facilities').then(res => {
            setFacilities(res.data);
            setLoading(false);
        });
    }, []);

    const formProps = {
        setAlert,
        facilities,
        loading
    };

    // Single form rendering based on type
    const renderDonationForm = () => {
        switch(type) {
            case 'money':
                return <MoneyDonationForm {...formProps} />;
            case 'food':
                return <FoodDonationForm {...formProps} />;
            case 'clothes':
                return <ClothesDonationForm {...formProps} />;
            case 'books':
                return <BooksDonationForm {...formProps} />;
            case 'health':
                return <HealthDonationForm {...formProps} />;
            default:
                return <div>Invalid donation type</div>;
        }
    };

    return (
        <div className="donation-page">
            {alert && (
                <div className={`alert alert-${alert.type}`}>
                    {alert.message}
                </div>
            )}
            {renderDonationForm()}
        </div>
    );
};

export default DonationPage;