import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome, {user.name}!</h1>
                <p>Together we can make a difference</p>
            </header>

            <section className="quick-actions">
                <div className="action-card">
                    <h3>Orphanages</h3>
                    <p>View and support orphanages</p>
                    <button onClick={() => navigate("/orphanages")}>
                        Explore Orphanages
                    </button>
                </div>

                <div className="action-card">
                    <h3>Old Age Homes</h3>
                    <p>View and support old age homes</p>
                    <button onClick={() => navigate("/oldagehomes")}>
                        Explore Old Age Homes
                    </button>
                </div>
            </section>

            <section className="hero-section">
                <div className="hero-content">
                    <h1>Making a Difference Together</h1>
                    <p>
                        Join us in supporting orphanages and old age homes through
                        meaningful donations
                    </p>
                    <Link to="/about" className="learn-more">Learn More</Link>
                </div>
            </section>

            <section className="donation-categories">
                <h2 className="section-title">Ways to Help</h2>
                <div className="category-grid">
                    {/* First card - Making a Difference Together */}
                    <div className="category-card" style={{ "--index": "0" }}>
                        <div className="category-image">
                            <img src="/images/donate.png" alt="Making a Difference" />
                            <div className="content-overlay">
                                <h3>Making a Difference Together</h3>
                                <p>
                                    Join us in creating positive change through your
                                    generous support
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Second card - Money Donation */}
                    <div className="category-card" style={{ "--index": "1" }}>
                        <div className="category-image">
                            <img src="/images/money.jpg" alt="Money Donation" />
                            <div className="content-overlay">
                                <h3>Money Donation</h3>
                                <p>
                                    Support through financial contributions for essential
                                    needs
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Third card - Food Donation */}
                    <div className="category-card" style={{ "--index": "2" }}>
                        <div className="category-image">
                            <img src="/images/donat3.jpg" alt="Food Donation" />
                            <div className="content-overlay">
                                <h3>Food Donation</h3>
                                <p>
                                    Provide nutritious meals and groceries to ensure no one
                                    goes hungry
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Fourth card - Clothes Donation */}
                    <div className="category-card" style={{ "--index": "3" }}>
                        <div className="category-image">
                            <img src="/images/clothesd.jpg" alt="Clothes Donation" />
                            <div className="content-overlay">
                                <h3>Clothes Donation</h3>
                                <p>
                                    Share warmth and dignity through clothing donations
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Fifth card - Books Donation */}
                    <div className="category-card" style={{ "--index": "4" }}>
                        <div className="category-image">
                            <img src="/images/booksdon.webp" alt="Books Donation" />
                            <div className="content-overlay">
                                <h3>Books Donation</h3>
                                <p>
                                    Enable education and learning through book donations
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sixth card - Health Donation */}
                    <div className="category-card" style={{ "--index": "5" }}>
                        <div className="category-image">
                            <img src="/images/health.jpg" alt="Health Donation" />
                            <div className="content-overlay">
                                <h3>Health Donation</h3>
                                <p>
                                    Support medical needs and healthcare essentials
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Seventh card - Volunteer */}
                    <div className="category-card" style={{ "--index": "6" }}>
                        <div className="category-image">
                            <img src="/images/maini.jpg" alt="Volunteer" />
                            <div className="content-overlay">
                                <h3>Volunteer</h3>
                                <p>
                                    Join our team of dedicated volunteers and make a direct
                                    impact
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;