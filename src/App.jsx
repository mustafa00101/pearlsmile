import { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";
import AppointmentModal from "./AppointmentModal";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";


function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const openService = (service) => {
  setSelectedService(service);

  setTimeout(() => {
    document
      .getElementById("service-details")
      ?.scrollIntoView({ behavior: "smooth" });
  }, 100);
};

      if (window.location.pathname === "/admin") {

  if (adminUser) {
    return (
      <AdminDashboard
        user={adminUser}
        onLogout={() => setAdminUser(null)}
      />
    );
  }

  return (
    <AdminLogin
      onLogin={(user) => setAdminUser(user)}
    />
  );
}

  return (
    <main className="app">
      <nav className="navbar">
        <div className="logo">
          <span>✦</span> PearlSmile
        </div>

        <div className="nav-links">
  <a href="#services">Services</a>
  <a href="#about">About</a>
  <a href="#doctor">Our Dentist</a>
  <a href="#contact">Contact</a>
</div>

<button
  className="mobile-menu-btn"
  onClick={() => setMenuOpen(!menuOpen)}
>
  {menuOpen ? "×" : "☰"}
</button>
        <AppointmentModal
  buttonText="Book Appointment"
  buttonClassName="appointment-btn"
/>
      </nav>
{menuOpen && (
  <div className="mobile-menu">

    <a
      href="#services"
      onClick={() => setMenuOpen(false)}
    >
      Services
    </a>

    <a
      href="#about"
      onClick={() => setMenuOpen(false)}
    >
      About
    </a>

    <a
      href="#doctor"
      onClick={() => setMenuOpen(false)}
    >
      Our Dentist
    </a>

    <a
      href="#testimonials"
      onClick={() => setMenuOpen(false)}
    >
      Testimonials
    </a>

    <a
      href="#contact"
      onClick={() => setMenuOpen(false)}
    >
      Contact
    </a>

    <a
      href="#contact"
      className="mobile-book-btn"
      onClick={() => setMenuOpen(false)}
    >
      Book Appointment →
    </a>

  </div>
)}


      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="eyebrow">MODERN DENTISTRY · PERSONALIZED CARE</p>

          <h1>
            Your smile deserves
            <span> exceptional care.</span>
          </h1>

          <p className="hero-text">
            Experience modern dental care designed around your comfort,
            confidence, and long-term oral health.
          </p>

          <div className="hero-buttons">
            <AppointmentModal
              buttonText="Book an Appointment →"
              buttonClassName="primary-btn"
            />

            <button
            className="secondary-btn"
            onClick={() => {
              document.getElementById("services")?.scrollIntoView({
                behavior: "smooth",
              });
               }}
              >
              Explore Services
              </button>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            src="/tooth.png"
            alt="PearlSmile Dental Care"
            className="hero-tooth-image"
          />

          <div className="floating-card">
            <strong>4.9/5</strong>
            <span>Patient Rating</span>
          </div>
        </motion.div>
      </section>

      <section className="stats">
        <div>
          <strong>12+</strong>
          <span>Years Experience</span>
        </div>

        <div>
          <strong>8K+</strong>
          <span>Happy Patients</span>
        </div>

        <div>
          <strong>15+</strong>
          <span>Dental Treatments</span>
        </div>
      </section>

      <section className="services" id="services">

  <div className="section-heading">
    <p className="eyebrow">OUR SERVICES</p>

    <h2>
      Complete care for
      <span> your smile.</span>
    </h2>

    <p>
      From routine checkups to advanced cosmetic treatments,
      our team is here to keep your smile healthy and confident.
    </p>
  </div>


  <div className="services-grid">

    {/* GENERAL DENTISTRY */}
    <motion.div
      className={`service-card ${
        selectedService === "general" ? "active-service" : ""
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      onClick={() => openService("general")}
    >
      <span className="service-number">01</span>

      <div className="service-icon">✦</div>

      <h3>General Dentistry</h3>

      <p>
        Preventive care, cleanings, checkups and treatments
        designed to keep your teeth healthy.
      </p>

      <button className="service-explore">
        Explore →
      </button>
    </motion.div>


    {/* COSMETIC DENTISTRY */}
    <motion.div
      className={`service-card ${
        selectedService === "cosmetic" ? "active-service" : ""
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      onClick={() => openService("cosmetic")}
    >
      <span className="service-number">02</span>

      <div className="service-icon">◇</div>

      <h3>Cosmetic Dentistry</h3>

      <p>
        Transform your smile with modern whitening,
        veneers and personalized cosmetic treatments.
      </p>

      <button className="service-explore">
        Explore →
      </button>
    </motion.div>


    {/* DENTAL IMPLANTS */}
    <motion.div
      className={`service-card ${
        selectedService === "implants" ? "active-service" : ""
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      onClick={() => openService("implants")}
    >
      <span className="service-number">03</span>

      <div className="service-icon">◉</div>

      <h3>Dental Implants</h3>

      <p>
        Natural-looking implant solutions designed to
        restore comfort, function and confidence.
      </p>

      <button className="service-explore">
        Explore →
      </button>
    </motion.div>

  </div>


  {/* SERVICE DETAILS */}

  {selectedService && ( 
  <motion.div 
    id="service-details"
    className="service-details"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >

      {/* LEFT SIDE */}

      <div className="service-details-content">

        {selectedService === "general" && (
  <>
    <p className="eyebrow">GENERAL DENTISTRY</p>

    <h2>
      Everyday care for
      <span> a healthy smile.</span>
    </h2>

    <p className="service-details-description">
      Complete dental care focused on preventing problems,
      maintaining healthy teeth and gums, and keeping your
      smile comfortable for years to come.
    </p>

    <div className="service-list">

      <div>
        <span>01</span>
        <p>Comprehensive Dental Checkups</p>
      </div>

      <div>
        <span>02</span>
        <p>Professional Teeth Cleaning</p>
      </div>

      <div>
        <span>03</span>
        <p>Dental Fillings & Restorations</p>
      </div>

      <div>
        <span>04</span>
        <p>Gum & Preventive Care</p>
      </div>

      <div>
        <span>05</span>
        <p>Cavity Detection & Treatment</p>
      </div>

      <div>
        <span>06</span>
        <p>Routine Oral Health Guidance</p>
      </div>

    </div>
  </>
)}


        {selectedService === "cosmetic" && (
          <>
            <p className="eyebrow">COSMETIC DENTISTRY</p>

            <h2>
              Your dream smile,
              <span> beautifully designed.</span>
            </h2>

            <p className="service-details-description">
              Cosmetic dentistry combines modern techniques
              with personalized treatment planning to improve
              the appearance and confidence of your smile.
            </p>

            <div className="service-list">

              <div>
                <span>01</span>
                <p>Professional teeth whitening</p>
              </div>

              <div>
                <span>02</span>
                <p>Porcelain and cosmetic veneers</p>
              </div>

              <div>
                <span>03</span>
                <p>Smile makeover treatments</p>
              </div>

              <div>
                <span>04</span>
                <p>Cosmetic dental bonding</p>
              </div>

            </div>
          </>
        )}


        {selectedService === "implants" && (
          <>
            <p className="eyebrow">DENTAL IMPLANTS</p>

            <h2>
              Restore your smile
              <span> with confidence.</span>
            </h2>

            <p className="service-details-description">
              Dental implants provide a natural-looking solution
              for replacing missing teeth while helping restore
              comfortable chewing and a confident smile.
            </p>

            <div className="service-list">

              <div>
                <span>01</span>
                <p>Single tooth implants</p>
              </div>

              <div>
                <span>02</span>
                <p>Multiple tooth replacement</p>
              </div>

              <div>
                <span>03</span>
                <p>Implant consultation</p>
              </div>

              <div>
                <span>04</span>
                <p>Crown restoration</p>
              </div>

            </div>
          </>
        )}


        <div className="service-detail-buttons">

          <AppointmentModal
            buttonText="Book Appointment →"
            buttonClassName="primary-btn"
          />

          <button
            className="service-close-btn"
            onClick={() => setSelectedService(null)}
          >
            Close
          </button>

        </div>

      </div>


      {/* RIGHT SIDE HD TOOTH */}

      <div className="service-details-visual">

        <div className="service-image-glow"></div>

        <img 
  src={
    selectedService === "general"
      ? "/services/general_dentestry.png"
      : selectedService === "cosmetic"
      ? "/services/cosmetic_dentestry.png"
      : "/services/dental-implants.png"}

  alt="Dental treatment"
  className="service-tooth-image"
/>

        <div className="service-image-label">
          <strong>PearlSmile Care</strong>
          <span>Modern dental treatment</span>
        </div>

      </div>

    </motion.div>
  )}

</section>


      <section className="why-section" id="about">
  <div className="why-intro">
    <p className="eyebrow">WHY PEARLSMILE</p>

    <h2>
      Dentistry built
      <span> around you.</span>
    </h2>

    <p>
      We combine modern technology, experienced professionals,
      and a patient-first approach to make every visit more
      comfortable and more effective.
    </p>
  </div>

  <div className="why-list">

    <motion.div
      className="why-item"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <span>01</span>

      <div>
        <h3>Modern Technology</h3>

        <p>
          Advanced dental technology helps us provide
          accurate, comfortable and efficient treatment.
        </p>
      </div>
    </motion.div>


    <motion.div
      className="why-item"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15 }}
    >
      <span>02</span>

      <div>
        <h3>Experienced Care</h3>

        <p>
          Our experienced dental professionals focus on
          your individual needs and long-term oral health.
        </p>
      </div>
    </motion.div>


    <motion.div
      className="why-item"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <span>03</span>

      <div>
        <h3>Patient First</h3>

        <p>
          From your first consultation to your final
          treatment, your comfort comes first.
        </p>
      </div>
    </motion.div>

  </div>
</section>

<section className="doctor-section" id="doctor">

  <motion.div
    className="doctor-visual"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >

    <div className="doctor-glow"></div>

    <div className="doctor-placeholder">
      <span><img
            src="/drimage.png"
            alt="Dr. Ayesha Zeb"
            className="doctor-placeholder-image"
          /></span>
    </div>

    <div className="doctor-badge">
      <strong>15+</strong>
      <span>Years Experience</span>
    </div>

  </motion.div>


  <motion.div
    className="doctor-content"
    initial={{ opacity: 0, x: 40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
  >
    

    <p className="eyebrow">
      MEET YOUR DENTIST
    </p>

    <h2>
      Care you can
      <span> trust.</span>
    </h2>

    <h3>
      Dr. Ayesha Zeb
    </h3>

    <p className="doctor-role">
      Cosmetic & Restorative Dentist
    </p>

    <p className="doctor-description">
      With more than 15 years of experience, Dr. Ayesha Zeb
      combines advanced dental techniques with a gentle,
      patient-focused approach.
    </p>

    <div className="doctor-credentials">

      <div>
        <strong>15+</strong>
        <span>Years Experience</span>
      </div>

      <div>
        <strong>8K+</strong>
        <span>Patients Treated</span>
      </div>

      <div>
        <strong>4.9</strong>
        <span>Patient Rating</span>
      </div>

    </div>


  </motion.div>

</section>
<section className="testimonials-section" id="testimonials">

  <div className="testimonials-heading">
    <p className="eyebrow">PATIENT STORIES</p>

    <h2>
      Smiles speak
      <span> for themselves.</span>
    </h2>
  </div>


  <div className="testimonials-grid">

    <motion.div
      className="testimonial-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="stars">★★★★★</div>

      <p>
        “The entire experience was amazing. Everyone was
        welcoming, professional and genuinely caring.”
      </p>

      <div className="testimonial-person">
        <div className="person-avatar">EM</div>

        <div>
          <strong>Emily Morgan</strong>
          <span>Cosmetic Dentistry</span>
        </div>
      </div>
    </motion.div>


    <motion.div
      className="testimonial-card testimonial-featured"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="stars">★★★★★</div>

      <p>
        “I finally feel confident about my smile again.
        The results completely exceeded my expectations.”
      </p>

      <div className="testimonial-person">
        <div className="person-avatar">JL</div>

        <div>
          <strong>James Lewis</strong>
          <span>Smile Makeover</span>
        </div>
      </div>
    </motion.div>


    <motion.div
      className="testimonial-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="stars">★★★★★</div>

      <p>
        “From booking my appointment to the treatment itself,
        everything felt simple and comfortable.”
      </p>

      <div className="testimonial-person">
        <div className="person-avatar">SA</div>

        <div>
          <strong>Sophia Adams</strong>
          <span>General Dentistry</span>
        </div>
      </div>
    </motion.div>

  </div>

</section>

<section className="booking-section" id="contact">

  <div className="booking-content">

    <p className="eyebrow">BOOK YOUR VISIT</p>

    <h2>
      Your best smile
      <span> starts here.</span>
    </h2>

    <p>
      Ready to take the next step? Book a consultation
      with our dental team and let's create a treatment
      plan designed around you.
    </p>

    <div className="booking-details">

      

    </div>

  </div>


  <div className="booking-info-card">

  <div className="booking-info-top">
    <p className="eyebrow">PEARLSMILE CLINIC</p>

    <h3>
      We're here for
      <span> your smile.</span>
    </h3>

    <p>
      Comfortable, modern dental care designed
      around you and your family's needs.
    </p>
  </div>


  <div className="clinic-info">

    <div className="clinic-info-item">
      <span className="clinic-icon">📍</span>

      <div>
        <small>LOCATION</small>
        <strong>Peshawar, Ring Road</strong>
      </div>
    </div>


    <div className="clinic-info-item">
      <span className="clinic-icon">🕘</span>

      <div>
        <small>OPENING HOURS</small>
        <strong>Monday – Friday</strong>
        <span>9:00 AM – 5:00 PM</span>
      </div>
    </div>


    <div className="clinic-info-item">
      <span className="clinic-icon">📞</span>

      <div>
        <small>CALL US</small>
        <strong>+92 123 4567890</strong>
      </div>
    </div>


    <div className="clinic-info-item">
      <span className="clinic-icon">✉️</span>

      <div>
        <small>EMAIL</small>
        <strong>hello@pearlsmile.com</strong>
      </div>
    </div>

  </div>


  <div className="booking-info-footer">
    <img
      src="/tooth.png"
      alt="PearlSmile Dental Care"
    />

    <p>
      Your smile deserves expert care.
    </p>
  </div>

</div>

</section>

<footer className="footer">

  <div className="footer-main">

    <div className="footer-brand">
      <div className="logo">
        <span>✦</span>PearlSmile
      </div>

      <p>
        Modern dentistry designed around
        your health, comfort and confidence.
      </p>
    </div>


    <div className="footer-column">
      <h4>Explore</h4>

      <a href="#services">Services</a>
      <a href="#about">About</a>
      <a href="#doctor">Our Dentist</a>
      <a href="#testimonials">Testimonials</a>
    </div>


    <div className="footer-column">
      <h4>Contact</h4>

      <a href="tel:+921234567890">
        +92 123 4567890
      </a>

      <a href="mailto:hello@pearlsmile.com">
        hello@pearlsmile.com
      </a>

      <span>
        Peshawar , Ring Road
      </span>
    </div>


    <div className="footer-column">
      <h4>Visit Us</h4>

      <span>Mon — Fri</span>
      <span>8:00 AM — 6:00 PM</span>

      <span>Saturday</span>
      <span>9:00 AM — 2:00 PM</span>
    </div>

  </div>


  <div className="footer-bottom">

    <span>
      © 2026 PearlSmile. All rights reserved.
    </span>

    <span>
      Designed for modern smiles.
    </span>

  </div>

</footer>

    </main>
  );
}

export default App;