import Header from "./Header";
import NavBar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const [activeTab, setActiveTab] = useState("actividades");

  return (
    <>
      <Header />
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
      <Outlet />
    </>
  );
}