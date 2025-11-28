import React from "react";
import "./LandingPage.css";

const cardData = [
  {
    title: "Arts faculty, DU",
    img: "/landingpage/ArtsFac.png",
    text: "Free Open book library set up at Arts Faculty, Delhi University."
  },
  {
    title: "Gandhi Nagar",
    img: "/landingpage/GandhiNagar.png",
    text: "Our vibrant library in Gandhi Nagar serving the local community."
  },
  {
    title: "Campus Drives",
    img: "/landingpage/DRC-DU.png",
    text: "BHC India in Daulat Ram College, Delhi University."
  }
];

const LandingPage = () => {
  return (
    <div className="main-landing">
      <section className="hero-section">
        <div className="hero-left">
          <h1 className="campaign-title">BOOK IN HAND CAMPAIGN</h1>
          <div className="campaign-info">
            <div className="info-block">
              <h3> Empowering education by placing books directly in the hands of those who need them most.</h3>
            </div>
          </div>
        </div>
        <div className="hero-right">
          {cardData.map((card, idx) => (
            <div className={`photo-card card${idx}`} key={card.title}>
              <img src={card.img} alt={card.title} />
              <div className="card-title">{card.title}</div>
              <div className="card-text">{card.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-cards">
        <div className="section-card green">
          <h2>Our Objective</h2>
          <ul>
           <li>To ensure access to books for everyone, especially those who cannot afford to buy them due to financial or other constraints. </li>
           <li>To create a platform that encourages everyone to share books and foster a sense of shared learning.</li>
           <li>To cultivate reading habits by making books more approachable and visible in everyday environments.</li>
           <li>To increase access to books among children, youth, and adults in underserved areas.</li>
           <li>To develop sustainable, replicable models of free libraries and build inclusive, community-powered reading spaces.</li>
           <li>To reconnect youth with the real world by encouraging reading over excessive screen time.</li>
           </ul>
        </div>
        <div className="section-card purple">
          <h2>Our Impact</h2>
          <ul>
           <li>Six libraries are actively operating across different corners of Delhi.</li>
           <li>More than 5,000 readers have become part of the libraries</li>
           <li>Over 3000 books in active circulation</li>
           <li>Weekly footfall of 300+ readers</li>
           <li>A committed team of 20+ volunteers supports daily functioning.</li>
           <li>Readers include children, students, senior citizens, migrants, and women from diverse backgrounds.</li>
           <li>The libraries also promote grassroots authors and regional literature, strengthening local culture and voices.</li>
           </ul>
        </div>
        <div className="section-card blue">
          <h2>The Concept</h2>
          <p>
            At BHC India's Free Open Book Libraries, anyone can borrow books of their choice and take them home to read for two weeks. Readers only need to provide basic general information.<br/>Each library functions once a week, allowing individuals to borrow, take home, or return books.<br/>The model is built entirely on principles of mutual trust and cooperation - with no fees, deposits, or security money required.
          </p>
          <p>This is to develop sustainable, replicable models of libraries and build anationwide network of inclusive, community-powered reading sapces through thousands of libraries.</p>
        </div>
      </section>
      {/* Additional Information Section */}
<section className="library-info-section">
  <h2 className="library-info-heading">Where You Can Find Us</h2>
  <p className="library-info-text">
    Our community libraries are currently set up at the following locations:
  </p>
  <ul className="library-info-list">
    <li>📍 Gandhi Vihar – Every Sunday - 2:00 PM to 6:00 PM</li>
    <li>📍 Vijay Nagar – Every Saturday - 12:00 PM to 5:00 PM</li>
    <li>📍 DUWA (DU) – Every Friday - 11:00 AM to 5:00 PM</li>
    <li>📍 Faculty Of Arts(DU) – Every Monday - 12:00 PM to 5:00 PM</li>
  </ul>

  <h2 className="library-info-heading">Alternate Book Submission Points</h2>
<p className="library-info-text">
  If the main library is closed, members can safely return books at the following
  designated drop-off points:
</p>

<div className="alt-points-container">
  <div className="alt-point-card">
    <h3>📍 Rajput Photostat Shop – Infront of Pink Booth Police Chauki,Gandhi Vihar</h3>
    <img src="/images/civil-lines.jpg" alt="Rajput Photostat Shop" />
    <a href="https://maps.google.com" className="location-link">View Location</a>
  </div>

  <div className="alt-point-card">
    <h3>📍 Dhingra Saintary store – Infront of 4 Block Park, double Story, Vijay Nagar</h3>
    <img src="/images/ashok-vihar.jpg" alt="Dhingra Saintary store" />
    <a href="https://maps.google.com" className="location-link">View Location</a>
  </div>

  <div className="alt-point-card">
    <h3>📍 Photostat Xerox point shop – Beside DUDU office & Nandi Joshi canteen</h3>
    <img src="/images/karol-bagh.jpg" alt="Photostat Xerox point shop" />
    <a href="https://maps.google.com" className="location-link">View Location</a>
  </div>

  <div className="alt-point-card">
    <h3>📍 Green Cafe Maggi Point – Near Hindu College & St. Stephen's College</h3>
    <img src="/images/karol-bagh.jpg" alt="Green Cafe Maggi Point" />
    <a href="https://maps.google.com" className="location-link">View Location</a>
  </div>

  <div className="alt-point-card">
    <h3>📍 Kirori Mal College Hostel Canteen – Near Boys Hostel, Sports ground</h3>
    <img src="/images/karol-bagh.jpg" alt="Kirori Mal College Hostel Canteen" />
    <a href="https://maps.google.com" className="location-link">View Location</a>
  </div>

  <div className="alt-point-card">
    <h3>📍Amul DRC – Amul, Daulat Ram College</h3>
    <img src="/images/karol-bagh.jpg" alt="Amul DRC" />
    <a href="https://maps.google.com" className="location-link">View Location</a>
  </div>

  <div className="alt-point-card">
    <h3>📍 Mother Dairy – Chhatra AMrg, Near Gate no. 4, Faculty of Arts, Delhi University</h3>
    <img src="/landingpage/MotherDairy.png" alt="Mother Dairy" />
    <a href="https://maps.app.goo.gl/WvUMvzgheBAToULi7" className="location-link">View Location</a>
  </div>

  <div className="alt-point-card">
    <h3>📍 JUMBOKING – Near Vishwavidyalay Metro station Gate no. 3 & 4. </h3>
    <img src="/images/karol-bagh.jpg" alt="JUMBOKING" />
    <a href="https://maps.google.com" className="location-link">View Location</a>
  </div>
</div>

</section>

    </div>
  );
};

export default LandingPage;
