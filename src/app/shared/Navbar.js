import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import { saveCustomerInfo } from "../../store/actions/AuthAction";
import "react-notifications-component/dist/theme.css";
import "../../assets/styles/animate.min.css";

import { ReactNotifications } from "react-notifications-component";

class Navbar extends Component {
  toggleOffcanvas() {
    document.querySelector(".sidebar-offcanvas").classList.toggle("active");
  }
  toggleRightSidebar() {
    document.querySelector(".right-sidebar").classList.toggle("open");
  }
  render() {
    return (
      <>
        <ReactNotifications />
        <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
          <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
            <Link className="navbar-brand brand-logo" to="/">
              <img src={require("../../assets/images/logo.png")} alt="logo" />
            </Link>
            <Link className="navbar-brand brand-logo-mini" to="/">
              <img
                src={require("../../assets/images/logo-mini.png")}
                alt="logo"
              />
            </Link>
          </div>
          <div className="navbar-menu-wrapper d-flex align-items-stretch">
            <button
              className="navbar-toggler navbar-toggler align-self-center"
              type="button"
              onClick={() =>
                document.body.classList.toggle("sidebar-icon-only")
              }
            >
              <span className="mdi mdi-menu"></span>
            </button>
            <div className="search-field d-none d-md-block">
              <form className="d-flex align-items-center h-100" action="#">
                <div className="input-group">
                  <div className="input-group-prepend bg-transparent">
                    <i className="input-group-text border-0 mdi mdi-magnify"></i>
                  </div>
                  <input
                    type="text"
                    className="form-control bg-transparent border-0"
                    placeholder="Tìm kiếm"
                  />
                </div>
              </form>
            </div>
            <ul className="navbar-nav navbar-nav-right">
              <li className="nav-item nav-profile">
                <Dropdown alignRight>
                  <Dropdown.Toggle className="nav-link">
                    <div className="nav-profile-img">
                      <img
                        src={require("../../assets/images/faces/face1.jpg")}
                        alt="user"
                      />
                      <span className="availability-status online"></span>
                    </div>
                    <div className="nav-profile-text">
                      <p className="mb-1 text-black">
                        <Trans>David Greymaax</Trans>
                      </p>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="navbar-dropdown">
                    <Dropdown.Item
                      href="!#"
                      onClick={(evt) => evt.preventDefault()}
                    >
                      <i className="mdi mdi-cached mr-2 text-success"></i>
                      <Trans>Activity Log</Trans>
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="!#"
                      onClick={(evt) => evt.preventDefault()}
                    >
                      <i className="mdi mdi-logout mr-2 text-primary"></i>
                      <Trans>Signout</Trans>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>

              <li className="nav-item nav-logout d-none d-lg-block">
                <a
                  className="nav-link"
                  href="!#"
                  onClick={() =>
                    this.props.saveCustomerInfo({ token: "", fullName: "" })
                  }
                >
                  <i className="mdi mdi-power"></i>
                </a>
              </li>
            </ul>
            <button
              className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
              type="button"
              onClick={this.toggleOffcanvas}
            >
              <span className="mdi mdi-menu"></span>
            </button>
          </div>
        </nav>
      </>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    saveCustomerInfo: (data) => dispatch(saveCustomerInfo(data)),
  };
};

export default connect(null, mapDispatchToProps)(Navbar);
