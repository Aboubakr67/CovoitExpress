import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <a className="mb-0 me-3">Mentions légales</a>
            <a className="mb-0">CGU</a>
          </div>
          <div className="col-md-6 text-md-end">
            <img
              src="/img/logo4.png"
              alt="Logo"
              className="img-fluid"
              style={{ maxWidth: "10%" }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
