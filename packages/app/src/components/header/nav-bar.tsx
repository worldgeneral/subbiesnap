"use client";

import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  //const toggleMenu = () => {};

  function toggleMenu() {
    document.getElementById("isToggle")?.classList.toggle("open");
    var isOpen = document.getElementById("navigation");
    if (isOpen) {
      if (isOpen.style.display === "block") {
        isOpen.style.display = "none";
      } else {
        isOpen.style.display = "block";
      }
    }
  }
  return (
    <nav id="topnav" className="defaultscroll is-sticky">
      <div className="container">
        <a className="logo" href="index.html">
          <div className="block sm:hidden">
            <Image
              width={350}
              height={40}
              src="/images/logo/single-line-logo.svg"
              alt="Subbie Snap logo"
            />
            <img
              src="assets/images/logo-icon-40-white.png"
              className="h-10 hidden dark:inline-block"
              alt=""
            />
          </div>
          <div className="sm:block hidden">
            <span className="inline-block dark:hidden">
              <img
                src="assets/images/logo-dark.png"
                className="h-[24px] l-dark"
                alt=""
              />
              <img
                src="assets/images/logo-light.png"
                className="h-[24px] l-light"
                alt=""
              />
            </span>
            <img
              src="assets/images/logo-white.png"
              className="h-[24px] hidden dark:inline-block"
              alt=""
            />
          </div>
        </a>

        <div className="menu-extras">
          <div className="menu-item">
            <a
              className="navbar-toggle"
              id="isToggle"
              onClick={() => toggleMenu()}
            >
              <div className="lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </a>
          </div>
        </div>

        <ul className="buy-button list-none mb-0">
          <li className="inline-block mb-0">
            <div className="relative top-[3px]">
              <i className="uil uil-search text-lg absolute top-[3px] end-3"></i>
              <input
                type="text"
                className="form-input h-9 pe-10 rounded-3xl sm:w-44 w-36 border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                name="s"
                id="searchItem"
                placeholder="Search..."
              />
            </div>
          </li>
          <li className="dropdown inline-block relative ps-1">
            <button
              data-dropdown-toggle="dropdown"
              className="dropdown-toggle items-center"
              type="button"
            >
              <span className="btn btn-icon rounded-full bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white">
                <img
                  src="assets/images/team/01.jpg"
                  className="rounded-full"
                  alt=""
                />
              </span>
            </button>

            <div
              className="dropdown-menu absolute end-0 m-0 mt-4 z-10 w-44 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow dark:shadow-gray-700 hidden"
              // onclick="event.stopPropagation();"
            >
              <ul className="py-2 text-start">
                <li>
                  <a
                    href="candidate-profile.html"
                    className="flex items-center font-medium py-2 px-4 dark:text-white/70 hover:text-emerald-600 dark:hover:text-white"
                  >
                    <i data-feather="user" className="size-4 me-2"></i>Profile
                  </a>
                </li>
                <li>
                  <a
                    href="candidate-profile-setting.html"
                    className="flex items-center font-medium py-2 px-4 dark:text-white/70 hover:text-emerald-600 dark:hover:text-white"
                  >
                    <i data-feather="settings" className="size-4 me-2"></i>
                    Settings
                  </a>
                </li>
                <li className="border-t border-gray-100 dark:border-gray-800 my-2"></li>
                <li>
                  <a
                    href="lock-screen.html"
                    className="flex items-center font-medium py-2 px-4 dark:text-white/70 hover:text-emerald-600 dark:hover:text-white"
                  >
                    <i data-feather="lock" className="size-4 me-2"></i>
                    Lockscreen
                  </a>
                </li>
                <li>
                  <a
                    href="login.html"
                    className="flex items-center font-medium py-2 px-4 dark:text-white/70 hover:text-emerald-600 dark:hover:text-white"
                  >
                    <i data-feather="log-out" className="size-4 me-2"></i>Logout
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>

        <div id="navigation">
          <ul className="navigation-menu justify-end nav-light">
            <li className="has-submenu parent-menu-item">
              <a href="javascript:void(0)">Home</a>
              <span className="menu-arrow"></span>
              <ul className="submenu">
                <li>
                  <a href="index.html" className="sub-menu-item">
                    Hero One
                  </a>
                </li>
                <li>
                  <a href="index-two.html" className="sub-menu-item">
                    Hero Two
                  </a>
                </li>
                <li>
                  <a href="index-three.html" className="sub-menu-item">
                    Hero Three
                  </a>
                </li>
                <li>
                  <a href="index-four.html" className="sub-menu-item">
                    Hero Four
                  </a>
                </li>
                <li>
                  <a href="index-five.html" className="sub-menu-item">
                    Hero Five
                  </a>
                </li>
                <li>
                  <a href="index-six.html" className="sub-menu-item">
                    Hero Six{" "}
                  </a>
                </li>
                <li>
                  <a href="index-seven.html" className="sub-menu-item">
                    Hero Seven{" "}
                  </a>
                </li>
                <li>
                  <a href="index-eight.html" className="sub-menu-item">
                    Hero Eight
                  </a>
                </li>
                <li>
                  <a href="index-nine.html" className="sub-menu-item">
                    Hero Nine
                  </a>
                </li>
                <li>
                  <a href="index-ten.html" className="sub-menu-item">
                    Hero Ten{" "}
                    <span className="bg-red-600 inline-block text-white text-[10px] font-bold px-2.5 py-0.5 rounded h-5 ms-1">
                      New
                    </span>
                  </a>
                </li>
              </ul>
            </li>

            <li className="has-submenu parent-parent-menu-item">
              <a href="javascript:void(0)"> Jobs </a>
              <span className="menu-arrow"></span>
              <ul className="submenu">
                <li>
                  <a href="job-categories.html" className="sub-menu-item">
                    Job Categories
                  </a>
                </li>

                <li className="has-submenu parent-menu-item">
                  <a href="javascript:void(0)"> Job Grids </a>
                  <span className="submenu-arrow"></span>
                  <ul className="submenu">
                    <li>
                      <a href="job-grid-one.html" className="sub-menu-item">
                        Job Grid One
                      </a>
                    </li>
                    <li>
                      <a href="job-grid-two.html" className="sub-menu-item">
                        Job Grid Two
                      </a>
                    </li>
                    <li>
                      <a href="job-grid-three.html" className="sub-menu-item">
                        Job Grid Three
                      </a>
                    </li>
                    <li>
                      <a href="job-grid-four.html" className="sub-menu-item">
                        Job Grid Four{" "}
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="has-submenu parent-menu-item">
                  <a href="javascript:void(0)"> Job Lists </a>
                  <span className="submenu-arrow"></span>
                  <ul className="submenu">
                    <li>
                      <a href="job-list-one.html" className="sub-menu-item">
                        Job List One
                      </a>
                    </li>
                    <li>
                      <a href="job-list-two.html" className="sub-menu-item">
                        Job List Two
                      </a>
                    </li>
                    <li>
                      <a href="job-list-three.html" className="sub-menu-item">
                        Job List Three
                      </a>
                    </li>
                    <li>
                      <a href="job-list-four.html" className="sub-menu-item">
                        Job List Four
                      </a>
                    </li>
                    <li>
                      <a href="job-list-five.html" className="sub-menu-item">
                        Job List Five{" "}
                      </a>
                    </li>
                    <li>
                      <a href="job-list-six.html" className="sub-menu-item">
                        Job List Six{" "}
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="has-submenu parent-menu-item">
                  <a href="javascript:void(0)"> Job Detail </a>
                  <span className="submenu-arrow"></span>
                  <ul className="submenu">
                    <li>
                      <a href="job-detail-one.html" className="sub-menu-item">
                        Job Detail One
                      </a>
                    </li>
                    <li>
                      <a href="job-detail-two.html" className="sub-menu-item">
                        Job Detail Two
                      </a>
                    </li>
                    <li>
                      <a href="job-detail-three.html" className="sub-menu-item">
                        Job Detail Three
                      </a>
                    </li>
                  </ul>
                </li>

                <li>
                  <a href="job-apply.html" className="sub-menu-item">
                    Job Apply
                  </a>
                </li>

                <li>
                  <a href="job-post.html" className="sub-menu-item">
                    Job Post{" "}
                  </a>
                </li>

                <li>
                  <a href="career.html" className="sub-menu-item">
                    Career{" "}
                  </a>
                </li>
              </ul>
            </li>

            <li className="has-submenu parent-parent-menu-item">
              <a href="javascript:void(0)">Pages</a>
              <span className="menu-arrow"></span>
              <ul className="submenu">
                <li>
                  <a href="aboutus.html" className="sub-menu-item">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="services.html" className="sub-menu-item">
                    Services
                  </a>
                </li>
                <li>
                  <a href="pricing.html" className="sub-menu-item">
                    Pricing{" "}
                  </a>
                </li>

                <li className="has-submenu parent-menu-item">
                  <a href="javascript:void(0)">Employers</a>
                  <span className="submenu-arrow"></span>
                  <ul className="submenu">
                    <li>
                      <a href="employer-list.html" className="sub-menu-item">
                        Employers
                      </a>
                    </li>
                    <li>
                      <a href="employer-profile.html" className="sub-menu-item">
                        Employer Profile
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="has-submenu parent-menu-item">
                  <a href="javascript:void(0)">Candidates </a>
                  <span className="submenu-arrow"></span>
                  <ul className="submenu">
                    <li>
                      <a href="candidate-list.html" className="sub-menu-item">
                        Candidates
                      </a>
                    </li>
                    <li>
                      <a
                        href="candidate-profile.html"
                        className="sub-menu-item"
                      >
                        Candidate Profile
                      </a>
                    </li>
                    <li>
                      <a
                        href="candidate-profile-setting.html"
                        className="sub-menu-item"
                      >
                        Profile Settings{" "}
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="has-submenu parent-menu-item">
                  <a href="javascript:void(0)"> Helpcenter </a>
                  <span className="submenu-arrow"></span>
                  <ul className="submenu">
                    <li>
                      <a
                        href="helpcenter-overview.html"
                        className="sub-menu-item"
                      >
                        Overview
                      </a>
                    </li>
                    <li>
                      <a href="helpcenter-faqs.html" className="sub-menu-item">
                        FAQs
                      </a>
                    </li>
                    <li>
                      <a
                        href="helpcenter-guides.html"
                        className="sub-menu-item"
                      >
                        Guides
                      </a>
                    </li>
                    <li>
                      <a
                        href="helpcenter-support.html"
                        className="sub-menu-item"
                      >
                        Support
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="has-submenu parent-menu-item">
                  <a href="javascript:void(0)"> Blog </a>
                  <span className="submenu-arrow"></span>
                  <ul className="submenu">
                    <li>
                      <a href="blogs.html" className="sub-menu-item">
                        {" "}
                        Blogs
                      </a>
                    </li>
                    <li>
                      <a href="blog-detail.html" className="sub-menu-item">
                        {" "}
                        Blog Detail
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="has-submenu parent-menu-item">
                  <a href="javascript:void(0)"> Auth Pages </a>
                  <span className="submenu-arrow"></span>
                  <ul className="submenu">
                    <li>
                      <a href="login.html" className="sub-menu-item">
                        {" "}
                        Login
                      </a>
                    </li>
                    <li>
                      <a href="signup.html" className="sub-menu-item">
                        {" "}
                        Signup
                      </a>
                    </li>
                    <li>
                      <a href="reset-password.html" className="sub-menu-item">
                        {" "}
                        Forgot Password
                      </a>
                    </li>
                    <li>
                      <a href="lock-screen.html" className="sub-menu-item">
                        {" "}
                        Lock Screen
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="has-submenu parent-menu-item">
                  <a href="javascript:void(0)"> Utility </a>
                  <span className="submenu-arrow"></span>
                  <ul className="submenu">
                    <li>
                      <a href="terms.html" className="sub-menu-item">
                        Terms of Services
                      </a>
                    </li>
                    <li>
                      <a href="privacy.html" className="sub-menu-item">
                        Privacy Policy
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="has-submenu parent-menu-item">
                  <a href="javascript:void(0)"> Special </a>
                  <span className="submenu-arrow"></span>
                  <ul className="submenu">
                    <li>
                      <a href="comingsoon.html" className="sub-menu-item">
                        {" "}
                        Coming Soon
                      </a>
                    </li>
                    <li>
                      <a href="maintenance.html" className="sub-menu-item">
                        {" "}
                        Maintenance
                      </a>
                    </li>
                    <li>
                      <a href="error.html" className="sub-menu-item">
                        {" "}
                        404!
                      </a>
                    </li>
                    <li>
                      <a href="thankyou.html" className="sub-menu-item">
                        {" "}
                        Thank you
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

            <li>
              <a href="contact.html" className="sub-menu-item">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
