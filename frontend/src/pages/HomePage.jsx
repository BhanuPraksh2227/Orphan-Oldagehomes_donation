import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";

const actionCardColors = [
  "linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)", // Orphanages - yellow/orange
  "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)", // Old Age Homes - teal/blue
];

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
        <div className="home-container animated-bg">
            <header className="home-header animated-fadein">
                <h1>
                  <span className="gradient-text">Welcome, {user.name}!</span>
                </h1>
                <p>Together we can make a difference</p>
            </header>

            <section className="quick-actions">
                <div
                  className="action-card animated-slidein"
                  style={{ background: actionCardColors[0], animationDelay: "0.1s" }}
                >
                    <h3>Orphanages</h3>
                    <p>View and support orphanages</p>
                    <button onClick={() => navigate("/orphanages")}>
                        Explore Orphanages
                    </button>
                </div>

                <div
                  className="action-card animated-slidein"
                  style={{ background: actionCardColors[1], animationDelay: "0.2s" }}
                >
                    <h3>Old Age Homes</h3>
                    <p>View and support old age homes</p>
                    <button onClick={() => navigate("/oldagehomes")}>
                        Explore Old Age Homes
                    </button>
                </div>
            </section>

            <section className="hero-section animated-zoom">
                <div className="hero-content">
                    <h1 className="rainbow-text">Making a Difference Together</h1>
                    <p>
                        Join us in supporting orphanages and old age homes through
                        meaningful donations
                    </p>
                    <Link to="/about" className="learn-more fancy-btn">Learn More</Link>
                </div>
            </section>

            <section className="donation-categories">
                <h2 className="section-title animated-fadein">Ways to Help</h2>
                <div className="category-grid">
                    {[
                        {
                            img: "/images/donate.png",
                            title: "Making a Difference Together",
                            desc: "Join us in creating positive change through your generous support",
                            color: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)"
                        },
                        {
                            img: "/images/money.jpg",
                            title: "Money Donation",
                            desc: "Support through financial contributions for essential needs",
                            color: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)"
                        },
                        {
                            img: "/images/donat3.jpg",
                            title: "Food Donation",
                            desc: "Provide nutritious meals and groceries to ensure no one goes hungry",
                            color: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)"
                        },
                        {
                            img: "/images/clothesd.jpg",
                            title: "Clothes Donation",
                            desc: "Share warmth and dignity through clothing donations",
                            color: "linear-gradient(135deg, #00c3ff 0%, #ffff1c 100%)"
                        },
                        {
                            img: "/images/booksdon.webp",
                            title: "Books Donation",
                            desc: "Enable education and learning through book donations",
                            color: "linear-gradient(135deg, #fc00ff 0%, #00dbde 100%)"
                        },
                        {
                            img: "/images/health.jpg",
                            title: "Health Donation",
                            desc: "Support medical needs and healthcare essentials",
                            color: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                        },
                        {
                            img: "/images/maini.jpg",
                            title: "Volunteer",
                            desc: "Join our team of dedicated volunteers and make a direct impact",
                            color: "linear-gradient(135deg, #f953c6 0%, #b91d73 100%)"
                        }
                    ].map((cat, idx) => (
                        <div
                          className="category-card animated-pop"
                          key={cat.title}
                          style={{
                            "--index": idx,
                            background: cat.color,
                            animationDelay: `${0.2 + idx * 0.1}s`
                          }}
                        >
                            <div className="category-image">
                                <img src={cat.img} alt={cat.title} />
                                <div className="content-overlay">
                                    <h3>{cat.title}</h3>
                                    <p>{cat.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;