import React from "react";
import { Outlet } from "react-router-dom";

import GlobalNav from "../components/GlobalNav";


function Lobby() {


  return (
    <>
    <GlobalNav />
      <div className="wrap">
        <div id="body">
          
            <Outlet />
           
        </div>
      </div>
    </>
  );
}

export default Lobby;