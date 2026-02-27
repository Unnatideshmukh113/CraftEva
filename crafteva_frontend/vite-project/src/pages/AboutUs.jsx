import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-page">
            <div className="about-hero">
                <div className="about-content">
                    <h1>Welcome to CraftEVA</h1>
                    <p className="tagline"><b><i>"Every Valueable Art"</i></b></p>
                </div>
            </div>

            <div className="about-container">
                <section className="mission-section">
                    <h2>Our Mission</h2>
                    <p>
                        At CraftEVA, we believe in the power of human hands and creative minds.
                        Our mission is to empower artisans from every corner of the country by providing
                        them a platform to showcase their unique, handcrafted creations to the world.
                    </p>
                </section>

                <section className="values-grid">
                    <div className="value-card">
                        <h3>Authenticity</h3>
                        <p>Every product tells a story. We ensure that every item listed is genuinely handmade and authentic.</p>
                    </div>
                    <div className="value-card">
                        <h3>Community</h3>
                        <p>We are more than a marketplace; we are a community of creators and appreciators of art.</p>
                    </div>
                    <div className="value-card">
                        <h3>Sustainability</h3>
                        <p>Handicrafts are naturally sustainable. We promote eco-friendly practices and traditional crafting methods.</p>
                    </div>
                </section>

                <section className="vision-section">
                    <h2>Our Vision</h2>
                    <p>
                        To revive dying art forms and create a sustainable ecosystem where artisans can thrive
                        and art lovers can find pieces that resonate with their soul.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;
