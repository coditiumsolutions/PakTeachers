import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import School from './pages/School'
import Courses from './pages/Courses'
import Trial from './pages/Trial'
import SoftwareSupport from './pages/SoftwareSupport'
import LMS from './pages/LMS'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <div className="app">
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
      <section className="hero" id="home">
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">🎓 Pakistan's Premier Online School</span>
            <h1 className="hero-title">
              Empowering Pakistan's Future Through Education
            </h1>
            <p className="hero-subtitle">
              Join Pakistan's premier online learning platform connecting students with expert teachers. From primary schooling to advanced courses, we're committed to making quality education accessible to every learner across the nation.
            </p>
            <div className="hero-buttons">
              <Link to="/school" className="btn btn-primary btn-lg">Start Learning</Link>
              <Link to="/courses" className="btn btn-outline btn-lg">View Courses</Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Teachers</span>
              </div>
              <div className="stat">
                <span className="stat-number">100+</span>
                <span className="stat-label">Courses</span>
              </div>
            </div>
            <div className="hero-trust-badges">
              <div className="trust-badge">
                <span className="trust-icon">✓</span>
                <span>Verified Teachers</span>
              </div>
              <div className="trust-badge">
                <span className="trust-icon">✓</span>
                <span>Certified Courses</span>
              </div>
              <div className="trust-badge">
                <span className="trust-icon">✓</span>
                <span>Flexible Learning</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-visual-composition">
              <div className="main-hero-card">
                <div className="card-header">
                  <span className="card-dot red"></span>
                  <span className="card-dot yellow"></span>
                  <span className="card-dot green"></span>
                </div>
                <div className="card-body">
                  <div className="student-profile">
                    <div className="avatar-placeholder">👨‍🎓</div>
                    <div className="profile-info">
                      <span className="profile-name">Student Dashboard</span>
                      <span className="profile-status">● Online Learning</span>
                    </div>
                  </div>
                  <div className="progress-section">
                    <div className="progress-item">
                      <span className="progress-label">Mathematics</span>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: '75%' }}></div>
                      </div>
                      <span className="progress-value">75%</span>
                    </div>
                    <div className="progress-item">
                      <span className="progress-label">Science</span>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: '60%' }}></div>
                      </div>
                      <span className="progress-value">60%</span>
                    </div>
                    <div className="progress-item">
                      <span className="progress-label">English</span>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: '85%' }}></div>
                      </div>
                      <span className="progress-value">85%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="floating-card card-top">
                <span className="float-icon">📚</span>
                <div>
                  <span className="float-title">Live Classes</span>
                  <span className="float-subtitle">12 Today</span>
                </div>
              </div>
              <div className="floating-card card-bottom">
                <span className="float-icon">🏆</span>
                <div>
                  <span className="float-title">Achievement</span>
                  <span className="float-subtitle">Top Student!</span>
                </div>
              </div>
              <div className="floating-badge badge-rating">⭐ 4.9 Rating</div>
              <div className="floating-badge badge-courses">📖 100+ Courses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="school">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose PakTeachers?</h2>
            <p className="section-subtitle">
              We combine experienced educators with modern technology to deliver an exceptional learning experience tailored to your needs.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3 className="feature-title">Expert Teachers</h3>
              <p className="feature-text">
                Learn from certified educators with years of teaching experience, dedicated to helping you achieve academic excellence.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Online Learning</h3>
              <p className="feature-text">
                Attend live interactive classes from anywhere using Zoom or Google Meet, with recorded sessions for later review.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📜</div>
              <h3 className="feature-title">Certified Courses</h3>
              <p className="feature-text">
                Earn recognized certificates upon course completion, boosting your academic and professional credentials.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3 className="feature-title">Flexible Schedule</h3>
              <p className="feature-text">
                Choose from multiple time slots and learn at your own pace with our flexible class scheduling options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container about-content">
          <div className="about-image">
            <div className="about-image-placeholder">
              <span className="placeholder-icon">📖</span>
            </div>
          </div>
          <div className="about-text">
            <h2 className="section-title">About Our School</h2>
            <p>
              PakTeachers is a pioneering online education platform dedicated to bridging the learning gap across Pakistan. Since our inception, we've been committed to providing accessible, high-quality education to students from all walks of life.
            </p>
            <p>
              Our comprehensive curriculum spans from primary schooling to advanced academic courses, alongside specialized Quran teaching programs. We leverage cutting-edge technology and proven pedagogical methods to ensure every student receives personalized attention.
            </p>
            <p>
              With a team of over 500 certified educators and a growing community of 10,000+ students, we're building a future where quality education knows no boundaries. Join us on this transformative journey of learning and discovery.
            </p>
            <Link to="/school" className="btn btn-primary">Read More</Link>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="courses" id="courses">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Courses</h2>
            <p className="section-subtitle">
              Explore our diverse range of academic and Quranic courses designed to nurture your potential.
            </p>
          </div>
          <div className="courses-grid">
            <div className="course-card">
              <div className="course-badge">Popular</div>
              <div className="course-image">
                <span className="course-icon">📐</span>
              </div>
              <div className="course-content">
                <h3 className="course-title">Mathematics</h3>
                <p className="course-description">
                  From algebra to calculus, master mathematical concepts with step-by-step guidance and practical problem-solving.
                </p>
                <div className="course-meta">
                  <span className="course-level">Beginner to Advanced</span>
                  <span className="course-duration">12 Weeks</span>
                </div>
              </div>
            </div>
            <div className="course-card">
              <div className="course-image">
                <span className="course-icon">🔬</span>
              </div>
              <div className="course-content">
                <h3 className="course-title">Science</h3>
                <p className="course-description">
                  Dive into physics, chemistry, and biology with interactive lessons that bring scientific concepts to life.
                </p>
                <div className="course-meta">
                  <span className="course-level">All Levels</span>
                  <span className="course-duration">10 Weeks</span>
                </div>
              </div>
            </div>
            <div className="course-card">
              <div className="course-image">
                <span className="course-icon">📖</span>
              </div>
              <div className="course-content">
                <h3 className="course-title">English Literature</h3>
                <p className="course-description">
                  Explore classic and contemporary literature while developing critical thinking and composition skills.
                </p>
                <div className="course-meta">
                  <span className="course-level">Intermediate</span>
                  <span className="course-duration">8 Weeks</span>
                </div>
              </div>
            </div>
            <div className="course-card">
              <div className="course-image">
                <span className="course-icon">💻</span>
              </div>
              <div className="course-content">
                <h3 className="course-title">Computer Science</h3>
                <p className="course-description">
                  Learn programming, algorithms, and computational thinking with hands-on projects and real-world applications.
                </p>
                <div className="course-meta">
                  <span className="course-level">Beginner to Advanced</span>
                  <span className="course-duration">16 Weeks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quran Teaching Section */}
      <section className="quran-section" id="quran">
        <div className="container quran-content">
          <div className="quran-text">
            <h2 className="section-title">Quran Teaching</h2>
            <p>
              Our Quran teaching program offers comprehensive Islamic education delivered by qualified Qaris and experienced instructors. Whether you're a beginner learning to recite or seeking to deepen your understanding of Tajweed and Tafseer, we have a course for you.
            </p>
            <ul className="quran-features">
              <li>
                <span className="check-icon">✓</span>
                <span>One-on-one Quran recitation classes with personalized feedback</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>Comprehensive Tajweed and Hifz memorization programs</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>Certified Qaris with years of teaching experience</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>Flexible scheduling for students of all ages</span>
              </li>
            </ul>
            <Link to="/courses" className="btn btn-primary">View Quran Courses</Link>
          </div>
          <div className="quran-image">
            <div className="quran-image-placeholder">
              <span className="placeholder-icon">📿</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trial Classes CTA */}
      <section className="trial-cta" id="trial">
        <div className="container">
          <div className="trial-content">
            <h2 className="trial-title">Try a Free Trial Class</h2>
            <p className="trial-subtitle">
              Experience our teaching quality firsthand with a complimentary trial session. Meet our instructors, explore our platform, and discover how PakTeachers can help you achieve your educational goals.
            </p>
            <div className="trial-buttons">
              <button className="btn btn-light btn-lg">Book Free Trial</button>
              <button className="btn btn-outline-light btn-lg">View Schedule</button>
            </div>
          </div>
        </div>
      </section>

      {/* LMS Section */}
      <section className="lms-section" id="lms">
        <div className="container">
          <div className="lms-content">
            <div className="lms-image">
              <div className="lms-image-placeholder">
                <span className="placeholder-icon">🖥️</span>
              </div>
            </div>
            <div className="lms-text">
              <h2 className="section-title">Learning Management System</h2>
              <p>
                Our state-of-the-art Learning Management System provides a centralized hub for all your educational needs. Access course materials, submit assignments, track your progress, and communicate with teachers—all in one place.
              </p>
              <ul className="lms-features">
                <li>
                  <span className="check-icon">✓</span>
                  <span>Track your progress in real-time with detailed analytics</span>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <span>Access course materials, recordings, and resources anytime</span>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <span>Submit assignments online and receive timely feedback</span>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <span>Interactive quizzes and assessments to test your knowledge</span>
                </li>
              </ul>
              <button className="btn btn-primary">Access LMS</button>
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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/school" element={<School />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/trial" element={<Trial />} />
        <Route path="/software-support" element={<SoftwareSupport />} />
        <Route path="/lms/*" element={<LMS />} />
      </Routes>
    </Router>
  )
}

export default App
