'use client';

import { useState, useEffect } from 'react';
import { fetchPunjabDistricts, getDistrictTalukas, getTalukaVillages } from '@/services/locationService';
import styles from './GrievancePage.module.css';

export default function GrievancePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: 'Punjab',
    district: '',
    taluka: '',
    village: '',
    message: '',
    attachment: null
  });

  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch districts on component mount
  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      setLoading(true);
      const data = await fetchPunjabDistricts();
      setDistricts(data);
    } catch (err) {
      console.error('Error fetching districts:', err);
      setError('Failed to load districts');
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictChange = async (e) => {
    const districtName = e.target.value;
    setFormData(prev => ({
      ...prev,
      district: districtName,
      taluka: '',
      village: ''
    }));

    if (districtName) {
      try {
        setLoading(true);
        const selectedDistrict = districts.find(d => d.name === districtName);
        if (selectedDistrict) {
          const talukaData = await getDistrictTalukas(selectedDistrict.id);
          setTalukas(talukaData);
        }
      } catch (err) {
        console.error('Error fetching talukas:', err);
        setError('Failed to load talukas');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTalukaChange = async (e) => {
    const talukaName = e.target.value;
    setFormData(prev => ({
      ...prev,
      taluka: talukaName,
      village: ''
    }));

    if (talukaName && formData.district) {
      try {
        setLoading(true);
        const villageData = await getTalukaVillages('PUNJAB', formData.district, talukaName);
        setVillages(villageData);
      } catch (err) {
        console.error('Error fetching villages:', err);
        setError('Failed to load villages');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Remove any browser extension attributes
    if (e.target.style) {
      e.target.style.backgroundImage = 'none';
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        attachment: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.district || !formData.village || !formData.message) {
      setError('Please fill all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('state', formData.state);
      submitData.append('district', formData.district);
      submitData.append('taluka', formData.taluka);
      submitData.append('village', formData.village);
      submitData.append('message', formData.message);
      if (formData.attachment) {
        submitData.append('attachment', formData.attachment);
      }

      const response = await fetch('/api/grievances/submit', {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          state: 'Punjab',
          district: '',
          taluka: '',
          village: '',
          message: '',
          attachment: null
        });
        setTalukas([]);
        setVillages([]);

        // Reset success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || 'Failed to submit grievance');
      }
    } catch (err) {
      console.error('Error submitting grievance:', err);
      setError('Error submitting grievance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>📋 File a Grievance</h1>
        <p>Help us improve by reporting issues and concerns</p>
      </div>

      {/* Form Container */}
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Success Message */}
          {success && (
            <div className={styles.successMessage}>
              ✓ Grievance submitted successfully! We will review it shortly.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={styles.errorMessage}>
              ✗ {error}
            </div>
          )}

          {/* Personal Information Section */}
          <div className={styles.section}>
            <h2>Personal Information</h2>

            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
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
                  suppressHydrationWarning
                />
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit phone number"
                  maxLength="10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className={styles.section}>
            <h2>Location Details</h2>

            <div className={styles.formGroup}>
              <label>State *</label>
              <input
                type="text"
                value={formData.state}
                disabled
                className={styles.disabledInput}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>District *</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleDistrictChange}
                  required
                  disabled={loading || districts.length === 0}
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district.id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Taluka/Tehsil</label>
                <select
                  name="taluka"
                  value={formData.taluka}
                  onChange={handleTalukaChange}
                  disabled={loading || talukas.length === 0 || !formData.district}
                >
                  <option value="">Select Taluka</option>
                  {talukas.map(taluka => (
                    <option key={taluka.id} value={taluka.name}>
                      {taluka.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Village *</label>
              <select
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                required
                disabled={loading || villages.length === 0 || !formData.taluka}
              >
                <option value="">Select Village</option>
                {villages.map(village => (
                  <option key={village.id} value={village.name}>
                    {village.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grievance Details Section */}
          <div className={styles.section}>
            <h2>Grievance Details</h2>

            <div className={styles.formGroup}>
              <label>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Please describe your grievance in detail..."
                rows="6"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Attachment (Optional)</label>
              <div className={styles.fileInput}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <span className={styles.fileHint}>
                  Max 5MB - Supported: PDF, DOC, DOCX, JPG, PNG
                </span>
              </div>
              {formData.attachment && (
                <div className={styles.fileName}>
                  📎 {formData.attachment.name}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Grievance'}
            </button>
            <button
              type="reset"
              className={styles.resetBtn}
              onClick={() => {
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  state: 'Punjab',
                  district: '',
                  taluka: '',
                  village: '',
                  message: '',
                  attachment: null
                });
                setError('');
              }}
            >
              Clear Form
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className={styles.infoBox}>
          <h3>📌 Important Information</h3>
          <ul>
            <li>Your grievance will be reviewed within 24-48 hours</li>
            <li>You will receive updates via email and phone</li>
            <li>All information is kept confidential</li>
            <li>Provide accurate details for faster resolution</li>
            <li>Attachments help us understand the issue better</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
