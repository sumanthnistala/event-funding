import React from "react";
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
} from "./NavbarElements";

const Navbar = () => {
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
                </NavMenu>
                <NavBtn>
                    <NavBtnLink to="/Signout">
                        Sign Out
                    </NavBtnLink>
                </NavBtn>
            </Nav>
        </>
    );
};

export default Navbar;