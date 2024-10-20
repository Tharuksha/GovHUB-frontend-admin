import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import TopToolBar from "./Layout/TopNavBar";
import SideBar from "./Layout/SideBar";
import Dashboard from "./Dashboard App/Dashboard";
import DepartmentApp from "./Department App/Department";
import AddEditDepartments from "./Department App/AddEditDepartments";
import StaffApp from "./Staff App/Staff";
import { ThemeProvider } from "@mui/material";
import theme from "./theme/Theme";
import AddEditStaff from "./Staff App/AddEditStaff";
import ViewStaff from "./Staff App/ViewStaff";
import ViewDepartment from "./Department App/ViewDepartment";
import TicketApp from "./Ticket App/Ticket";
import AddEditTicket from "./Ticket App/AddEditTicket";
import Login from "./Login APP/Login";
import ViewTicket from "./Ticket App/ViewTicket";
import SolveTicket from "./Ticket App/SolveTicket";
import MessageCenter from "./Message App/MessageCenter"; // Import the new MessageCenter component
import RejectTicket from "./Ticket App/RejectTicket";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("staff")));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("staff")));
  }, [user]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <main className="App">
          {user && <SideBar />}
          <div
            style={{
              marginLeft: !user ? 0 : 230,
              marginTop: !user ? 0 : "50px",
            }}
          >
            {user && <TopToolBar />}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/department" element={<DepartmentApp />} />
              <Route path="/addDepartment" element={<AddEditDepartments />} />
              <Route path="/viewDepartment" element={<ViewDepartment />} />
              <Route path="/staff" element={<StaffApp />} />
              <Route path="/addStaff" element={<AddEditStaff />} />
              <Route path="/viewStaff" element={<ViewStaff />} />
              <Route path="/ticket" element={<TicketApp />} />
              <Route path="/viewTicket" element={<ViewTicket />} />
              <Route path="/editTicket" element={<AddEditTicket />} />
              <Route path="/solveTicket" element={<SolveTicket />} />
              <Route path="/messages" element={<MessageCenter />} />
              <Route path="/rejectTicket" element={<RejectTicket />} />
            </Routes>
          </div>
        </main>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
