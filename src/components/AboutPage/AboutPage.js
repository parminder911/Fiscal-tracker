'use client';

import styles from './AboutPage.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>About Us</h1>
        <p>Bringing Transparency to Government Budget Management</p>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Mission Section */}
        <section className={styles.section}>
          <h2>🎯 Our Mission</h2>
          <p>
            The Punjab Budget Transparency Portal is dedicated to making government budget allocation and utilization 
            transparent and accessible to all citizens. We believe that transparency builds trust and enables better 
            governance.
          </p>
        </section>

        {/* Vision Section */}
        <section className={styles.section}>
          <h2>🌟 Our Vision</h2>
          <p>
            To create a comprehensive, real-time budget tracking system that empowers citizens, improves accountability, 
            and enables data-driven decision-making at all levels of government.
          </p>
        </section>

        {/* Features Section */}
        <section className={styles.section}>
          <h2>✨ Key Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Real-Time Data</h3>
              <p>Access up-to-date budget allocation and utilization data</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔍</div>
              <h3>Transparency</h3>
              <p>View detailed project information and budget tracking</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🤖</div>
              <h3>AI Analysis</h3>
              <p>Get intelligent insights on budget health and trends</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📱</div>
              <h3>Multi-Level Access</h3>
              <p>Role-based access for different administrative levels</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔐</div>
              <h3>Secure System</h3>
              <p>Enterprise-grade security for data protection</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📢</div>
              <h3>Citizen Engagement</h3>
              <p>File grievances and provide feedback directly</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className={styles.section}>
          <h2>⚙️ How It Works</h2>
          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Project Creation</h3>
              <p>Village Sarpanch creates project requests with budget details</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Multi-Level Approval</h3>
              <p>Projects move through Tehsil → District → Admin approval</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Budget Allocation</h3>
              <p>Approved projects receive budget allocation and tracking</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3>Citizen Access</h3>
              <p>Citizens view budget data and project progress transparently</p>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className={styles.section}>
          <h2>🚀 Technology Stack</h2>
          <div className={styles.techGrid}>
            <div className={styles.techItem}>
              <strong>Frontend:</strong> Next.js, React, Bootstrap
            </div>
            <div className={styles.techItem}>
              <strong>Backend:</strong> Node.js, PostgreSQL
            </div>
            <div className={styles.techItem}>
              <strong>AI/ML:</strong> Oumi GRPO, Kestra Workflows
            </div>
            <div className={styles.techItem}>
              <strong>Deployment:</strong> Vercel, Docker
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className={styles.section}>
          <h2>👥 Our Team</h2>
          <p>
            The Punjab Budget Transparency Portal is developed by a dedicated team of software engineers, 
            data scientists, and government technology experts committed to improving public governance.
          </p>
        </section>

        {/* Contact CTA */}
        <section className={styles.ctaSection}>
          <h2>Have Questions?</h2>
          <p>Get in touch with us for more information or support</p>
          <a href="/contact" className={styles.ctaButton}>Contact Us</a>
        </section>
      </div>
    </div>
  );
}
