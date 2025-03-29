// components/Navbar.js
import React, { useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
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
              style={{ cursor: 'pointer' }}
            >
              Athul Colors
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
            <li>
              <ScrollLink
                onClick={openBar}
                to="contact"
                spy={true}
                smooth={true}
                duration={1000}
                activeClass="active"
              >
                Contact
              </ScrollLink>
            </li>
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
          </ul>
          <div className="button" onClick={openBar}>
            <div className="burger"></div>
            <div className="burger"></div>
            <div className="burger"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
