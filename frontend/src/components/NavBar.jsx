import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

function NavBar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src="logo.png" alt="Pay-As-You-Go Logo" height="40" />
          {' '}Pay-As-You-Go
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">

            {/* Public pages */}
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>

            {/* Pages visible only to logged-in users */}
            {isLoggedIn && (
              <>
                <Nav.Link as={NavLink} to="/invoices" end>
                  Invoices
                </Nav.Link>
                <Nav.Link as={NavLink} to="/clients" end>
                  Clients
                </Nav.Link>
                <Nav.Link as={NavLink} to="/payments" end>
                  Payments
                </Nav.Link>
                <Nav.Link as={NavLink} to="/reports" end>
                  Reports
                </Nav.Link>
                <Nav.Link as={NavLink} to="/profile" end>
                  Profile
                </Nav.Link>
              </>
            )}

            {/* Register visible only to users not logged in */}
            {!isLoggedIn && (
              <Nav.Link as={NavLink} to="/register" end>
                Register
              </Nav.Link>
            )}

            {/* Login / Logout */}
            {isLoggedIn ? (
              <Nav.Link onClick={handleLogoutClick} style={{ cursor: 'pointer' }}>
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link as={NavLink} to="/login" end>
                Login
              </Nav.Link>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
