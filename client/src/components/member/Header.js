// header.js
import React, { memo, useState, useEffect, useCallback } from "react";
import logo from "../../images/hero-bg.png";
import { apiForgotPassword, apiLogin, apiResetPassword } from "../../apis/user";
import Swal from "sweetalert2";
import jsbootstrap from "../../js/bootstrap";
import jsmin from "../../js/jquery-3.4.1.min.js";
import lo from "../../images/slider-img.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSearch,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import path from "../../ultils/path";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Dropdown } from "react-bootstrap";
import InputField from "./inputField";
import { Button1, Button2 } from "./index.js";
import { register, logout } from "../../store/user/userSlice";
import { getCurrent } from "../../store/user/asyncAction";
import "../admin/er/css/sb-admin-2.min.css";
import { toast } from "react-toastify";
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [isPageReloaded, setIsPageReloaded] = useState(false);
  const { isLoggedIn, current } = useSelector((state) => state.user);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sentAttempts, setSentAttempts] = useState(0);
  useEffect(() => {
    if (isLoggedIn && !isPageReloaded) {
      setTimeout(() => {
        dispatch(getCurrent()).then(() => {
          setIsUserDataLoaded(true);
          setIsPageReloaded(true);
        });
      }, 1000);
    }
  }, [dispatch, isLoggedIn, isPageReloaded]);
  const handleForgotPassword = () => {
    setShow(false); // Ẩn modal đăng nhập
    setShowForgetPassword(true); // Hiển thị modal quên mật khẩu
  };
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgetPasswordClose = () => {
    setShowForgetPassword(false); // Đóng modal quên mật khẩu
    setShow(false); // Hiển thị lại modal đăng nhập sau khi quên mật khẩu đóng lại
  };
  const handleBackToLogin = () => {
    setShowForgetPassword(false); // Đóng modal quên mật khẩu
    setShow(true); // Hiển thị lại modal đăng nhập sau khi quên mật khẩu đóng lại
  };
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = useCallback(async () => {
    const { email, password } = payload;

    // Kiểm tra định dạng email
    const isValidEmail = /\S+@\S+\.\S+/.test(email);
    if (!isValidEmail) {
      setValidEmail(false);
      return;
    }

    try {
      const rs = await apiLogin({ email, password });
      if (rs.success) {
        localStorage.setItem("accessToken", rs.accessToken);
        localStorage.setItem("userData", JSON.stringify(rs.userData));
        dispatch(
          register({
            isLoggedIn: true,
            token: rs.accessToken,
            userData: rs.userData,
          })
        );
        handleClose();
        setTimeout(() => {
          if (rs.userData && rs.userData.role == 1) {
            navigate(`/${path.ADMIN}/te`);
          } else {
            navigate(`/${path.HOME}`);
          }
        }, 1500);
      } else {
        Swal.fire("Oops!", rs.mes, "error");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }, [payload, dispatch, navigate, current]);

  const [show, setShow] = useState(false);
  const [validEmail, setValidEmail] = useState(true);

  const handleClose = () => {
    setShow(false);
    setValidEmail(true); // Reset lại trạng thái email hợp lệ khi đóng modal
  };

  const handleShow = () => setShow(true);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    dispatch(logout());
    navigate("/");
    window.location.reload();
  };
  const [email, setEmail] = useState("");
  const handleForgotPasswordEr = async () => {
    try {
      if (sentAttempts >= 3) {
        const now = new Date();
        const blockedUntil = new Date(now.getTime() + 10 * 60000); 
        toast.warning(`You have exceeded the maximum number of requests. Please try again after ${blockedUntil.toLocaleTimeString()}!`);
        return;
      }

      const response = await apiForgotPassword({ email });
      console.log("Response:", response);
      if (response.success) {
        toast.success(response.mes);
        setIsOtpSent(true); // Cho phép nhập OTP sau khi gửi thành công
        setSentAttempts(sentAttempts + 1); // Tăng số lần gửi lên 1
      } else {
        toast.info(response.mes);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const handleResetPassword = async () => {
    try {
      const response = await apiResetPassword({ email, otp, password });
      console.log(response.success);
      if (response.success) {
        setShowForgetPassword(false); // Đóng modal quên mật khẩu
        setShow(true); // Hiển thị lại modal đăng nhập sau khi quên mật khẩu đóng lại
        toast.success(response.mes);
      } else {
        toast.info(response.mes);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };
  const handleOtpChange = (e) => {
    const otpValue = e.target.value;
    setOtp(otpValue);
    if (otpValue.length === 6) {
      setIsOtpValid(true); // Cho phép nhập password khi OTP có 6 chữ số
    } else {
      setIsOtpValid(false);
    }
  };
  return (
    <div className="hero_area">
      <div className="hero_bg_box">
        <div className="bg_img_box">
          <img src={logo} alt="" />
        </div>
      </div>

      <header className="header_section">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg custom_nav-container">
            <a className="navbar-brand" href="index.html">
              <span>EryTan</span>
            </a>

            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="#">
                    Home <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href={`/${path.ADMIN}`}>
                    Home(test)
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href={`/${path.USER}`}>
                    Services
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="why.html">
                    Why Us
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="team.html">
                    Team
                  </a>
                </li>
                <li className="nav-item">
                  {isLoggedIn && current ? (
                    <Dropdown>
                      <Dropdown.Toggle variant="link" id="dropdown-basic">
                        <FontAwesomeIcon icon={faUser} />
                        <span className="ml-2">
                          {`Welcome, ${current.firstname} ${current.lastname}`}
                        </span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item> Setting </Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>
                          {" "}
                          Logout{" "}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <a className="nav-link" onClick={handleShow}>
                      <FontAwesomeIcon icon={faUser} />
                      <span className="ml-2">Login</span>
                    </a>
                  )}
                </li>
                <form className="form-inline">
                  <button
                    className="btn my-2 my-sm-0 nav_search-btn"
                    type="submit"
                  >
                    <i>
                      <FontAwesomeIcon icon={faSearch} />
                    </i>
                  </button>
                </form>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      {/* Modal for Login Form */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="myform bg-cyan p-4 rounded">
            <form onSubmit={handleSubmit}>
              <InputField
                value={payload}
                setValue={setPayload}
                nameKey="email"
                placeholder="Email"
              />
              {!validEmail && (
                <div className="invalid-feedback">
                  Please enter a valid email address.
                </div>
              )}
              <div
                className="form-group"
                style={{ marginBottom: "1rem", position: "relative" }}
              >
                <InputField
                  value={payload}
                  setValue={setPayload}
                  nameKey="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
                <a
                  style={{
                    position: "absolute",
                    right: "5%",
                    top: "50%", // Đặt icon vào giữa input
                    transform: "translateY(-50%)", // Dịch chuyển lên trên để căn giữa
                    cursor: "pointer", // Đổi con trỏ thành kiểu chỉ
                  }}
                  onClick={handleTogglePassword}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </a>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check"></div>
                <a className="text-body" onClick={handleForgotPassword}>
                  Forgot password?
                </a>
              </div>
              <div className="text-center">
                <Button1
                  name={"Login"}
                  handleOnClick={handleSubmit}
                  style={{ width: "100%", marginBottom: "10px" }}
                  fw
                />
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showForgetPassword}
        onHide={handleForgetPasswordClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 class="h4 text-gray-950 mb-2">Forgot Your Password?</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Content for forget password form */}
          <p
            style={{
              fontSize: "1rem",
              color: "#777",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            We get it, stuff happens. Just enter your email address below and
            we'll send you a link to reset your password!
          </p>

          <form>
            <div
              className="form-group"
              style={{
                marginBottom: "1rem",
                display: "flex",
              }}
            >
              <input
                type="text"
                className="form-control form-control-user"
                style={{
                  fontSize: ".8rem",
                  borderRadius: "10rem",
                  padding: "1.5rem 1rem",
                  marginBottom: "1rem", // Thêm khoảng cách dưới cho input
                }}
                id="exampleInputEmail"
                aria-describedby="emailHelp"
                placeholder="Enter Email Address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button2 name="Send OTP" handleOnClick={handleForgotPasswordEr} />
            </div>
            {isOtpSent && (
              <div
                className="form-group"
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  flexDirection: "column", // Đổi hướng từ dọc thành ngang cho điện thoại
                }}
              >
                <input
                  type="text"
                  className="form-control form-control-user"
                  style={{
                    fontSize: ".8rem",
                    borderRadius: "10rem",
                    padding: "1.5rem 1rem",
                    marginBottom: "1rem", // Thêm khoảng cách dưới cho input
                  }}
                  placeholder="OTP"
                  value={otp}
                  onChange={handleOtpChange}
                />
              </div>
            )}
            {isOtpValid && (
              <div
                className="form-group"
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  position: "relative", // Đặt vị trí tương đối cho input và icon
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control form-control-user"
                  style={{
                    fontSize: ".8rem",
                    borderRadius: "10rem",
                    padding: "1.5rem 1rem",
                    marginBottom: "1rem", // Thêm khoảng cách dưới cho input
                  }}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <a
                  style={{
                    position: "absolute",
                    right: "5%",
                    top: "37%", // Đặt icon vào giữa input
                    transform: "translateY(-50%)", // Dịch chuyển lên trên để căn giữa
                  }}
                  onClick={handleTogglePassword}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </a>
              </div>
            )}
            {isOtpValid && (
              <Button1 name="Submit" handleOnClick={handleResetPassword} />
            )}
          </form>

          <hr
            style={{
              border: "0",
              borderTop: "1px solid rgba(0,0,0,.1)",
            }}
          />
          <div className="text-center">
            <p className="small">
              Already have an account?{" "}
              <a onClick={handleBackToLogin} className="text-primary">
                Login!
              </a>
            </p>
          </div>
        </Modal.Body>
      </Modal>
      <section className="slider_section">
        <div
          id="customCarousel1"
          className="carousel slide"
          data-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <div className="detail-box">
                      <h1>
                        Bill <br />
                        Gates
                      </h1>
                      <p>
                        I think it’s fair to say that personal computers have
                        become the most empowering tool we’ve ever created.
                        They’re tools of communication, they’re tools of
                        creativity, and they can be shaped by their user.
                      </p>
                      <div className="btn-box">
                        <a href="#" className="btn1">
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="img-box">
                      <img src={lo} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="carousel-item ">
              <div class="container ">
                <div class="row">
                  <div class="col-md-6 ">
                    <div class="detail-box">
                      <h1>
                        Crypto <br />
                        Currency
                      </h1>
                      <p>
                        Explicabo esse amet tempora quibusdam laudantium,
                        laborum eaque magnam fugiat hic? Esse dicta aliquid
                        error repudiandae earum suscipit fugiat molestias,
                        veniam, vel architecto veritatis delectus repellat modi
                        impedit sequi.
                      </p>
                      <div class="btn-box">
                        <a href="" class="btn1">
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="img-box">
                      <img src={lo} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="carousel-item ">
              <div class="container ">
                <div class="row">
                  <div class="col-md-6 ">
                    <div class="detail-box">
                      <h1>
                        Crypto <br />
                        Currency
                      </h1>
                      <p>
                        Explicabo esse amet tempora quibusdam laudantium,
                        laborum eaque magnam fugiat hic? Esse dicta aliquid
                        error repudiandae earum suscipit fugiat molestias,
                        veniam, vel architecto veritatis delectus repellat modi
                        impedit sequi.
                      </p>
                      <div class="btn-box">
                        <a href="" class="btn1">
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="img-box">
                      <img src={lo} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ol class="carousel-indicators">
            <li
              data-target="#customCarousel1"
              data-slide-to="0"
              class="active"
            ></li>
            <li data-target="#customCarousel1" data-slide-to="1"></li>
            <li data-target="#customCarousel1" data-slide-to="2"></li>
          </ol>
        </div>
      </section>
      <script src={jsbootstrap}></script>
      <script src={jsmin}></script>
    </div>
  );
};

export default memo(Header);
