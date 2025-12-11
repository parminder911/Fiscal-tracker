'use client';

import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container-fluid bg-dark text-white py-4">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>Fiscal Tracker</h5>
            <p>Government Spending Transparency Portal for Punjab</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white-50">Dashboard</a></li>
              <li><a href="#" className="text-white-50">Transactions</a></li>
              <li><a href="#" className="text-white-50">Reports</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Contact</h5>
            <p className="text-white-50">
              Email: info@fiscaltracker.gov.in<br/>
              Phone: +91-XXXX-XXXX-XXXX
            </p>
          </div>
        </div>
        <hr className="bg-white-50" />
        <div className="text-center text-white-50">
          <p>&copy; 2025 Fiscal Tracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
