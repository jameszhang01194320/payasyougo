import React from 'react';
import { FaChartLine, FaUserTie, FaReceipt, FaWallet } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
  return (
    <div>
      {/* Header */}
      <header className="text-center mt-5 mb-4">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          Welcome to Tax Bucket Accounting System
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#444' }}>
          A simple app based on the Profit First method. Income is automatically allocated into 4 smart buckets.
        </p>
      </header>

      {/* CTA Buttons */}
      <div className="text-center mb-4">
        <Link to="/login">
          <button className="cta-button">Get Started</button>
        </Link>
        <Link to="/register">
          <button className="cta-button secondary">Register</button>
        </Link>
      </div>

      {/* Buckets */}
      <div className="clearfix" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div className="bucket-card">
          <FaChartLine className="icon" />
          <h3 className="bucket-title">Profit (10%)</h3>
          <p className="bucket-desc">Your reward as a business owner. Set aside profit before spending.</p>
        </div>

        <div className="bucket-card">
          <FaUserTie className="icon" />
          <h3 className="bucket-title">Owner's Pay (50%)</h3>
          <p className="bucket-desc">Your salary as the owner. Pay yourself first and regularly.</p>
        </div>

        <div className="bucket-card">
          <FaReceipt className="icon" />
          <h3 className="bucket-title">Tax (15%)</h3>
          <p className="bucket-desc">For income and business taxes. Keep it safe and separate.</p>
        </div>

        <div className="bucket-card">
          <FaWallet className="icon" />
          <h3 className="bucket-title">Operating Expenses (25%)</h3>
          <p className="bucket-desc">Covers rent, software, subscriptions, and all other spending.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-5 mb-4">
        <p>© 2025 Tax Bucket Accounting App. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
