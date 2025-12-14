'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" href="/">
            <span className={styles.logo}>fiscal-tracker</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" href="/">
                  HOME
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/projects">
                  PROJECTS
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/about">
                  ABOUT
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/contact">
                  CONTACT
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/grievance">
                  GRIEVANCE
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
