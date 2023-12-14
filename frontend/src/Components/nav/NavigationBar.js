import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const NavigationBar = () => {
    return (
        <Navbar bg="primary" expand="lg" fixed="top">
            <Container>
                {/* Logo/image à gauche du menu */}
                <Navbar.Brand href="#home">
                    <img
                        src="../../img/covoit_express.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="Logo"
                    />{' '}
                    Votre Marque
                </Navbar.Brand>

                {/* Bouton de basculement pour les écrans plus petits */}
                <Navbar.Toggle aria-controls="navbarResponsive" />

                {/* Contenu du menu */}
                <Navbar.Collapse id="navbarResponsive">
                    <Nav className="ml-auto">
                        <Nav.Link href="#home">Accueil</Nav.Link>
                        <Nav.Link href="#about">À Propos</Nav.Link>
                        <Nav.Link href="#services">Services</Nav.Link>
                        <Nav.Link href="#contact">Contact</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
