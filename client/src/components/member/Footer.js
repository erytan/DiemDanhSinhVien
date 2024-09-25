import React from "react";
import {
  faMapLocation,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export const Footer = () => {
  return (
    <div>
      <section class="info_section layout_padding2">
        <div class="container">
          <div class="row">
            <div class="col-md-6 col-lg-3 info_col">
              <div class="info_contact">
                <h4>Address</h4>
                <div class="contact_link_box">
                  <a href="">
                    <FontAwesomeIcon
                      icon={faMapLocation}
                      style={{ marginRight: 1 + "em" }}
                    />
                    <span>Location</span>
                  </a>
                  <a href="">
                    <FontAwesomeIcon
                      icon={faPhone}
                      style={{ marginRight: 1 + "em" }}
                    />
                    <span>Call +01 1234567890</span>
                  </a>
                  <a href="">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      style={{ marginRight: 1 + "em" }}
                    />
                    <span>DH52006101@gmail.com</span>
                  </a>
                </div>
              </div>
              <div class="info_social">
                <a href="">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="">
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a href="">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 info_col">
              <div class="info_detail">
                <h4>Info</h4>
                <p>
                  necessary, making this the first true generator on the
                  Internet. It uses a dictionary of over 200 Latin words,
                  combined with a handful
                </p>
              </div>
            </div>
            <div class="col-md-6 col-lg-2 mx-auto info_col">
              <div class="info_link_box">
                <h4>Links</h4>
                <div class="info_links">
                  <a class="active" href="index.html">
                    Home
                  </a>
                  <a class="" href="about.html">
                    About
                  </a>
                  <a class="" href="service.html">
                    Services
                  </a>
                  <a class="" href="why.html">
                    Why Us
                  </a>
                  <a class="" href="team.html">
                    Team
                  </a>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 info_col ">
              <h4>Subscribe</h4>
              <form action="#">
                <input type="text" placeholder="Enter email" />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <section class="footer_section">
        <div class="container">
          <p>
            &copy; <span id="displayYear"></span> All Rights Reserved By
            <a href="https://html.design/">Free Html Templates</a>
          </p>
        </div>
      </section>
    </div>
  );
};
export default Footer;
