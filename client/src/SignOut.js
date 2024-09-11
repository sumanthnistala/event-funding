import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Signout()
{
    const navigate = useNavigate();
    localStorage.setItem("username","");
    localStorage.setItem("token","");
    navigate("/");
}