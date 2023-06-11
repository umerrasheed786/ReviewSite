import React from 'react'
import AppSidebar from "../components/AppSidebar"
import AppHeader from "../components/AppHeader"
import AppFooter from "../components/AppFooter"


import { Outlet } from "react-router-dom";

const layout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <Outlet />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default layout