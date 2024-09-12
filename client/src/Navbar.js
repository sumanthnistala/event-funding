import React from "react";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from "./NavbarElements";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const onSignOut = () => {
    console.log("logged out");
    const navigate = useNavigate();
    localStorage.setItem("username", "");
    localStorage.setItem("token", "");
    navigate("/");
  };
  return (
    <>
      <Nav>
        <Bars />

        <NavMenu>
          <NavLink to="/Events" activeStyle>
            Events
          </NavLink>
          <NavLink to="/CreateEvent" activeStyle>
            CreateEvent
          </NavLink>
          <NavLink to="/Dashboard" activeStyle>
            Dashboard
          </NavLink>
          <NavLink to="/MintToken" activeStyle>
            MintToken
          </NavLink>
        </NavMenu>
        <NavBtn>
          <NavBtnLink to="/Signout" onClick={onSignOut}>
            Sign Out
          </NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;
