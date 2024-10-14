import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  ThemeProvider,
  TextField,
  InputAdornment,
  CssBaseline,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated, config } from "react-spring";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Person,
  Description,
  CalendarToday,
  Note,
  Feedback,
  SaveAlt,
  ArrowBack,
  Cancel,
  Email,
  Phone,
  Home,
  Work,
  Refresh,
} from "@mui/icons-material";
import theme from "../theme/Theme";

const AnimatedTypography = animated(Typography);

const ModernCard = styled(Card)(({ theme }) => ({
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

const InfoItem = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
    {React.cloneElement(icon, {
      style: {
        fontSize: 24,
        marginRight: "12px",
        color: theme.palette.primary.main,
      },
    })}
    <Typography variant="body1">
      <strong>{label}:</strong> {value}
    </Typography>
  </Box>
);

const SolveTicket = () => {
  const id = localStorage.getItem("ticketId");
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [department, setDepartment] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("staff"));

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  useEffect(() => {
    fetchTicketData();
  }, [id]);

  const fetchTicketData = async () => {
    setIsLoading(true);
    try {
      const ticketRes = await axios.get(
        `https://govhub-backend.tharuksha.com/api/tickets/${id}`
      );
      setTicket(ticketRes.data);

      const customerRes = await axios.get(
        `https://govhub-backend.tharuksha.com/api/customers/${ticketRes.data.customerID}`
      );
      setCustomer(customerRes.data);

      const departmentRes = await axios.get(
        `https://govhub-backend.tharuksha.com/api/departments/${ticketRes.data.departmentID}`
      );
      setDepartment(departmentRes.data);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch ticket data");
      setIsLoading(false);
    }
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(
        `https://govhub-backend.tharuksha.com/api/tickets/${id}`,
        {
          ...ticket,
          feedback,
          status: "Solved",
          staffID: user.id,
          closedDate: new Date().toISOString(),
        }
      );
      toast.success("Ticket updated successfully");
      navigate("/ticket");
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket");
    } finally {
      setIsLoading(false);
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
          paddingTop: "30px",
          paddingLeft: "40px",
          paddingRight: "40px",
          backgroundColor: "#f5f7fa",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <AnimatedTypography
            variant="h4"
            style={fadeIn}
            color="primary"
            fontWeight="bold"
          >
            Solve Ticket
          </AnimatedTypography>
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={fetchTicketData}
              color="primary"
              disabled={isLoading}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {isLoading && <LinearProgress sx={{ mb: 2 }} />}

        {!isLoading && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ModernCard>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Customer Details
                  </Typography>
                  {customer && (
                    <>
                      <InfoItem
                        icon={<Person />}
                        label="Name"
                        value={`${customer.firstName} ${customer.lastName}`}
                      />
                      <InfoItem
                        icon={<Description />}
                        label="NIC"
                        value={customer.NIC}
                      />
                      <InfoItem
                        icon={<Email />}
                        label="Email"
                        value={customer.emailAddress}
                      />
                      <InfoItem
                        icon={<Phone />}
                        label="Mobile"
                        value={customer.phoneNumber}
                      />
                      <InfoItem
                        icon={<Home />}
                        label="Address"
                        value={customer.address}
                      />
                    </>
                  )}
                </ModernCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <ModernCard>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Department & Ticket Details
                  </Typography>
                  {department && (
                    <InfoItem
                      icon={<Work />}
                      label="Department"
                      value={department.departmentName}
                    />
                  )}
                  {ticket && (
                    <>
                      <InfoItem
                        icon={<Description />}
                        label="Topic"
                        value={ticket.issueDescription}
                      />
                      <InfoItem
                        icon={<Note />}
                        label="Description"
                        value={ticket.notes}
                      />
                      <InfoItem
                        icon={<Note />}
                        label="Status"
                        value={ticket.status}
                      />
                      <InfoItem
                        icon={<CalendarToday />}
                        label="Create Date"
                        value={new Date(
                          ticket.createdDate
                        ).toLocaleDateString()}
                      />
                      <InfoItem
                        icon={<CalendarToday />}
                        label="Appointment Date"
                        value={
                          ticket.appointmentDate
                            ? new Date(
                                ticket.appointmentDate
                              ).toLocaleDateString()
                            : "Not Set"
                        }
                      />
                    </>
                  )}
                </ModernCard>
              </Grid>

              <Grid item xs={12}>
                <ModernCard>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Add Feedback
                  </Typography>
                  <TextField
                    fullWidth
                    label="Feedback"
                    name="feedback"
                    value={feedback}
                    onChange={handleFeedbackChange}
                    multiline
                    rows={4}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Feedback />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 3,
                    }}
                  >
                    <Button
                      color="primary"
                      onClick={() => navigate("/ticket")}
                      startIcon={<ArrowBack />}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>

                    <Button
                      color="primary"
                      type="submit"
                      variant="contained"
                      startIcon={<SaveAlt />}
                      disabled={isLoading}
                    >
                      Save
                    </Button>
                  </Box>
                </ModernCard>
              </Grid>
            </Grid>
          </form>
        )}
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default SolveTicket;
