import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  ThemeProvider,
  Typography,
  CssBaseline,
  Grid,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated, config } from "react-spring";
import {
  AccountCircle,
  DateRange,
  Email,
  Phone,
  Home,
  Work,
  CalendarToday,
  Wc,
  ArrowBack,
  Edit,
  Refresh,
  Print,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import theme from "../theme/Theme";
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

const ViewStaff = () => {
  const id = localStorage.getItem("viewId");
  const [staff, setStaff] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  const fetchStaffDetails = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://govhub-backend.tharuksha.com/api/staff/${id}`
      );
      setStaff(res.data);
    } catch (error) {
      console.error("Error fetching staff details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffDetails();
    return () => {
      localStorage.removeItem("userId");
    };
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    localStorage.setItem("editId", id);
    navigate("/addStaff");
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Staff Report", 14, 20);
    doc.text(`Staff ID: ${staff._id}`, 14, 30);
    doc.text(`Name: ${staff.firstName} ${staff.lastName}`, 14, 40);
    doc.text(`Date of Birth: ${staff.dateOfBirth}`, 14, 50);
    doc.text(`Gender: ${staff.gender}`, 14, 60);
    doc.text(`Phone Number: ${staff.phoneNumber}`, 14, 70);
    doc.text(`Email Address: ${staff.emailAddress}`, 14, 80);
    doc.text(`Address: ${staff.address}`, 14, 90);
    doc.text(`Department ID: ${staff.departmentID}`, 14, 100);
    doc.text(`Hire Date: ${staff.hireDate}`, 14, 110);

    doc.save("staff-report.pdf");
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
            View Staff Details
          </AnimatedTypography>
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={fetchStaffDetails}
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
                  Personal Information
                </Typography>
                <InfoItem
                  icon={<AccountCircle />}
                  label="Staff ID"
                  value={staff._id}
                />
                <InfoItem
                  icon={<AccountCircle />}
                  label="First Name"
                  value={staff.firstName}
                />
                <InfoItem
                  icon={<AccountCircle />}
                  label="Last Name"
                  value={staff.lastName}
                />
                <InfoItem
                  icon={<DateRange />}
                  label="Date of Birth"
                  value={staff.dateOfBirth}
                />
                <InfoItem icon={<Wc />} label="Gender" value={staff.gender} />
              </ModernCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <ModernCard>
                <Typography variant="h6" color="primary" gutterBottom>
                  Contact Information
                </Typography>
                <InfoItem
                  icon={<Phone />}
                  label="Phone Number"
                  value={staff.phoneNumber}
                />
                <InfoItem
                  icon={<Email />}
                  label="Email Address"
                  value={staff.emailAddress}
                />
                <InfoItem
                  icon={<Home />}
                  label="Address"
                  value={staff.address}
                />
              </ModernCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <ModernCard>
                <Typography variant="h6" color="primary" gutterBottom>
                  Employment Information
                </Typography>
                <InfoItem
                  icon={<Work />}
                  label="Department ID"
                  value={staff.departmentID}
                />
                <InfoItem
                  icon={<CalendarToday />}
                  label="Hire Date"
                  value={staff.hireDate}
                />
              </ModernCard>
            </Grid>
            <Grid item xs={12}>
              <ModernCard>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 3,
                    gap: 2,
                  }}
                >
                  <Button
                    color="inherit"
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

export default ViewStaff;
