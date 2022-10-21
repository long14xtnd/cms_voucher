import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import md5 from "md5";
import { saveCustomerInfo, roleUser } from "../../../store/actions/AuthAction";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        username: "",
        password: "",
      },
      errors: {
        errUser: "",
        errPass: "",
      },
    };
  }

  validatePassword = (password) => {
    if (password.length === 0)
      setTimeout(
        () =>
          this.setErrors({
            errPass: "Mật khẩu phải có ít nhất 8 ký tự",
          }),
        200
      );
    else if (password.length < 8)
      setTimeout(
        () =>
          this.setErrors({
            errPass: "Mật khẩu không được để trống",
          }),
        200
      );
    else
      this.setErrors({
        errPass: "",
      });
  };

  validateUsername = (username) => {
    if (username.length < 8)
      setTimeout(
        () =>
          this.setErrors({
            errUser: "Tài khoản không được để trống",
          }),
        200
      );
    else
      this.setErrors({
        errUser: "",
      });
  };
  handleInputChange = (event) => {
    this.setState({
      values: {
        ...this.state.values,
        [event.target.name]: event.target.value,
      },
    });
  };
  handleLogin = async () => {
    try {
      this.setErrors({
        errPass: "",
      });
      if (this.state.values.username === "") {
        this.setErrors({
          errUser: "Tài khoản không được để trống",
        });
      }

      if (this.state.values.password === "") {
        this.setErrors({
          errPass: "Mật khẩu không được để trống",
        });
      }
      const dataApi = {
        username: this.state.values.username,
        password: md5(this.state.values.password),
        deviceId: "123",
        key: "321",
        rememberMe: 0,
        requestFrom: "CMS_FACTORY",
      };
      fetch(process.env.REACT_APP_URL_API_LOGIN + "authenticate", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataApi),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            if (result.status === 200) {
              this.props.saveCustomerInfo({
                token: result.data.token,
                username: result.data.username,
              });
            } else {
              this.setErrors = {
                errPass: result.message,
              };
            }
          },
          (error) => {
            this.setErrors = {
              errPass: error.message,
            };
          }
        );
    } catch (error) {
      if (error.response) {
        if (error.response.data) {
          this.setErrors = {
            errPass: error.response.data,
          };
        }
      }
    }
  };
  setErrors = (error) =>
    this.setState({
      errors: {
        ...this.state.errors,
        ...error,
      },
    });

  render() {
    return (
      <div className="container-scroller login-background">
        <div className="container-fluid page-body-wrapper full-page-wrapper login-container">
          <div className="content-wrapper d-flex align-items-center auth login-content">
            <div className="row flex-grow">
              <div className="col-lg-4 mx-auto">
                {/* <form onSubmit={() => { this.handleLogin() }}> */}
                <div className="auth-form-light text-left p-5">
                  <div className="brand-logo">
                    <img
                      alt="logo"
                      src={require("../../../assets/images/Logo_Holafresh.svg")}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      name="username"
                      className="form-control login-input "
                      placeholder="Tài khoản"
                      type="text"
                      value={this.state.values.username}
                      onChange={(event) => this.handleInputChange(event)}
                      onBlur={(e) => this.validateUsername(e.target.value)}
                    />
                    <span className="errLabel errUsername">
                      {this.state.errors.errUser}
                    </span>
                  </div>
                  <input
                    name="password"
                    className="form-control login-input"
                    placeholder="Mật khẩu"
                    type="password"
                    value={this.state.values.password}
                    onChange={(event) => this.handleInputChange(event)}
                    onBlur={(e) => this.validatePassword(e.target.value)}
                  />
                  <span className="errLabel errPassword">
                    {this.state.errors.errPass}
                  </span>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="btn-login"
                      onClick={() => {
                        this.handleLogin();
                      }}
                    >
                      Đăng nhập
                    </button>
                  </div>
                  <div className="my-2 d-flex justify-content-between align-items-center">
                    <a
                      href="avascript:void(0)"
                      className="auth-link text-black"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>
                {/* </form> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveCustomerInfo: (data) => dispatch(saveCustomerInfo(data)),
  };
};

export default connect(null, mapDispatchToProps)(Login);
