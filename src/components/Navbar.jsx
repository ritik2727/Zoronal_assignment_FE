import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [search, setSearch] = useState("")
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <img src="src/assets/images/logo.svg" alt="Company Review Logo" />
        </Link>


        <div className="navbar-links">

        <div className="flex justify-center items-center form-group input-with-icon" style={{ position: 'relative' ,marginBottom:0}}>

          <input
            id="company-founded"
            name="search"
            type="text"
            placeholder='Search...'
            className="form-input "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <img
            src="../src/assets/images/searchIcon.svg"
            alt="calendar"
            className="input-icon"
            style={{top:"50%"}}
          />

        </div>
          <a href="#" className="navbar-link">Login</a>
          <a href="#" className="navbar-link">Sign Up</a>
        </div>
      </div>
    </nav>
  );
}
