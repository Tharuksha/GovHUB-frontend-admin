import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  Grid,
  Typography,
  ThemeProvider,
  CssBaseline,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated } from "react-spring";
import axios from "axios";
import theme from "../theme/Theme";
import {
  CalendarViewMonthRounded,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import RecentlySolvedTicketCard from "../Components/Dashboard/Staff/RecentlySolvedTicket";
import TicketHistory from "../Components/Dashboard/Staff/TicketHistory";
import StaffPerformanceChart from "../Components/Dashboard/Staff/StaffPerformanceChart";
import DepartmentAnnouncements from "../Components/Dashboard/Staff/DepartmentAnnouncements";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AnimatedCard = animated(Card);

const ModernCard = styled(AnimatedCard)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  padding: theme.spacing(3),
  backgroundColor: "#ffffff",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.1)",
  },
}));

const StaffDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("staff"));

  const [userSolvedTicket, setUserSolvedTicket] = useState(0);
  const [topStaff, setTopStaff] = useState([]);
  const [duration, setDuration] = useState("today");
  const [userDuration, setUserDuration] = useState("today");
  const [performance, setPerformance] = useState("best");
  const [recentSolvedTickets, setRecentSolvedTickets] = useState([]);
  const [userTicketHistory, setUserTicketHistory] = useState([]);
  const [userPerformance, setUserPerformance] = useState([]);
  const [pendingTickets, setPendingTickets] = useState([]);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    const fetchSolvedAndPendingTickets = async () => {
      try {
        const response = await axios.post(
          "https://govhub-backend-6375764a4f5c.herokuapp.com/api/dashboard/staff/performance",
          { staffID: user?.id }
        );
        setUserPerformance(response.data[user?.id]);
      } catch (error) {
        console.error("Error fetching solved and pending tickets", error);
      }
    };

    fetchSolvedAndPendingTickets();
  }, [user?.id]);

  useEffect(() => {
    const fetchTopStaff = async () => {
      try {
        const response = await axios.post(
          "https://govhub-backend-6375764a4f5c.herokuapp.com/api/dashboard/staff/solvedTickets",
          { duration, performance }
        );
        setTopStaff(response.data);
      } catch (error) {
        console.error("Error fetching top staff", error);
      }
    };

    fetchTopStaff();
  }, [duration, performance]);

  useEffect(() => {
    const fetchRecentSolvedTickets = async () => {
      try {
        const response = await axios.get(
          `https://govhub-backend-6375764a4f5c.herokuapp.com/api/dashboard/staff/recentSolvedTickets/${user?.id}`
        );
        setRecentSolvedTickets(response.data);
      } catch (error) {
        console.error("Error fetching recent solved tickets", error);
      }
    };

    fetchRecentSolvedTickets();
  }, [user?.id]);

  useEffect(() => {
    const fetchUserTicketHistory = async () => {
      try {
        const response = await axios.get(
          `https://govhub-backend-6375764a4f5c.herokuapp.com/api/dashboard/staff/solvedTicketsHistory/${user?.id}`
        );
        setUserTicketHistory(response.data);
      } catch (error) {
        console.error("Error fetching user ticket history", error);
      }
    };

    fetchUserTicketHistory();
  }, [user?.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          "https://govhub-backend-6375764a4f5c.herokuapp.com/api/dashboard/staff/solvedTickets/" +
            user?.id,
          { duration: userDuration }
        );
        setUserSolvedTicket(res.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [user?.id, userDuration]);

  useEffect(() => {
    fetchPendingTickets();
  }, [user?.departmentID]);

  const fetchPendingTickets = async () => {
    try {
      const res = await axios.get(
        "https://govhub-backend-6375764a4f5c.herokuapp.com/api/tickets"
      );
      let ticketList = res.data.filter(
        (item) =>
          item.status === "Pending" && item.departmentID === user?.departmentID
      );
      setPendingTickets(ticketList);
    } catch (error) {
      console.error("Error fetching pending tickets", error);
    }
  };

  const onDurationchange = (value) => {
    setDuration(value);
  };

  const onPerformancechange = (value) => {
    setPerformance(value);
  };

  const gotoView = (id) => {
    localStorage.setItem("ticketId", id);
    navigate("/viewTicket");
  };

  const gotoSolve = (id) => {
    localStorage.setItem("ticketId", id);
    navigate("/solveTicket");
  };

  const handleReject = (id) => {
    setSelectedTicketId(id);
    setRejectDialogOpen(true);
  };

  const handleRejectClose = () => {
    setRejectDialogOpen(false);
    setRejectReason("");
    setSelectedTicketId(null);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      await axios.put(
        `https://govhub-backend-6375764a4f5c.herokuapp.com/api/tickets/${selectedTicketId}/reject`,
        {
          rejectionReason: rejectReason,
        }
      );
      toast.success("Ticket rejected successfully");
      handleRejectClose();
      fetchPendingTickets(); // Refresh the pending tickets list
    } catch (error) {
      console.error("Error rejecting ticket:", error);
      toast.error("Failed to reject ticket");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: 4,
          backgroundColor: "#f5f7fa",
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 4, color: "primary.main", fontWeight: "bold" }}
        >
          Staff Dashboard
        </Typography>
        <Grid container spacing={3}>
          {/* Solved Issues Counter */}
          <Grid item xs={12}>
            <ModernCard>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" alignItems="center">
                    <CalendarViewMonthRounded
                      sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                    />
                    <Typography variant="h6">Solved Issues</Typography>
                  </Box>
                  <Select
                    value={userDuration}
                    onChange={(e) => setUserDuration(e.target.value)}
                    sx={{ width: 200 }}
                  >
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="thisWeek">This week</MenuItem>
                    <MenuItem value="lastWeek">Last week</MenuItem>
                    <MenuItem value="thisMonth">This Month</MenuItem>
                    <MenuItem value="lastMonth">Last Month</MenuItem>
                    <MenuItem value="thisYear">This Year</MenuItem>
                    <MenuItem value="lastYear">Last Year</MenuItem>
                  </Select>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {userSolvedTicket.count}
                  </Typography>
                </Box>
              </CardContent>
            </ModernCard>
          </Grid>

          {/* Department Announcements */}
          <Grid item xs={12}>
            <ModernCard>
              <DepartmentAnnouncements user={user} />
            </ModernCard>
          </Grid>

          {/* Pending Tickets */}
          <Grid item xs={12}>
            <ModernCard>
              <Typography variant="h6" gutterBottom color="primary.main">
                Pending Tickets
              </Typography>
              {pendingTickets.length > 0 ? (
                pendingTickets.map((ticket, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      p: 2,
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                        {ticket.issueDescription[0]}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="primary.main"
                        >
                          {ticket.issueDescription}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Appointment:{" "}
                          {moment(ticket.appointmentDate).format(
                            "MMMM D, YYYY"
                          )}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          Requested Time:{" "}
                          {moment(ticket.appointmentDate).format("h:mm A")}
                        </Typography>
                      </Box>
                    </Box>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="outlined"
                        startIcon={<CheckCircleIcon />}
                        color="success"
                        onClick={() => gotoSolve(ticket._id)}
                      >
                        Solve
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        color="error"
                        onClick={() => handleReject(ticket._id)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        color="primary"
                        onClick={() => gotoView(ticket._id)}
                      >
                        View
                      </Button>
                    </Stack>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" align="center">
                  No pending ticket data to display
                </Typography>
              )}
            </ModernCard>
          </Grid>

          {/* Staff Performance and Chart */}
          <Grid item xs={12} md={6}>
            <ModernCard>
              <Typography variant="h6" gutterBottom color="primary.main">
                Staff Performance
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Select
                  value={duration}
                  onChange={(e) => onDurationchange(e.target.value)}
                  sx={{ width: "48%" }}
                >
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="thisWeek">This week</MenuItem>
                  <MenuItem value="lastWeek">Last week</MenuItem>
                  <MenuItem value="thisMonth">This Month</MenuItem>
                  <MenuItem value="lastMonth">Last Month</MenuItem>
                  <MenuItem value="thisYear">This Year</MenuItem>
                  <MenuItem value="lastYear">Last Year</MenuItem>
                </Select>
                <Select
                  value={performance}
                  onChange={(e) => onPerformancechange(e.target.value)}
                  sx={{ width: "48%" }}
                >
                  <MenuItem value="best">Best Performed</MenuItem>
                  <MenuItem value="worst">Worst Performed</MenuItem>
                </Select>
              </Box>
              <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                {topStaff.map((staff, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      p: 2,
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                        {staff.staffName[0]}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="primary.main"
                        >
                          {staff.staffName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {staff.staffRole}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1">
                      Resolved: {staff.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </ModernCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <ModernCard>
              <Typography variant="h6" gutterBottom color="primary.main">
                Your Past Week Performance
              </Typography>
              <Box sx={{ height: 300, width: "100%", padding: 2 }}>
                <StaffPerformanceChart
                  performanceData={userPerformance}
                  chartHeight={250}
                  chartWidth="100%"
                />
              </Box>
            </ModernCard>
          </Grid>

          {/* Recent Solved Tickets and Ticket History */}
          <Grid item xs={12}>
            <ModernCard>
              <Typography variant="h6" gutterBottom color="primary.main">
                Recent Solved Tickets
              </Typography>
              <RecentlySolvedTicketCard ticket={recentSolvedTickets} />
            </ModernCard>
          </Grid>

          <Grid item xs={12}>
            <ModernCard>
              <Typography variant="h6" gutterBottom color="primary.main">
                Ticket History
              </Typography>
              <Box sx={{ height: 400, overflowY: "auto" }}>
                <TicketHistory tickets={userTicketHistory} />
              </Box>
            </ModernCard>
          </Grid>
        </Grid>

        {/* Reject Ticket Dialog */}
        <Dialog open={rejectDialogOpen} onClose={handleRejectClose}>
          <DialogTitle>Reject Ticket</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="reject-reason"
              label="Reason for Rejection"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRejectClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleRejectSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default StaffDashboard;
