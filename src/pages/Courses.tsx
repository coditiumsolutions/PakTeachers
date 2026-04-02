import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

// Theme toggle hook
function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark'
    }
    return false
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(!isDark)
  return { isDark, toggleTheme }
}

interface Course {
  id: number
  title: string
  instructor: string
  category: string
  price: number
  originalPrice?: number
  duration: string
  level: string
  students: number
  rating: number
  image: string
  features: string[]
  isPopular?: boolean
  isQuran?: boolean
}

function Courses() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const { isDark, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const courses: Course[] = [
    // Quran Teaching Courses
    {
      id: 1,
      title: 'Quran Recitation (Nazira)',
      instructor: 'Qari Muhammad Ibrahim',
      category: 'quran',
      price: 2500,
      duration: '8 Weeks',
      level: 'Beginner',
      students: 156,
      rating: 4.9,
      image: '📖',
      features: ['Basic Arabic pronunciation', 'Tajweed fundamentals', 'Daily practice sessions', 'One-on-one feedback'],
      isPopular: true,
      isQuran: true
    },
    {
      id: 2,
      title: 'Tajweed Mastery Course',
      instructor: 'Qari Ahmed Hassan',
      category: 'quran',
      price: 3500,
      originalPrice: 4500,
      duration: '12 Weeks',
      level: 'Intermediate',
      students: 98,
      rating: 5.0,
      image: '📿',
      features: ['Advanced Tajweed rules', 'Practical application', 'Recording analysis', 'Certificate included'],
      isQuran: true
    },
    {
      id: 3,
      title: 'Hifz Program (Memorization)',
      instructor: 'Qari Abdul Rahman',
      category: 'quran',
      price: 5000,
      duration: 'Ongoing',
      level: 'All Levels',
      students: 72,
      rating: 4.8,
      image: '⭐',
      features: ['Structured memorization plan', 'Daily revision sessions', 'Progress tracking', 'Parent reports'],
      isPopular: true,
      isQuran: true
    },
    {
      id: 4,
      title: 'Quran Translation & Tafseer',
      instructor: 'Mufti Tariq Mahmood',
      category: 'quran',
      price: 4000,
      duration: '16 Weeks',
      level: 'Advanced',
      students: 64,
      rating: 4.9,
      image: '📚',
      features: ['Verse-by-verse explanation', 'Historical context', 'Practical application', 'Discussion sessions'],
      isQuran: true
    },
    // Academic Courses
    {
      id: 5,
      title: 'Mathematics - Complete Course',
      instructor: 'Mr. Ahmed Khan',
      category: 'academic',
      price: 3000,
      originalPrice: 4000,
      duration: '12 Weeks',
      level: 'Grades 6-10',
      students: 234,
      rating: 4.7,
      image: '📐',
      features: ['Algebra & Geometry', 'Problem-solving techniques', 'Practice worksheets', 'Weekly tests'],
      isPopular: true
    },
    {
      id: 6,
      title: 'Physics - Mechanics & Beyond',
      instructor: 'Mr. Hassan Raza',
      category: 'academic',
      price: 3500,
      duration: '10 Weeks',
      level: 'Grades 9-12',
      students: 187,
      rating: 4.8,
      image: '⚛️',
      features: ['Conceptual understanding', 'Numerical problem solving', 'Lab demonstrations', 'Exam preparation'],
    },
    {
      id: 7,
      title: 'Chemistry - Organic & Inorganic',
      instructor: 'Dr. Ayesha Malik',
      category: 'academic',
      price: 3500,
      duration: '10 Weeks',
      level: 'Grades 9-12',
      students: 156,
      rating: 4.6,
      image: '🧪',
      features: ['Chemical reactions', 'Periodic table mastery', 'Practical experiments', 'Formula techniques'],
    },
    {
      id: 8,
      title: 'English Literature & Composition',
      instructor: 'Ms. Fatima Ali',
      category: 'academic',
      price: 2800,
      duration: '8 Weeks',
      level: 'Grades 6-12',
      students: 203,
      rating: 4.7,
      image: '📝',
      features: ['Classic literature', 'Essay writing', 'Grammar mastery', 'Creative writing'],
    },
    {
      id: 9,
      title: 'Computer Science - Python',
      instructor: 'Mr. Usman Tariq',
      category: 'academic',
      price: 4500,
      originalPrice: 6000,
      duration: '16 Weeks',
      level: 'Beginner to Advanced',
      students: 312,
      rating: 4.9,
      image: '💻',
      features: ['Python fundamentals', 'Project-based learning', 'Real-world applications', 'Portfolio building'],
      isPopular: true
    },
    {
      id: 10,
      title: 'Biology - Human Anatomy',
      instructor: 'Dr. Zara Ahmed',
      category: 'academic',
      price: 3200,
      duration: '10 Weeks',
      level: 'Grades 9-12',
      students: 145,
      rating: 4.8,
      image: '🧬',
      features: ['Body systems', 'Cell biology', 'Genetics basics', 'Medical terminology'],
    },
    {
      id: 11,
      title: 'Urdu Language & Literature',
      instructor: 'Ms. Khadija Siddiqui',
      category: 'academic',
      price: 2500,
      duration: '8 Weeks',
      level: 'All Levels',
      students: 178,
      rating: 4.6,
      image: '📕',
      features: ['Urdu grammar', 'Poetry analysis', 'Essay writing', 'Comprehension skills'],
    },
    {
      id: 12,
      title: 'Islamic Studies',
      instructor: 'Mufti Abdullah',
      category: 'academic',
      price: 2000,
      duration: '8 Weeks',
      level: 'All Levels',
      students: 267,
      rating: 4.9,
      image: '🕌',
      features: ['Seerah of Prophet', 'Islamic history', 'Fiqh basics', 'Daily duas'],
    }
  ]

  const categories = [
    { id: 'all', name: 'All Courses', icon: '📚' },
    { id: 'quran', name: 'Quran Teaching', icon: '📖' },
    { id: 'academic', name: 'Academic Courses', icon: '🎓' }
  ]

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory)

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`
  }

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

            <div className="header-actions">
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <span className="theme-icon">{isDark ? '☀️' : '🌙'}</span>
              </button>
            </div>
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
      <section className="page-hero courses-hero">
        <div className="container">
          <div className="courses-hero-content">
            <div className="courses-hero-text">
              <span className="hero-badge">📚 100+ Courses Available</span>
              <h1 className="page-title">Our Courses</h1>
              <p className="page-subtitle">
                Choose from our wide range of Quran teaching and academic courses designed to help you excel
              </p>
              <div className="course-categories-preview">
                <div className="category-pill">
                  <span>📖</span> Quran Teaching
                </div>
                <div className="category-pill">
                  <span>📐</span> Mathematics
                </div>
                <div className="category-pill">
                  <span>🔬</span> Sciences
                </div>
                <div className="category-pill">
                  <span>💻</span> Computer Science
                </div>
                <div className="category-pill">
                  <span>📝</span> Languages
                </div>
              </div>
            </div>
            <div className="courses-hero-visual">
              <div className="course-stack">
                <div className="stack-card card-back">
                  <span className="stack-icon">📖</span>
                  <span className="stack-label">Quran</span>
                </div>
                <div className="stack-card card-middle">
                  <span className="stack-icon">📐</span>
                  <span className="stack-label">Math</span>
                </div>
                <div className="stack-card card-front">
                  <span className="stack-icon">🔬</span>
                  <span className="stack-label">Science</span>
                  <span className="stack-badge">Popular</span>
                </div>
              </div>
              <div className="floating-stat stat-left">
                <span className="stat-icon">👥</span>
                <span className="stat-text">15K+ Enrollments</span>
              </div>
              <div className="floating-stat stat-right">
                <span className="stat-icon">🏆</span>
                <span className="stat-text">Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section category-filter-section">
        <div className="container">
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="section courses-grid-section">
        <div className="container">
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <div key={course.id} className={`course-item-card ${course.isPopular ? 'popular' : ''} ${course.isQuran ? 'quran-course' : ''}`}>
                {course.isPopular && (
                  <div className="popular-badge">
                    <span>⭐</span> Popular
                  </div>
                )}
                {course.originalPrice && (
                  <div className="discount-badge">
                    Save {Math.round((1 - course.price / course.originalPrice) * 100)}%
                  </div>
                )}
                <div className="course-item-image">
                  <span className="course-item-icon">{course.image}</span>
                  {course.isQuran && (
                    <span className="quran-tag">🌙 Quran Course</span>
                  )}
                </div>
                <div className="course-item-content">
                  <div className="course-item-header">
                    <span className="course-item-category">{course.category === 'quran' ? 'Quran Teaching' : 'Academic'}</span>
                    <span className="course-item-level">{course.level}</span>
                  </div>
                  <h3 className="course-item-title">{course.title}</h3>
                  <p className="course-item-instructor">👨‍🏫 {course.instructor}</p>
                  
                  <div className="course-item-meta">
                    <div className="course-item-stat">
                      <span className="stat-icon">⏱️</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="course-item-stat">
                      <span className="stat-icon">👥</span>
                      <span>{course.students} students</span>
                    </div>
                    <div className="course-item-stat">
                      <span className="stat-icon">⭐</span>
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <ul className="course-item-features">
                    {course.features.map((feature, index) => (
                      <li key={index}>
                        <span className="check-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="course-item-pricing">
                    {course.originalPrice && (
                      <span className="original-price">{formatPrice(course.originalPrice)}</span>
                    )}
                    <span className="current-price">{formatPrice(course.price)}</span>
                    <span className="price-period">/ course</span>
                  </div>

                  <button className="btn btn-primary btn-block">Register Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section why-choose-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Our Courses?</h2>
            <p className="section-subtitle">
              Quality education with flexible learning options
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>Personalized Attention</h3>
              <p>Small class sizes ensure each student gets individual focus from instructors</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📅</div>
              <h3>Flexible Schedule</h3>
              <p>Choose from multiple time slots that fit your busy lifestyle</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🏆</div>
              <h3>Certified Instructors</h3>
              <p>Learn from qualified teachers with proven track records</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💻</div>
              <h3>Modern Platform</h3>
              <p>Access classes via Zoom or Google Meet with recorded sessions</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h3>Progress Tracking</h3>
              <p>Regular assessments and detailed progress reports for parents</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Affordable Pricing</h3>
              <p>Quality education at competitive prices with payment plans</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration CTA Section */}
      <section className="section registration-cta-section courses-cta">
        <div className="container">
          <div className="registration-content">
            <h2 className="registration-title">Start Your Learning Journey Today</h2>
            <p className="registration-subtitle">
              Enroll in any course and get instant access to all learning materials. 
              Secure your spot with our easy registration process.
            </p>
            <div className="registration-form">
              <div className="form-row">
                <input type="text" placeholder="Your Name" className="form-input" />
                <input type="email" placeholder="Email Address" className="form-input" />
              </div>
              <div className="form-row">
                <input type="tel" placeholder="Phone Number" className="form-input" />
                <select className="form-input">
                  <option value="">Select a Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary btn-lg btn-block">Register Now</button>
            </div>
            <p className="form-note">
              💬 Need help choosing? Contact us at +92 123 4567890 or info@pakteachers.com
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Courses
