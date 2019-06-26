import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../actions/auth";

class MyNavbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;

        const authLinks = (
            <Nav>
                <NavDropdown title={user ? "Welcome " + user.username : ""} id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.4">Test</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={this.props.logout_dispatch}>Logout</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        );

        const guestLinks = (
            <Nav>
                <NavLink className="nav-link" to="/login">Login</NavLink>
                <NavLink className="nav-link" to="/register">Register</NavLink>
            </Nav>
        );

        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">WebRTC</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Link className="nav-link" to="/">Home</Link>
                    </Nav>
                    {(isAuthenticated) ? authLinks : guestLinks }
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    logout_dispatch: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(MyNavbar);