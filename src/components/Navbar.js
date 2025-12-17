// components/Navbar.js
import React, { useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../assets/ac_logo.jpg';

function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("user")) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/")
    window.location.reload(); // Simple reload to update state
  };
  useEffect(() => {
    const handleScroll = () => {
      const gotop = document.querySelector('.gotop');
      const nav = document.querySelector('.navbar');

      if (window.screen.width < 768 && window.scrollY > 690) {
        gotop?.classList.add('display');
        nav?.classList.add('navopened');
      } else if (window.screen.width >= 768 && window.scrollY > 220) {
        gotop?.classList.add('display');
        nav?.classList.add('navopened');
      } else {
        gotop?.classList.remove('display');
        nav?.classList.remove('navopened');
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function openBar() {
    const bar = document.querySelector('.bar');
    bar?.classList.toggle('opened');
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="row">
          <h1 className="logo">
            <ScrollLink
              spy={true}
              smooth={true}
              duration={1000}
              to="headerbg"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <img
                src={logo}
                alt="AC Logo"
                style={{
                  height: '45px',
                  width: 'auto',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.2)'
                }}
              />
              Athul Colours
            </ScrollLink>
          </h1>
          <ul className="bar">
            <li>
              <ScrollLink
                onClick={openBar}
                activeClass="active"
                spy={true}
                smooth={true}
                duration={1000}
                to="headerbg"
              >
                Home
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                onClick={openBar}
                activeClass="active"
                to="services"
                spy={true}
                smooth={true}
                duration={1000}
              >
                Products
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                onClick={openBar}
                to="about-scroll"
                spy={true}
                smooth={true}
                duration={1000}
                activeClass="active"
              >
                About
              </ScrollLink>
            </li>

            {user ? (
              <>
                {user.isAdmin ? (
                  <li>
                    <RouterLink onClick={openBar} to="/AdminPage" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', color: '#0ea5e9', verticalAlign: 'middle' }}>
                      <span>⚙️</span> Admin
                    </RouterLink>
                  </li>
                ) : (
                  <li>
                    <RouterLink onClick={openBar} to={`/Order/${user.id || user._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', verticalAlign: 'middle' }}>
                      <span>🛒</span> Cart
                    </RouterLink>
                  </li>
                )}
                <li>
                  <span onClick={() => { openBar(); handleLogout() }} style={{ cursor: 'pointer', color: '#fff', fontWeight: 'bold' }}>
                    Logout
                  </span>
                </li>
              </>
            ) : (
              <>
                <li>
                  <RouterLink onClick={openBar} to="/login">
                    Login
                  </RouterLink>
                </li>
                <li>
                  <RouterLink onClick={openBar} to="/signup">
                    Sign Up
                  </RouterLink>
                </li>
              </>
            )}
          </ul>
          <div className="button" onClick={openBar}>
            <div className="burger"></div>
            <div className="burger"></div>
            <div className="burger"></div>
          </div>
        </div >
      </div >
    </nav >
  );
}

export default Navbar;
