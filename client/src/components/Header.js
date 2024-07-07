import React, { memo, useState, useEffect, useCallback } from "react";
import logo from "../images/hero-bg.png";
import { apiLogin } from "../apis/user";
import Swal from "sweetalert2";
import lo from "../images/slider-img.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import path from "../ultils/path";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Dropdown } from "react-bootstrap";
import InputField from "./inputField";
import Button1 from "./button";
import { register, logout } from "../store/user/userSlice";
import { getCurrent } from "../store/user/asyncAction";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [isPageReloaded, setIsPageReloaded] = useState(false);
  const { isLoggedIn, current } = useSelector((state) => state.user);

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

  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });

  const resetPayload = () => {
    setPayload({
      email: "",
      password: "",
    });
  };

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
          if (rs.userData && rs.userData.role === 1) {
            navigate(`/${path.ADMIN}`);
          } else {
            navigate(`/${path.HOME}`);
          }
        }, 1000);
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
                  <a className="nav-link">
                    <Link to={`/${path.HOME}`}>Home(test)</Link>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="service.html">
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
              <div className="form-floating mb-3">
                <InputField
                  value={payload.email}
                  setValue={setPayload}
                  nameKey="email"
                  placeholder="Email"
                />
                {!validEmail && (
                  <div className="invalid-feedback">
                    Please enter a valid email address.
                  </div>
                )}
              </div>
              <div className="form-floating mb-3">
                <InputField
                  value={payload.password}
                  setValue={setPayload}
                  nameKey="password"
                  type="password"
                  placeholder="Password"
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check"></div>
                <a href="#!" className="text-body">
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(Header);
