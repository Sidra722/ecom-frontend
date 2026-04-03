import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/auth';
import { CATEGORIES, CATEGORY_IDS, CATEGORY_ICONS } from '../constants/categories';

function Navbar({ user, setUser }) {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  const scrollTo = (id) => {
    setDropdownOpen(null);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar navbar-glass">
      <div className="nav-left">
        <Link to="/" className="logo">
          <span className="logo-icon">🍕</span>
          Pizza Hut
        </Link>
        <div className="nav-categories">
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className="nav-cat-wrap"
              onMouseEnter={() => setDropdownOpen(cat)}
              onMouseLeave={() => setDropdownOpen(null)}
            >
              <button
                className="nav-cat-btn"
                onClick={() => scrollTo(CATEGORY_IDS[cat] || cat.toLowerCase().replace(/\s+/g, '-'))}
              >
                <span className="nav-cat-icon">{CATEGORY_ICONS[cat]}</span>
                {cat}
              </button>
              <div className={`nav-dropdown ${dropdownOpen === cat ? 'open' : ''}`}>
                <span>Browse {cat}</span>
                <button onClick={() => scrollTo(CATEGORY_IDS[cat] || cat.toLowerCase().replace(/\s+/g, '-'))}>
                  Go to section →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="nav-right">
        <Link to="/#cart" className="nav-link nav-cart">
          🛒 Cart
        </Link>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">My Dashboard</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-link">Admin Panel</Link>
            )}
            <span className="welcome">Hi, {user.name}</span>
            <button className="secondary-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="primary-btn">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
