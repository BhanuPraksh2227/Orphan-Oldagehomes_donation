import React, { useEffect, useRef } from 'react';
import { FaMoneyBillWave, FaUtensils, FaTshirt, FaBook, FaMedkit } from 'react-icons/fa';
import '../styles/about.css';

const AboutPage = () => {
    const cardsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        cardsRef.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="about-container">
            <div className="cards-container">
                <div className="about-card" ref={(el) => (cardsRef.current[0] = el)}>
                    <div className="card-icon">
                        <FaMoneyBillWave />
                    </div>
                    <h2 className="card-title">Online Money Donation</h2>
                    <p className="card-text">
                        Make a difference from anywhere, at any time. Our secure online donation platform ensures your contributions reach those in need efficiently. Your financial support helps provide:
                        <ul className="feature-list">
                            <li>Essential daily needs and nutrition</li>
                            <li>Educational resources and scholarships</li>
                            <li>Healthcare and medical support</li>
                            <li>Infrastructure improvements</li>
                            <li>Recreational activities and development programs</li>
                        </ul>
                        Every contribution, big or small, creates lasting impact in the lives of orphans and elderly.
                    </p>
                </div>

                <div className="about-card" ref={(el) => (cardsRef.current[1] = el)}>
                    <div className="card-icon">
                        <FaUtensils />
                    </div>
                    <h2 className="card-title">Food Donation</h2>
                    <p className="card-text">
                        Help reduce food waste while feeding those in need. Perfect for:
                        <ul className="feature-list">
                            <li>Restaurants with surplus prepared meals</li>
                            <li>Bakeries with end-of-day fresh items</li>
                            <li>Grocery stores with approaching expiry items</li>
                            <li>Catering services with extra food</li>
                            <li>Hotels and food businesses</li>
                        </ul>
                        We ensure proper food handling and quick distribution to maintain freshness and safety.
                    </p>
                </div>

                <div className="about-card" ref={(el) => (cardsRef.current[2] = el)}>
                    <div className="card-icon">
                        <FaTshirt />
                    </div>
                    <h2 className="card-title">Clothes Donation</h2>
                    <p className="card-text">
                        Your clothing donations bring warmth and dignity. We accept:
                        <ul className="feature-list">
                            <li>New and gently used clothing of all sizes</li>
                            <li>Season-appropriate wear</li>
                            <li>School uniforms and sports wear</li>
                            <li>Shoes and accessories</li>
                            <li>Blankets and bedding</li>
                        </ul>
                        All donations are cleaned and sorted before distribution to ensure dignity in giving.
                    </p>
                </div>

                <div className="about-card" ref={(el) => (cardsRef.current[3] = el)}>
                    <div className="card-icon">
                        <FaBook />
                    </div>
                    <h2 className="card-title">Books Donation</h2>
                    <p className="card-text">
                        Support education and inspire young minds. We welcome:
                        <ul className="feature-list">
                            <li>Academic textbooks and study materials</li>
                            <li>Children's books and story books</li>
                            <li>Educational magazines and journals</li>
                            <li>Reference books and encyclopedias</li>
                            <li>Art and craft books</li>
                        </ul>
                        Your book donations help create well-stocked libraries and support educational growth.
                    </p>
                </div>

                <div className="about-card" ref={(el) => (cardsRef.current[4] = el)}>
                    <div className="card-icon">
                        <FaMedkit />
                    </div>
                    <h2 className="card-title">Health Essentials</h2>
                    <p className="card-text">
                        Contribute to health and wellness. Essential items include:
                        <ul className="feature-list">
                            <li>First-aid supplies and basic medications</li>
                            <li>Personal hygiene products</li>
                            <li>Vitamins and supplements</li>
                            <li>Medical equipment and supplies</li>
                            <li>Sanitization and cleaning materials</li>
                        </ul>
                        Help maintain good health and proper hygiene for those in our care.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;