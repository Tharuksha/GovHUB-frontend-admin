import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  ThemeProvider,
  Typography,
  CssBaseline,
  IconButton,
  Tooltip,
  LinearProgress,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated, config } from "react-spring";
import {
  AccountCircle,
  Assignment,
  AssignmentTurnedIn,
  Description,
  Work,
  EventNote,
  Feedback,
  ArrowBack,
  Edit,
  Print,
  Refresh,
  Cancel,
} from "@mui/icons-material";
import axios from "axios";
import theme from "../theme/Theme";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

const ViewTicket = () => {
  const id = localStorage.getItem("ticketId");
  const [ticket, setTicket] = useState({});
  const [customer, setCustomer] = useState({});
  const [department, setDepartment] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  const fetchTicketData = async () => {
    setIsLoading(true);
    try {
      const ticketRes = await axios.get(
        `https://govhub-backend-6375764a4f5c.herokuapp.com/api/tickets/${id}`
      );
      setTicket(ticketRes.data);

      const customerRes = await axios.get(
        `https://govhub-backend-6375764a4f5c.herokuapp.com/api/customers/${ticketRes.data.customerID}`
      );
      setCustomer(customerRes.data);

      const departmentRes = await axios.get(
        `https://govhub-backend-6375764a4f5c.herokuapp.com/api/departments/${ticketRes.data.departmentID}`
      );
      setDepartment(departmentRes.data);
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketData();
    return () => {
      localStorage.removeItem("ticketId");
    };
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    localStorage.setItem("editId", id);
    navigate("/editTicket");
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Ticket Report", 14, 20);
    doc.text(`Ticket ID: ${ticket._id}`, 14, 30);
    doc.text(`Customer ID: ${customer._id}`, 14, 40);
    doc.text(
      `Customer Name: ${customer.firstName} ${customer.lastName}`,
      14,
      50
    );
    doc.text(`Department: ${department.departmentName}`, 14, 60);
    doc.text(`Issue Description: ${ticket.issueDescription}`, 14, 70);
    doc.text(`Status: ${ticket.status}`, 14, 80);
    doc.text(`Created Date: ${ticket.createdDate}`, 14, 90);
    doc.text(`Closed Date: ${ticket.closedDate || "N/A"}`, 14, 100);
    doc.text(`Notes: ${ticket.notes}`, 14, 110);
    doc.text(`Feedback: ${ticket.feedback || "N/A"}`, 14, 120);

    if (ticket.status === "Rejected") {
      doc.text(
        `Rejection Reason: ${ticket.rejectionReason || "No reason provided"}`,
        14,
        130
      );
    }

    doc.autoTable({
      head: [["Department", "Customer"]],
      body: [
        [
          department.departmentName,
          `${customer.firstName} ${customer.lastName}`,
        ],
        [department.emailAddress, customer.emailAddress],
        [department.phoneNumber, customer.phoneNumber],
        [department.departmentDescription, customer.address],
        [
          department.operatingHours,
          customer.dateOfBirth ? customer.dateOfBirth.toString() : "N/A",
        ],
      ],
      startY: 140,
    });

    doc.save("ticket-report.pdf");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "30px 40px",
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
            View Ticket Details
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ModernCard>
                <Typography variant="h6" color="primary" gutterBottom>
                  Ticket Information
                </Typography>
                <InfoItem
                  icon={<Assignment />}
                  label="Ticket ID"
                  value={ticket._id}
                />
                <InfoItem
                  icon={<Description />}
                  label="Issue Description"
                  value={ticket.issueDescription}
                />
                <InfoItem
                  icon={<AssignmentTurnedIn />}
                  label="Status"
                  value={ticket.status}
                />
                <InfoItem
                  icon={<EventNote />}
                  label="Created Date"
                  value={new Date(ticket.createdDate).toLocaleString()}
                />
                <InfoItem
                  icon={<EventNote />}
                  label="Closed Date"
                  value={
                    ticket.closedDate
                      ? new Date(ticket.closedDate).toLocaleString()
                      : "N/A"
                  }
                />
                <InfoItem
                  icon={<Assignment />}
                  label="Notes"
                  value={ticket.notes}
                />
                <InfoItem
                  icon={<Feedback />}
                  label="Feedback"
                  value={ticket.feedback || "N/A"}
                />
              </ModernCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <ModernCard>
                <Typography variant="h6" color="primary" gutterBottom>
                  Customer Information
                </Typography>
                <InfoItem
                  icon={<AccountCircle />}
                  label="Customer ID"
                  value={customer._id}
                />
                <InfoItem
                  icon={<AccountCircle />}
                  label="Customer Name"
                  value={`${customer.firstName} ${customer.lastName}`}
                />
                <InfoItem
                  icon={<Work />}
                  label="Department"
                  value={department.departmentName}
                />
              </ModernCard>
            </Grid>
            {ticket.status === "Rejected" && (
              <Grid item xs={12}>
                <ModernCard>
                  <Typography variant="h6" color="error" gutterBottom>
                    Rejection Information
                  </Typography>
                  <InfoItem
                    icon={<Cancel />}
                    label="Rejection Reason"
                    value={ticket.rejectionReason || "No reason provided"}
                  />
                </ModernCard>
              </Grid>
            )}
            <Grid item xs={12}>
              <ModernCard>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    color="primary"
                    onClick={handleBack}
                    startIcon={<ArrowBack />}
                  >
                    Back
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleEdit}
                    startIcon={<Edit />}
                  >
                    Edit
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={generatePDF}
                    startIcon={<Print />}
                  >
                    Generate PDF
                  </Button>
                </Box>
              </ModernCard>
            </Grid>
          </Grid>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default ViewTicket;
