'use client';

import { useState } from 'react';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });

        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Contact Us</h1>
        <p>Get in touch with our team</p>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Contact Form */}
        <div className={styles.formSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Send us a Message</h2>

            {success && (
              <div className={styles.successMessage}>
                ✓ Message sent successfully! We'll get back to you soon.
              </div>
            )}

            {error && (
              <div className={styles.errorMessage}>
                ✗ {error}
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your phone number"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="What is this about?"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your message here..."
                rows="6"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>📍 Address</h3>
            <p>
              Punjab Government Secretariat<br />
              Chandigarh, Punjab<br />
              India
            </p>
          </div>

          <div className={styles.infoCard}>
            <h3>📞 Phone</h3>
            <p>
              Helpline: <strong>1100</strong><br />
              Email: <strong>support@budget.punjab.gov.in</strong>
            </p>
          </div>

          <div className={styles.infoCard}>
            <h3>⏰ Working Hours</h3>
            <p>
              Monday - Friday<br />
              9:00 AM - 6:00 PM<br />
              (IST)
            </p>
          </div>

          <div className={styles.infoCard}>
            <h3>🔗 Follow Us</h3>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>Facebook</a>
              <a href="#" className={styles.socialLink}>Twitter</a>
              <a href="#" className={styles.socialLink}>LinkedIn</a>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3>❓ FAQ</h3>
            <p>
              Visit our FAQ section for common questions and answers about the portal.
            </p>
            <a href="#" className={styles.link}>View FAQs →</a>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className={styles.mapSection}>
        <h2>Find Us</h2>
        <div className={styles.mapPlaceholder}>
          <p>📍 Punjab Government Secretariat, Chandigarh</p>
        </div>
      </div>
    </div>
  );
}
