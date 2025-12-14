'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/services/locationService';
import styles from './Homepage.module.css';

export default function Homepage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState(null);
  const [error, setError] = useState('');
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize captcha only on client side to prevent hydration mismatch
  useEffect(() => {
    setGeneratedCaptcha(Math.floor(Math.random() * 9000) + 1000);
      // Fetch districts list
    import('@/services/locationService').then(mod => mod.fetchPunjabDistricts())
      .then(list => setDistricts(list))
      .catch(() => setDistricts([]));
  }, []);

  function generateCaptcha() {
    return Math.floor(Math.random() * 9000) + 1000;
  }

  const handleRefreshCaptcha = () => {
    setGeneratedCaptcha(generateCaptcha());
    setCaptcha('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!userId || !password || !captcha) {
      setError('Please fill all fields');
      return;
    }

    if (parseInt(captcha) !== generatedCaptcha) {
      setError('Invalid captcha. Please try again.');
      handleRefreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId.trim(),
          password: password.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and redirect based on role
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on role
        const roleRoutes = {
          admin: '/admin',
          district: '/district',
          tehsil: '/tehsil',
          sarpanch: '/sarpanch',
          citizen: '/citizen'
        };

        console.log('Login successful - Role:', data.user.role, 'Redirecting to:', roleRoutes[data.user.role]);

        window.location.href = roleRoutes[data.user.role] || '/';
      } else {
        console.error('Login API response:', data);
        if (data.details) {
          switch(data.details) {
            case 'USER_NOT_FOUND':
              setError(`User ID "${data.debug?.user_id}" not found in database. Check if the user exists.`);
              break;
            case 'USER_INACTIVE':
              setError(`Account "${data.debug?.user_id}" is deactivated. Contact administrator.`);
              break;
            case 'PASSWORD_MISMATCH':
              setError(`Incorrect password for user ID "${data.debug?.user_id}". Check your password.`);
              break;
            default:
              setError(data.error || 'Login failed');
          }
        } else {
          setError(data.error || 'Login failed');
        }
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header - Simplified */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <span className={styles.headerTitle}>Punjab Budget Transparency Portal</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left Section - Logo & Login */}
        <div className={styles.leftSection}>
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <div className={styles.logoCircle}>🏛️</div>
              <div className={styles.logoText}>
                <div className={styles.logoTitle}>Budget</div>
                <div className={styles.logoSubtitle}>TRANSPARENCY</div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form className={styles.loginForm} onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label>User ID</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className={styles.input}
              />
              <a href="#" className={styles.forgotLink}>Forgot User ID ?</a>
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
              <a href="#" className={styles.forgotLink}>Forgot Password ?</a>
            </div>

            <div className={styles.captchaGroup}>
              <label>Captcha</label>
              <div className={styles.captchaContainer}>
                <input
                  type="text"
                  placeholder="Enter captcha"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  className={styles.captchaInput}
                />
                <div className={styles.captchaBox}>
                  <span className={styles.captchaText}>
                    {generatedCaptcha !== null ? generatedCaptcha : '****'}
                  </span>
                  <button
                    type="button"
                    className={styles.refreshBtn}
                    onClick={handleRefreshCaptcha}
                  >
                    🔄
                  </button>
                </div>
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              className={styles.loginBtn}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Right Section - Quick Actions & Info */}
        <div className={styles.rightSection}>
          {/* Quick Action Buttons */}
          <div className={styles.quickActions}>
            <Link href="/grievance" className={styles.actionCard}>
              <div className={styles.actionIcon}>📋</div>
              <div className={styles.actionText}>
                <div className={styles.actionTitle}>FILE GRIEVANCE</div>
              </div>
            </Link>

            <Link href="/about" className={styles.actionCard}>
              <div className={styles.actionIcon}>ℹ️</div>
              <div className={styles.actionText}>
                <div className={styles.actionTitle}>ABOUT US</div>
              </div>
            </Link>

            <Link href="/contact" className={styles.actionCard}>
              <div className={styles.actionIcon}>📞</div>
              <div className={styles.actionText}>
                <div className={styles.actionTitle}>CONTACT US</div>
              </div>
            </Link>

            <Link href="/projects" className={styles.actionCard}>
              <div className={styles.actionIcon}>🏗️</div>
              <div className={styles.actionText}>
                <div className={styles.actionTitle}>PROJECTS</div>
              </div>
            </Link>
          </div>

          {/* Reports Section */}
          <div className={styles.reportsSection}>
            <div className={styles.reportCard}>
              <h3 className={styles.reportTitle}>Pendency Report</h3>
              <p className={styles.reportValue}>0.4 %</p>
            </div>
            <div className={styles.reportCard}>
              <h3 className={styles.reportTitle}>Sendback Report</h3>
              <p className={styles.reportValue}>0.2 %</p>
            </div>
          </div>

          {/* District Rankings */}
          <div className={styles.rankingsSection}>
            <h3 className={styles.rankingsTitle}>District Performance</h3>
            <table className={styles.rankingsTable}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>District</th>
                  <th>Pendency %</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Amritsar</td>
                  <td><span className={styles.badge}>0.1 %</span></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Ludhiana</td>
                  <td><span className={styles.badge}>0.2 %</span></td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Jalandhar</td>
                  <td><span className={styles.badge}>0.3 %</span></td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Patiala</td>
                  <td><span className={styles.badge}>0.4 %</span></td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Bathinda</td>
                  <td><span className={styles.badge}>0.5 %</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transaction Details Section */}
      <div className={styles.transactionSection}>
        <h3 className={styles.sectionTitle}>📊 Budget Summary</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>₹236.08 Cr</div>
            <div className={styles.statLabel}>Total Budget</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>₹136.77 Cr</div>
            <div className={styles.statLabel}>This Month</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>₹106.71 Cr</div>
            <div className={styles.statLabel}>This Year</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>78.01%</div>
            <div className={styles.statLabel}>Utilization Rate</div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className={styles.tableSection}>
        <h3 className={styles.sectionTitle}>📋 District Budget Details</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>District</th>
                <th>Total Budget</th>
                <th>Allocated</th>
                <th>Utilized</th>
                <th>Allocation %</th>
                <th>Utilization %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Amritsar</td>
                <td>₹50 Lakh</td>
                <td>₹45 Lakh</td>
                <td>₹40.5 Lakh</td>
                <td>90%</td>
                <td>90%</td>
              </tr>
              <tr>
                <td>Ludhiana</td>
                <td>₹60 Lakh</td>
                <td>₹55 Lakh</td>
                <td>₹48 Lakh</td>
                <td>91.67%</td>
                <td>87.27%</td>
              </tr>
              <tr>
                <td>Jalandhar</td>
                <td>₹45 Lakh</td>
                <td>₹40 Lakh</td>
                <td>₹35 Lakh</td>
                <td>88.89%</td>
                <td>87.5%</td>
              </tr>
              <tr>
                <td>Patiala</td>
                <td>₹55 Lakh</td>
                <td>₹50 Lakh</td>
                <td>₹42 Lakh</td>
                <td>90.91%</td>
                <td>84%</td>
              </tr>
              <tr>
                <td>Bathinda</td>
                <td>₹40 Lakh</td>
                <td>₹35 Lakh</td>
                <td>₹28 Lakh</td>
                <td>87.5%</td>
                <td>80%</td>
              </tr>
              <tr>
                <td>Gurdaspur</td>
                <td>₹35 Lakh</td>
                <td>₹30 Lakh</td>
                <td>₹25 Lakh</td>
                <td>85.71%</td>
                <td>83.33%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Punjab Budget Transparency Portal | Government of Punjab</p>
        <p>Last Updated: {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
}
