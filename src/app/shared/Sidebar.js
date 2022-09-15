import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
// import { Collapse } from "react-bootstrap";
import { Trans } from "react-i18next";

class Sidebar extends Component {
  state = {};

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach((i) => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector("#sidebar").classList.remove("active");
    Object.keys(this.state).forEach((i) => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: "/apps", state: "appsMenuOpen" },
      { path: "/basic-ui", state: "basicUiMenuOpen" },
      { path: "/advanced-ui", state: "advancedUiMenuOpen" },
      { path: "/form-elements", state: "formElementsMenuOpen" },
      { path: "/tables", state: "tablesMenuOpen" },
      { path: "/maps", state: "mapsMenuOpen" },
      { path: "/icons", state: "iconsMenuOpen" },
      { path: "/charts", state: "chartsMenuOpen" },
      { path: "/user-pages", state: "userPagesMenuOpen" },
      { path: "/error-pages", state: "errorPagesMenuOpen" },
      { path: "/general-pages", state: "generalPagesMenuOpen" },
      { path: "/ecommerce", state: "ecommercePagesMenuOpen" },
    ];

    dropdownPaths.forEach((obj) => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true });
      }
    });
  }

  render() {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <ul className="nav">
          <li
            className={
              this.isPathActive("/listVoucher") ? "nav-item active" : "nav-item"
            }
          >
            <Link className="nav-link" to="/listVoucher">
              <span className="menu-title">
                <Trans>Quản lý phát hành voucher</Trans>
              </span>
              <i className="mdi mdi-home menu-icon"></i>
            </Link>
          </li>
          <li
            className={
              this.isPathActive("/listSuppliers")
                ? "nav-item active"
                : "nav-item"
            }
          >
            <Link className="nav-link" to="/listSuppliers">
              <span className="menu-title">
                <Trans>Danh sách nhà cung cấp</Trans>
              </span>
              <i className="mdi mdi-home menu-icon"></i>
            </Link>
          </li>
          <li
            className={
              this.isPathActive("/listMaterial")
                ? "nav-item active"
                : "nav-item"
            }
          >
            <Link className="nav-link" to="/listMaterial">
              <span className="menu-title">
                <Trans>Danh sách nguyên liệu</Trans>
              </span>
              <i className="mdi mdi-food menu-icon"></i>
            </Link>
          </li>

          <li className="nav-item hover-off-background">
            <Link className="nav-link" to="/materialConversion">
              <span className="menu-title">
                <Trans>Quản lý chuyển đổi</Trans>
              </span>
              <i className="mdi mdi-cached menu-icon"></i>
            </Link>
            <li className="nav-item p-0">
              <ul className="nav flex-column sub-menu">
                <Link className="current-list" to="/materialConversion">
                  <li
                    className={
                      this.isPathActive("/materialConversion")
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >
                    <div className="nav-link">
                      <span className="menu-title">
                        {" "}
                        Chuyển đổi nguyên liệu{" "}
                      </span>
                      <i className="mdi mdi-food-variant menu-icon"></i>
                    </div>
                  </li>
                </Link>

                <div className="current-list">
                  <li
                    className={
                      this.isPathActive("/productsConversion")
                        ? "nav-item active"
                        : "nav-item"
                    }
                  >
                    <Link className="nav-link" to="/productsConversion">
                      <span className="menu-title"> Chuyển đổi sản phẩm </span>
                      <i className="mdi mdi-food-fork-drink menu-icon"></i>
                    </Link>
                  </li>
                </div>
              </ul>
            </li>
          </li>

          <li
            className={
              this.isPathActive("/storagePosition") ||
              this.isPathActive("/addStoragePosition") ||
              this.isPathActive("/editStoragePosition")
                ? "nav-item active"
                : "nav-item"
            }
          >
            <Link className="nav-link" to="/storagePosition">
              <span className="menu-title">
                <Trans>Quản lý vị trí sản phẩm</Trans>
              </span>
              <i className="mdi mdi-map-marker-radius menu-icon"></i>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector("body");
    document.querySelectorAll(".sidebar .nav-item").forEach((el) => {
      el.addEventListener("mouseover", function () {
        if (body.classList.contains("sidebar-icon-only")) {
          el.classList.add("hover-open");
        }
      });
      el.addEventListener("mouseout", function () {
        if (body.classList.contains("sidebar-icon-only")) {
          el.classList.remove("hover-open");
        }
      });
    });
  }
}

export default withRouter(Sidebar);
