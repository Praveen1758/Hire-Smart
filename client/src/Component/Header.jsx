import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {

const navigate = useNavigate();
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [userName, setUserName] = useState('');
const [userImage, setUserImage] = useState('');


useEffect(() => {
  const loadUser = () => {
    const token = localStorage.getItem('userToken');
    setIsLoggedIn(!!token);

    setUserName(localStorage.getItem('userName'));
    setUserImage(localStorage.getItem('userProfile'));
  };

  loadUser();

  // 🔥 listen when profile updates
  window.addEventListener('profileUpdated', loadUser);

  return () => {
    window.removeEventListener('profileUpdated', loadUser);
  };
}, []);


const handleLogout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userProfile');

  setIsLoggedIn(false);
  setUserName('');
  setUserImage('');

  navigate('/login');
};

  return (
    <div>

<header className="header-area style-1" 
style={{backgroundColor: '#0a2f44'}}
>
  <div className="header-main-logo d-lg-block d-none" >
    <Link to="/"><img alt="image" src="/assets/images/logo_new.png" style={{width:150}} /></Link>
  </div>
  <div className="menu-topbar-area" 
  style={{backgroundColor: '#0a2f44'}}
  >
    {/* <div className="top-bar">
      <p>Welcome Our Job Portal! <a href="bookmark.html">Save Jobs</a></p>
      <div className="top-bar-right">
        <div className="language-select">
          <img src="assets/images/icon/flag-eng.svg" alt="image" /><span>Language</span>
          <ul className="topbar-sublist">
            <li><img src="assets/images/icon/flag-germeny.svg" alt="image" /><span>Germeny</span></li>
            <li><img src="assets/images/icon/flag-french.svg" alt="image" /><span>French</span></li>
            <li><img src="assets/images/icon/flag-bangla.svg" alt="image" /><span>Bengali</span></li>
          </ul>
        </div>
        <div className="social-area">
          <ul>
            <li><a href="https://www.facebook.com/"><i className="bx bxl-facebook" /></a></li>
            <li><a href="https://twitter.com/"><i className="bx bxl-twitter" /></a></li>
            <li><a href="https://www.linkedin.com/"><i className="bx bxl-linkedin" /></a></li>
            <li><a href="https://www.instagram.com/"><i className="bx bxl-instagram" /></a></li>
          </ul>
        </div>
      </div>
    </div> */}
    <div className="menu-area">
      <div className="header-logo">
        <Link to="/"><img alt="image" className="img-fluid" src="/assets/images/logo_new.png" style={{width:150}} /></Link>
      </div>
      <div className="main-menu">
        <div className="mobile-logo-area d-lg-none d-flex justify-content-between align-items-center">
          <div className="mobile-logo-wrap">
            <Link to="/"><img alt="image" src="/assets/images/logo.png" style={{width:150}} /></Link>
          </div>
          <div className="menu-close-btn">
            <i className="bi bi-x-lg" />
          </div>
        </div>
        <ul className="menu-list">
          <li className="">
            <Link to="/" className="drop-down">Home</Link><i className="bi bi-plus dropdown-icon" />
          </li>
          <li className="menu-item">
            <Link to="/job" className="drop-down">Find Jobs</Link><i className="bi bi-plus dropdown-icon" />
          </li>
          <li className="menu-item">
            <Link to="/applications" className="drop-down">Applied Job</Link><i className="bi bi-plus dropdown-icon" />

          </li>
          <li className="menu-item">
            <Link to="/about" className="drop-down">About Us</Link><i className="bi bi-plus dropdown-icon" />
          </li>
        </ul>
        <div className="for-mobile-menu d-lg-none d-block">
          <div className="sign-in-btn mb-25">
            <Link to="/login" className="primry-btn-1 lg-btn">
              <svg width={15} height={15} viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.8033 2.19669C11.3868 0.780144 9.50329 0 7.5 0C5.49671 0 3.61324 0.780144 2.19669 2.19669C0.780144 3.61324 0 5.49671 0 7.5C0 9.50329 0.780144 11.3868 2.19669 12.8033C3.61324 14.2199 5.49671 15 7.5 15C9.50329 15 11.3868 14.2199 12.8033 12.8033C14.2199 11.3868 15 9.50329 15 7.5C15 5.49671 14.2199 3.61324 12.8033 2.19669ZM3.25504 12.5771C3.50269 10.4462 5.33478 8.80096 7.5 8.80096C8.64143 8.80096 9.71478 9.24568 10.5222 10.0529C11.2042 10.7351 11.6344 11.6258 11.7451 12.5769C10.5949 13.5402 9.11407 14.1211 7.5 14.1211C5.88593 14.1211 4.40517 13.5403 3.25504 12.5771ZM7.5 7.89574C6.24401 7.89574 5.22205 6.87378 5.22205 5.61779C5.22205 4.36169 6.24401 3.33984 7.5 3.33984C8.75599 3.33984 9.77795 4.36169 9.77795 5.61779C9.77795 6.87378 8.75599 7.89574 7.5 7.89574ZM12.5015 11.834C12.2776 10.9311 11.8105 10.0985 11.1436 9.43153C10.6034 8.89137 9.96437 8.48614 9.26743 8.23219C10.1052 7.66399 10.6569 6.70406 10.6569 5.61779C10.6569 3.87714 9.24065 2.46094 7.5 2.46094C5.75935 2.46094 4.34315 3.87714 4.34315 5.61779C4.34315 6.70464 4.89521 7.66491 5.73372 8.23299C5.09251 8.46668 4.49913 8.82797 3.98861 9.30359C3.24932 9.99207 2.73594 10.8699 2.4979 11.8333C1.48979 10.6712 0.878906 9.15562 0.878906 7.5C0.878906 3.84911 3.84911 0.878906 7.5 0.878906C11.1509 0.878906 14.1211 3.84911 14.1211 7.5C14.1211 9.15596 13.51 10.6718 12.5015 11.834Z" />
              </svg>
              Sign In</Link>
          </div>
          <div className="social-area">
            <ul>
              <li><a href="https://www.facebook.com/"><i className="bx bxl-facebook" /></a></li>
              <li><a href="https://twitter.com/"><i className="bx bxl-twitter" /></a></li>
              <li><a href="https://www.linkedin.com/"><i className="bx bxl-linkedin" /></a></li>
              <li><a href="https://www.instagram.com/"><i className="bx bxl-instagram" /></a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="nav-right d-flex jsutify-content-end align-items-center">
        <ul>
          <li className="d-md-flex d-none">
            <div className="sign-in-btn">

                {isLoggedIn ? (
                <button
                    onClick={handleLogout}
                    className="primry-btn-1 lg-btn"
                    style={{ border: 'none' }}
                >
                    Logout
                </button>
                ) : (
              <Link to="/login" className="primry-btn-1 lg-btn">
                <svg width={15} height={15} viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.8033 2.19669C11.3868 0.780144 9.50329 0 7.5 0C5.49671 0 3.61324 0.780144 2.19669 2.19669C0.780144 3.61324 0 5.49671 0 7.5C0 9.50329 0.780144 11.3868 2.19669 12.8033C3.61324 14.2199 5.49671 15 7.5 15C9.50329 15 11.3868 14.2199 12.8033 12.8033C14.2199 11.3868 15 9.50329 15 7.5C15 5.49671 14.2199 3.61324 12.8033 2.19669ZM3.25504 12.5771C3.50269 10.4462 5.33478 8.80096 7.5 8.80096C8.64143 8.80096 9.71478 9.24568 10.5222 10.0529C11.2042 10.7351 11.6344 11.6258 11.7451 12.5769C10.5949 13.5402 9.11407 14.1211 7.5 14.1211C5.88593 14.1211 4.40517 13.5403 3.25504 12.5771ZM7.5 7.89574C6.24401 7.89574 5.22205 6.87378 5.22205 5.61779C5.22205 4.36169 6.24401 3.33984 7.5 3.33984C8.75599 3.33984 9.77795 4.36169 9.77795 5.61779C9.77795 6.87378 8.75599 7.89574 7.5 7.89574ZM12.5015 11.834C12.2776 10.9311 11.8105 10.0985 11.1436 9.43153C10.6034 8.89137 9.96437 8.48614 9.26743 8.23219C10.1052 7.66399 10.6569 6.70406 10.6569 5.61779C10.6569 3.87714 9.24065 2.46094 7.5 2.46094C5.75935 2.46094 4.34315 3.87714 4.34315 5.61779C4.34315 6.70464 4.89521 7.66491 5.73372 8.23299C5.09251 8.46668 4.49913 8.82797 3.98861 9.30359C3.24932 9.99207 2.73594 10.8699 2.4979 11.8333C1.48979 10.6712 0.878906 9.15562 0.878906 7.5C0.878906 3.84911 3.84911 0.878906 7.5 0.878906C11.1509 0.878906 14.1211 3.84911 14.1211 7.5C14.1211 9.15596 13.51 10.6718 12.5015 11.834Z" />
                </svg>
                Sign In</Link>
                )}
            </div>
          </li>
          <li>
  <div className="btn-group dropdown">
  <div className="notifications-area dropdown-toggle" role="button" id="dropdownMenuButton3" data-bs-toggle="dropdown" aria-expanded="false">
<img
  className="user-icon"
  src={
    isLoggedIn && userImage
      ? `http://localhost:6102/api/image/${userImage}`
      : "/assets/images/bg/user-img.png"
  }
  alt="user"
  style={{
    borderRadius: "50%",
    width: 40,
    height: 40,
    objectFit: "cover"
  }}
/>
  </div>
  <div className="user-card dropdown-menu" aria-labelledby="dropdownMenuButton3">
    <ul>
      <li>
        <Link to="/profile">
          <svg width={18} height={18} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 9C18 4.02595 13.9747 0 9 0C4.02599 0 0 4.02525 0 9C0 13.8465 3.87552 17.9204 8.85554 17.9982C8.94013 18.002 9.12386 17.9985 9.12741 17.9985C9.12888 17.9985 9.13514 17.9984 9.13679 17.9983C14.0497 17.9256 18 13.922 18 9ZM9 0.527344C13.6826 0.527344 17.4727 4.31677 17.4727 9C17.4727 10.9522 16.8164 12.8032 15.6091 14.3022C15.5881 13.3575 14.9755 12.5368 14.0707 12.2503L12.3649 11.7102C12.2684 11.6276 12.2938 11.6632 10.7234 10.8851V10.1543C11.4081 9.66815 11.8822 8.90072 11.9694 8.01584C12.2945 7.96071 12.5428 7.67707 12.5428 7.33655C12.5428 6.83149 12.5428 5.1711 12.5428 4.65304C12.5428 4.06216 12.0621 3.58147 11.4713 3.58147H11.4441C11.439 3.58147 11.4349 3.57736 11.4349 3.5723C11.4349 2.98143 10.9542 2.50073 10.3633 2.50073H7.57923C6.40856 2.50073 5.45618 3.45312 5.45618 4.62379C5.45618 4.7694 5.57423 4.88746 5.71985 4.88746C5.86547 4.88746 5.98352 4.7694 5.98352 4.62379C5.98352 3.74389 6.69934 3.02808 7.57923 3.02808H10.3633C10.6634 3.02808 10.9075 3.2722 10.9075 3.5723C10.9075 3.86814 11.1482 4.10882 11.4441 4.10882H11.4713C11.7714 4.10882 12.0155 4.35294 12.0155 4.65304V6.15357H11.7209C11.5563 6.15357 11.4224 6.01966 11.4224 5.8551V5.54745C11.4224 4.96266 10.8515 4.5501 10.2963 4.73361C9.46037 5.00991 8.53956 5.00998 7.70252 4.73347C7.14723 4.5501 6.57654 4.96266 6.57654 5.54734V5.8551C6.57654 6.0197 6.44263 6.15361 6.27806 6.15361H5.98349V5.84237C5.98349 5.69675 5.86543 5.5787 5.71982 5.5787C5.5742 5.5787 5.45614 5.69675 5.45614 5.84237V7.33658C5.45614 7.67714 5.70449 7.96075 6.02961 8.01591C6.11677 8.90082 6.59092 9.66821 7.27555 10.1544V10.8854C5.70839 11.662 5.7291 11.6293 5.63428 11.7105L3.92931 12.2503C3.02456 12.5368 2.41196 13.3575 2.39098 14.3023C1.18361 12.8032 0.527344 10.9522 0.527344 9C0.527344 4.3174 4.31677 0.527344 9 0.527344ZM5.97706 13.7489L6.18198 13.5444C6.39587 13.3309 6.44646 13.0069 6.30791 12.7383L5.98282 12.108L7.04827 11.5846C6.93489 12.0588 6.93858 12.58 6.99318 13.0684C6.99321 13.0688 6.99328 13.0692 6.99332 13.0695C7.12969 14.2874 7.62683 15.6689 8.12366 16.7889C7.30547 15.9655 6.21204 14.7544 5.93666 13.9148C5.9175 13.8565 5.933 13.7929 5.97706 13.7489ZM5.98345 6.68092H6.27803C6.73341 6.68092 7.10385 6.31044 7.10385 5.85506V5.5473C7.10385 5.32332 7.32203 5.16322 7.53813 5.23452C8.48081 5.5459 9.51912 5.54586 10.4618 5.23431C10.6754 5.16375 10.8951 5.32238 10.8951 5.54745V5.8551C10.8951 6.31048 11.2655 6.68092 11.7209 6.68092H12.0155V7.33655C12.0155 7.4257 11.943 7.4982 11.8538 7.4982C11.6417 7.4982 11.465 7.6647 11.4516 7.87729C11.3702 9.16734 10.2932 10.1779 8.99947 10.1779C7.70583 10.1779 6.62871 9.16734 6.54736 7.87729C6.53396 7.66473 6.35727 7.4982 6.14514 7.4982C6.05598 7.4982 5.98349 7.4257 5.98349 7.33655V6.68092H5.98345ZM8.99975 17.4124C8.82865 17.0692 8.5976 16.5802 8.36648 16.0129L8.79947 14.31H9.2005L9.6332 16.0124C9.40166 16.5809 9.17033 17.0703 8.99975 17.4124ZM8.65315 12.7027C8.50391 12.8274 8.19777 13.0831 7.95843 13.283C7.90847 13.3247 7.83693 13.3245 7.7875 13.2839L7.50881 12.9393C7.46272 12.4771 7.46729 11.9661 7.61164 11.5286L8.65315 12.7027ZM7.8724 13.8421C7.93962 13.8421 8.0068 13.8312 8.07173 13.8106L8.30679 14.1077L8.04125 15.1521C7.88917 14.7136 7.75206 14.2564 7.65127 13.8032C7.72267 13.8286 7.79737 13.8421 7.8724 13.8421ZM9.27341 13.7827H8.72205L8.5075 13.5115L9.02869 13.0761L9.50013 13.4792L9.27341 13.7827ZM10.0509 13.2563L9.40187 12.7014L10.3909 11.5383C10.5318 11.9728 10.5359 12.4761 10.4916 12.9287L10.2221 13.2589C10.1721 13.2992 10.1005 13.2988 10.0509 13.2563ZM8.99947 10.7052C9.42377 10.7052 9.82874 10.6153 10.1961 10.4538V10.9533L9.02644 12.3288L7.80286 10.9495V10.4537C8.17017 10.6153 8.57514 10.7052 8.99947 10.7052ZM9.95846 15.1513L9.69209 14.1033L9.93157 13.7828C9.99872 13.805 10.0684 13.8166 10.1381 13.8166C10.211 13.8166 10.2835 13.8038 10.3531 13.7798C10.2525 14.2379 10.1146 14.701 9.95846 15.1513ZM2.91727 14.8972V14.3523C2.91727 13.6176 3.38794 12.9748 4.08843 12.7531L5.49415 12.308C5.50821 12.3409 5.49376 12.3092 5.83924 12.9801C5.87211 13.0438 5.86013 13.1206 5.80943 13.1712L5.6045 13.3757C5.41877 13.5611 5.35402 13.8307 5.43558 14.0792C5.77213 15.1051 7.09611 16.5258 8.0048 17.4148C6.07549 17.1904 4.29476 16.3169 2.91727 14.8972ZM9.99461 17.4148C10.4846 16.9354 11.0989 16.2985 11.612 15.6535C11.7026 15.5395 11.6837 15.3737 11.5697 15.283C11.4558 15.1924 11.2899 15.2112 11.1992 15.3252C10.7852 15.8457 10.3012 16.3627 9.87465 16.7913C10.373 15.6684 10.872 14.2823 11.0071 13.0606C11.0071 13.0602 11.0072 13.0597 11.0072 13.0593C11.0608 12.5741 11.064 12.0574 10.9512 11.5846L12.0166 12.1081L11.6915 12.7384C11.553 13.007 11.6036 13.3309 11.8175 13.5444L12.0224 13.7489C12.0664 13.7929 12.0819 13.8565 12.0628 13.9148C12.0215 14.0408 11.9586 14.1822 11.876 14.3352C11.8067 14.4634 11.8545 14.6233 11.9826 14.6925C12.1108 14.7618 12.2707 14.714 12.3399 14.5859C12.4375 14.4053 12.5128 14.2348 12.5639 14.0792C12.6454 13.8306 12.5807 13.5611 12.3949 13.3757L12.19 13.1712C12.1393 13.1206 12.1274 13.0437 12.1602 12.9801C12.5031 12.314 12.4914 12.3403 12.5054 12.3079L13.9115 12.753C14.6121 12.9748 15.0827 13.6175 15.0827 14.3523V14.8972C13.7083 16.3137 11.9287 17.19 9.99461 17.4148Z" />
          </svg>
          My Profile
        </Link>
      </li>
    </ul>
  </div>
</div>

          </li>
        </ul>
        <div className="sidebar-button mobile-menu-btn ">
          <i className="bi bi-list" />
        </div>
      </div>
    </div>
  </div>
</header>

      
    </div>
  )
}
