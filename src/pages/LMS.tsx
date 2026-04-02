import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

type UserType = 'student' | 'teacher' | 'admin' | null

function LMS() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userType, setUserType] = useState<UserType>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password && userType) {
      // In production, validate credentials with backend
      setIsLoggedIn(true)
      setError('')
    } else {
      setError('Please fill in all fields')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setEmail('')
    setPassword('')
    setUserType(null)
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="page-wrapper">
        {/* Header */}
        <header className="header">
          <div className="container header-content">
            <div className="logo">
              <span className="logo-icon">📚</span>
              <span className="logo-text">PakTeachers</span>
            </div>
            
            <div className={`nav-wrapper ${mobileMenuOpen ? 'nav-open' : ''}`}>
              <nav className="nav">
                <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link to="/school" className="nav-link" onClick={() => setMobileMenuOpen(false)}>School</Link>
                <Link to="/courses" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
                <Link to="/trial" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Trial Classes</Link>
                <Link to="/software-support" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Software Support</Link>
                <Link to="/lms" className="nav-link" onClick={() => setMobileMenuOpen(false)}>LMS</Link>
              </nav>
            </div>

            <button
              className="mobile-menu-btn"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="page-hero lms-hero">
          <div className="container">
            <div className="lms-hero-content">
              <div className="lms-hero-text">
                <span className="hero-badge">🖥️ Digital Learning Platform</span>
                <h1 className="page-title">Learning Management System</h1>
                <p className="page-subtitle">
                  Access your courses, track progress, submit assignments, and manage your learning journey all in one place
                </p>
                <div className="lms-features-preview">
                  <div className="lms-feature-item">
                    <span className="feature-icon">📚</span>
                    <span>Course Materials</span>
                  </div>
                  <div className="lms-feature-item">
                    <span className="feature-icon">📝</span>
                    <span>Assignments</span>
                  </div>
                  <div className="lms-feature-item">
                    <span className="feature-icon">📊</span>
                    <span>Progress Tracking</span>
                  </div>
                  <div className="lms-feature-item">
                    <span className="feature-icon">💬</span>
                    <span>Communication</span>
                  </div>
                </div>
              </div>
              <div className="lms-hero-visual">
                <div className="dashboard-preview">
                  <div className="preview-sidebar">
                    <div className="sidebar-item active">
                      <span>📊</span> Dashboard
                    </div>
                    <div className="sidebar-item">
                      <span>📚</span> Courses
                    </div>
                    <div className="sidebar-item">
                      <span>📝</span> Assignments
                    </div>
                    <div className="sidebar-item">
                      <span>🏆</span> Grades
                    </div>
                  </div>
                  <div className="preview-main">
                    <div className="preview-header">
                      <span className="preview-title">Welcome back!</span>
                      <span className="preview-avatar">👨‍🎓</span>
                    </div>
                    <div className="preview-stats">
                      <div className="mini-stat">
                        <span className="mini-stat-value">5</span>
                        <span className="mini-stat-label">Courses</span>
                      </div>
                      <div className="mini-stat">
                        <span className="mini-stat-value">24</span>
                        <span className="mini-stat-label">Lessons</span>
                      </div>
                      <div className="mini-stat">
                        <span className="mini-stat-value">87%</span>
                        <span className="mini-stat-label">Average</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="floating-notification">
                  <span className="notif-icon">📬</span>
                  <span className="notif-text">New assignment posted!</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Login Section */}
        <section className="section lms-login-section">
          <div className="container">
            <div className="login-container">
              {/* User Type Selection */}
              <div className="user-type-selector">
                <button 
                  className={`user-type-btn ${userType === 'student' ? 'active' : ''}`}
                  onClick={() => setUserType('student')}
                >
                  <span className="user-icon">👨‍🎓</span>
                  Student
                </button>
                <button 
                  className={`user-type-btn ${userType === 'teacher' ? 'active' : ''}`}
                  onClick={() => setUserType('teacher')}
                >
                  <span className="user-icon">👨‍🏫</span>
                  Teacher
                </button>
                <button 
                  className={`user-type-btn ${userType === 'admin' ? 'active' : ''}`}
                  onClick={() => setUserType('admin')}
                >
                  <span className="user-icon">👤</span>
                  Admin
                </button>
              </div>

              {/* Login Form */}
              {userType && (
                <div className="login-form-wrapper">
                  <h2 className="login-title">
                    {userType === 'student' && 'Student Login'}
                    {userType === 'teacher' && 'Teacher Login'}
                    {userType === 'admin' && 'Admin Login'}
                  </h2>
                  <p className="login-subtitle">
                    Enter your credentials to access the {userType} portal
                  </p>
                  
                  <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input 
                        type="email" 
                        id="email"
                        className="form-input"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input 
                        type="password" 
                        id="password"
                        className="form-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    {error && <p className="error-message">{error}</p>}
                    
                    <button type="submit" className="btn btn-primary btn-block btn-lg">
                      Login
                    </button>
                  </form>

                  <div className="login-info">
                    <p>📧 Login credentials are issued by the administration.</p>
                    <p>📞 Contact support at +92 123 4567890 for assistance.</p>
                  </div>
                </div>
              )}

              {!userType && (
                <div className="select-user-prompt">
                  <p>Please select your user type to continue</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section lms-features-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">LMS Features</h2>
              <p className="section-subtitle">
                Everything you need for effective online learning and teaching
              </p>
            </div>

            <div className="lms-features-grid">
              <div className="lms-feature-card">
                <div className="feature-card-icon">📚</div>
                <h3>Course Materials</h3>
                <p>Access lecture notes, videos, and resources anytime</p>
              </div>
              <div className="lms-feature-card">
                <div className="feature-card-icon">📝</div>
                <h3>Quizzes & Assignments</h3>
                <p>Submit work and take assessments online</p>
              </div>
              <div className="lms-feature-card">
                <div className="feature-card-icon">📊</div>
                <h3>Progress Tracking</h3>
                <p>Monitor your learning journey and performance</p>
              </div>
              <div className="lms-feature-card">
                <div className="feature-card-icon">💬</div>
                <h3>Communication</h3>
                <p>Connect with teachers and classmates easily</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="logo">
                  <span className="logo-icon">📚</span>
                  <span className="logo-text">PakTeachers</span>
                </div>
                <p className="footer-description">
                  Empowering students across Pakistan with quality online education. Join our growing community of learners today.
                </p>
                <div className="footer-social">
                  <a href="#facebook" className="social-link" aria-label="Facebook">
                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#twitter" className="social-link" aria-label="Twitter">
                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#instagram" className="social-link" aria-label="Instagram">
                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                  <a href="#youtube" className="social-link" aria-label="YouTube">
                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="footer-links">
                <h4>Quick Links</h4>
                <ul>
                  <li><Link to="/school">📖 School</Link></li>
                  <li><Link to="/courses">🎓 Courses</Link></li>
                  <li><a href="#quran">📿 Quran Teaching</a></li>
                  <li><Link to="/trial">🎫 Trial Classes</Link></li>
                  <li><Link to="/software-support">💻 Software Support</Link></li>
                  <li><Link to="/lms">🖥️ LMS</Link></li>
                </ul>
              </div>
              <div className="footer-links">
                <h4>Support</h4>
                <ul>
                  <li><a href="#help">❓ Help Center</a></li>
                  <li><a href="#faq">💬 FAQ</a></li>
                  <li><a href="#contact">📧 Contact Us</a></li>
                  <li><a href="#privacy">🔒 Privacy Policy</a></li>
                  <li><a href="#terms">📄 Terms of Service</a></li>
                </ul>
              </div>
              <div className="footer-links">
                <h4>Contact</h4>
                <ul className="contact-info">
                  <li>
                    <span className="contact-icon">📧</span>
                    <span>info@pakteachers.com</span>
                  </li>
                  <li>
                    <span className="contact-icon">📞</span>
                    <span>+92 123 4567890</span>
                  </li>
                  <li>
                    <span className="contact-icon">📍</span>
                    <span>Lahore, Pakistan</span>
                  </li>
                  <li>
                    <span className="contact-icon">🕐</span>
                    <span>Mon - Sat: 9AM - 6PM</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2026 PakTeachers. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // Logged In - Show Dashboard based on user type
  return (
    <div className="page-wrapper">
      {/* Header */}
      <header className="header">
        <div className="container header-content">
          <div className="logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">PakTeachers LMS</span>
          </div>
          
          <div className={`nav-wrapper ${mobileMenuOpen ? 'nav-open' : ''}`}>
            <nav className="nav">
              <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/lms/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/lms/courses" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
              <Link to="/lms/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
            </nav>

            <button onClick={handleLogout} className="btn btn-outline">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content based on user type */}
      {userType === 'student' && <StudentDashboard userType={userType} />}
      {userType === 'teacher' && <TeacherDashboard userType={userType} />}
      {userType === 'admin' && <AdminDashboard userType={userType} />}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-icon">📚</span>
                <span className="logo-text">PakTeachers</span>
              </div>
              <p className="footer-description">
                Empowering students across Pakistan with quality online education. Join our growing community of learners today.
              </p>
              <div className="footer-social">
                <a href="#facebook" className="social-link" aria-label="Facebook">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#twitter" className="social-link" aria-label="Twitter">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#instagram" className="social-link" aria-label="Instagram">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="#youtube" className="social-link" aria-label="YouTube">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/school">📖 School</Link></li>
                <li><Link to="/courses">🎓 Courses</Link></li>
                <li><a href="#quran">📿 Quran Teaching</a></li>
                <li><Link to="/trial">🎫 Trial Classes</Link></li>
                <li><Link to="/software-support">💻 Software Support</Link></li>
                <li><Link to="/lms">🖥️ LMS</Link></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">❓ Help Center</a></li>
                <li><a href="#faq">💬 FAQ</a></li>
                <li><a href="#contact">📧 Contact Us</a></li>
                <li><a href="#privacy">🔒 Privacy Policy</a></li>
                <li><a href="#terms">📄 Terms of Service</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Contact</h4>
              <ul className="contact-info">
                <li>
                  <span className="contact-icon">📧</span>
                  <span>info@pakteachers.com</span>
                </li>
                <li>
                  <span className="contact-icon">📞</span>
                  <span>+92 123 4567890</span>
                </li>
                <li>
                  <span className="contact-icon">📍</span>
                  <span>Lahore, Pakistan</span>
                </li>
                <li>
                  <span className="contact-icon">🕐</span>
                  <span>Mon - Sat: 9AM - 6PM</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 PakTeachers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Student Dashboard Component
function StudentDashboard({ userType }: { userType: UserType }) {
  return (
    <div className="dashboard-wrapper">
      {/* Student Dashboard */}
      <section className="section dashboard-section">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">👨‍🎓 Student Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back! Track your learning progress</p>
          </div>

          {/* Stats Overview */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <span className="stat-icon">📚</span>
              <div>
                <span className="stat-value">5</span>
                <span className="stat-label">Enrolled Courses</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">✅</span>
              <div>
                <span className="stat-value">24</span>
                <span className="stat-label">Lessons Completed</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📝</span>
              <div>
                <span className="stat-value">8</span>
                <span className="stat-label">Quizzes Taken</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🏆</span>
              <div>
                <span className="stat-value">87%</span>
                <span className="stat-label">Average Score</span>
              </div>
            </div>
          </div>

          {/* My Courses */}
          <div className="dashboard-section-content">
            <h2 className="section-subtitle">📚 My Courses</h2>
            <div className="courses-list">
              <div className="course-list-item">
                <div className="course-list-icon">📐</div>
                <div className="course-list-info">
                  <h3>Mathematics - Algebra</h3>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '65%' }}></div>
                  </div>
                  <span className="progress-text">65% Complete</span>
                </div>
                <Link to="/lms/course" className="btn btn-primary">Continue</Link>
              </div>
              <div className="course-list-item">
                <div className="course-list-icon">🔬</div>
                <div className="course-list-info">
                  <h3>Physics - Mechanics</h3>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '40%' }}></div>
                  </div>
                  <span className="progress-text">40% Complete</span>
                </div>
                <Link to="/lms/course" className="btn btn-primary">Continue</Link>
              </div>
              <div className="course-list-item">
                <div className="course-list-icon">📖</div>
                <div className="course-list-info">
                  <h3>English Literature</h3>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '80%' }}></div>
                  </div>
                  <span className="progress-text">80% Complete</span>
                </div>
                <Link to="/lms/course" className="btn btn-primary">Continue</Link>
              </div>
            </div>
          </div>

          {/* Upcoming Lessons & Quizzes */}
          <div className="dashboard-grid-2">
            <div className="dashboard-card">
              <h3>📅 Upcoming Lessons</h3>
              <ul className="upcoming-list">
                <li className="upcoming-item">
                  <span className="upcoming-date">Mon, 10 AM</span>
                  <span className="upcoming-title">Algebra - Quadratic Equations</span>
                </li>
                <li className="upcoming-item">
                  <span className="upcoming-date">Tue, 2 PM</span>
                  <span className="upcoming-title">Physics - Newton's Laws</span>
                </li>
                <li className="upcoming-item">
                  <span className="upcoming-date">Wed, 11 AM</span>
                  <span className="upcoming-title">English - Shakespeare</span>
                </li>
              </ul>
            </div>
            <div className="dashboard-card">
              <h3>📝 Pending Quizzes</h3>
              <ul className="upcoming-list">
                <li className="upcoming-item">
                  <span className="upcoming-date">Due: Jan 20</span>
                  <span className="upcoming-title">Mathematics - Chapter 5</span>
                </li>
                <li className="upcoming-item">
                  <span className="upcoming-date">Due: Jan 22</span>
                  <span className="upcoming-title">Physics - Motion Quiz</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Teacher Dashboard Component
function TeacherDashboard({ userType }: { userType: UserType }) {
  return (
    <div className="dashboard-wrapper">
      {/* Teacher Dashboard */}
      <section className="section dashboard-section">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">👨‍🏫 Teacher Dashboard</h1>
            <p className="dashboard-subtitle">Manage your classes and track student performance</p>
          </div>

          {/* Stats Overview */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <span className="stat-icon">👥</span>
              <div>
                <span className="stat-value">156</span>
                <span className="stat-label">Total Students</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📚</span>
              <div>
                <span className="stat-value">4</span>
                <span className="stat-label">Active Courses</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📝</span>
              <div>
                <span className="stat-value">12</span>
                <span className="stat-label">Lessons This Week</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⭐</span>
              <div>
                <span className="stat-value">4.8</span>
                <span className="stat-label">Average Rating</span>
              </div>
            </div>
          </div>

          {/* My Courses */}
          <div className="dashboard-section-content">
            <h2 className="section-subtitle">📚 My Courses</h2>
            <div className="courses-list">
              <div className="course-list-item">
                <div className="course-list-icon">📐</div>
                <div className="course-list-info">
                  <h3>Mathematics - Grade 9</h3>
                  <span className="course-students">42 students enrolled</span>
                </div>
                <div className="course-actions">
                  <Link to="/lms/manage" className="btn btn-primary">Manage</Link>
                  <Link to="/lms/performance" className="btn btn-outline">Performance</Link>
                </div>
              </div>
              <div className="course-list-item">
                <div className="course-list-icon">📐</div>
                <div className="course-list-info">
                  <h3>Mathematics - Grade 10</h3>
                  <span className="course-students">38 students enrolled</span>
                </div>
                <div className="course-actions">
                  <Link to="/lms/manage" className="btn btn-primary">Manage</Link>
                  <Link to="/lms/performance" className="btn btn-outline">Performance</Link>
                </div>
              </div>
              <div className="course-list-item">
                <div className="course-list-icon">🔬</div>
                <div className="course-list-info">
                  <h3>Physics - Grade 11</h3>
                  <span className="course-students">35 students enrolled</span>
                </div>
                <div className="course-actions">
                  <Link to="/lms/manage" className="btn btn-primary">Manage</Link>
                  <Link to="/lms/performance" className="btn btn-outline">Performance</Link>
                </div>
              </div>
              <div className="course-list-item">
                <div className="course-list-icon">🔬</div>
                <div className="course-list-info">
                  <h3>Physics - Grade 12</h3>
                  <span className="course-students">41 students enrolled</span>
                </div>
                <div className="course-actions">
                  <Link to="/lms/manage" className="btn btn-primary">Manage</Link>
                  <Link to="/lms/performance" className="btn btn-outline">Performance</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Student Performance & Lesson Management */}
          <div className="dashboard-grid-2">
            <div className="dashboard-card">
              <h3>📊 Recent Student Performance</h3>
              <ul className="performance-list">
                <li className="performance-item">
                  <span className="student-name">Ahmed K.</span>
                  <span className="performance-score">92%</span>
                  <span className="performance-quiz">Math Quiz 5</span>
                </li>
                <li className="performance-item">
                  <span className="student-name">Fatima A.</span>
                  <span className="performance-score">88%</span>
                  <span className="performance-quiz">Physics Test</span>
                </li>
                <li className="performance-item">
                  <span className="student-name">Hassan R.</span>
                  <span className="performance-score">95%</span>
                  <span className="performance-quiz">Algebra Final</span>
                </li>
              </ul>
            </div>
            <div className="dashboard-card">
              <h3>📅 Upcoming Lessons</h3>
              <ul className="upcoming-list">
                <li className="upcoming-item">
                  <span className="upcoming-date">Mon, 10 AM</span>
                  <span className="upcoming-title">Grade 9 - Algebra</span>
                </li>
                <li className="upcoming-item">
                  <span className="upcoming-date">Tue, 2 PM</span>
                  <span className="upcoming-title">Grade 11 - Physics</span>
                </li>
                <li className="upcoming-item">
                  <span className="upcoming-date">Wed, 11 AM</span>
                  <span className="upcoming-title">Grade 10 - Geometry</span>
                </li>
              </ul>
              <Link to="/lms/lessons" className="btn btn-primary btn-block">Manage Lessons</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Admin Dashboard Component
function AdminDashboard({ userType }: { userType: UserType }) {
  return (
    <div className="dashboard-wrapper">
      {/* Admin Dashboard */}
      <section className="section dashboard-section">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">👤 Admin Dashboard</h1>
            <p className="dashboard-subtitle">Monitor teacher performance and manage the platform</p>
          </div>

          {/* Stats Overview */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <span className="stat-icon">👨‍🏫</span>
              <div>
                <span className="stat-value">24</span>
                <span className="stat-label">Total Teachers</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">👨‍🎓</span>
              <div>
                <span className="stat-value">1,247</span>
                <span className="stat-label">Total Students</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📚</span>
              <div>
                <span className="stat-value">48</span>
                <span className="stat-label">Active Courses</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📈</span>
              <div>
                <span className="stat-value">94%</span>
                <span className="stat-label">Platform Uptime</span>
              </div>
            </div>
          </div>

          {/* Teacher Performance */}
          <div className="dashboard-section-content">
            <h2 className="section-subtitle">📊 Teacher Performance Overview</h2>
            <div className="teacher-performance-table">
              <div className="table-header">
                <span>Teacher</span>
                <span>Courses</span>
                <span>Students</span>
                <span>Avg Rating</span>
                <span>Completion Rate</span>
                <span>Status</span>
              </div>
              <div className="table-row">
                <span className="teacher-name">Mr. Ahmed Khan</span>
                <span>3</span>
                <span>142</span>
                <span>⭐ 4.8</span>
                <span>92%</span>
                <span className="status-active">Active</span>
              </div>
              <div className="table-row">
                <span className="teacher-name">Ms. Fatima Ali</span>
                <span>2</span>
                <span>98</span>
                <span>⭐ 4.9</span>
                <span>95%</span>
                <span className="status-active">Active</span>
              </div>
              <div className="table-row">
                <span className="teacher-name">Mr. Hassan Raza</span>
                <span>4</span>
                <span>187</span>
                <span>⭐ 4.7</span>
                <span>89%</span>
                <span className="status-active">Active</span>
              </div>
              <div className="table-row">
                <span className="teacher-name">Dr. Ayesha Malik</span>
                <span>3</span>
                <span>156</span>
                <span>⭐ 4.6</span>
                <span>87%</span>
                <span className="status-active">Active</span>
              </div>
              <div className="table-row">
                <span className="teacher-name">Mr. Usman Tariq</span>
                <span>2</span>
                <span>312</span>
                <span>⭐ 4.9</span>
                <span>94%</span>
                <span className="status-active">Active</span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="dashboard-grid-2">
            <div className="dashboard-card">
              <h3>⚡ Quick Actions</h3>
              <div className="quick-actions">
                <Link to="/lms/teachers" className="action-btn">Manage Teachers</Link>
                <Link to="/lms/students" className="action-btn">Manage Students</Link>
                <Link to="/lms/courses" className="action-btn">Manage Courses</Link>
                <Link to="/lms/credentials" className="action-btn">Issue Credentials</Link>
              </div>
            </div>
            <div className="dashboard-card">
              <h3>📈 Platform Statistics</h3>
              <ul className="stats-list">
                <li className="stats-item">
                  <span className="stats-label">Today's Active Users</span>
                  <span className="stats-value">487</span>
                </li>
                <li className="stats-item">
                  <span className="stats-label">Lessons Conducted (Week)</span>
                  <span className="stats-value">156</span>
                </li>
                <li className="stats-item">
                  <span className="stats-label">New Registrations (Month)</span>
                  <span className="stats-value">89</span>
                </li>
                <li className="stats-item">
                  <span className="stats-label">Avg. Session Duration</span>
                  <span className="stats-value">45 min</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LMS
