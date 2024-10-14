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
  Business,
  Description,
  Phone,
  Email,
  Person,
  AccessTime,
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

const ViewDepartment = () => {
  const id = localStorage.getItem("viewId");
  const [department, setDepartment] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  const fetchDepartment = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://govhub-backend.tharuksha.com/api/departments/${id}`
      );
      setDepartment(res.data);
      localStorage.setItem("departmentId", id);
    } catch (error) {
      console.error("Error fetching department details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
    return () => {
      localStorage.removeItem("departmentId");
    };
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    localStorage.setItem("editId", id);
    navigate("/addDepartment");
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Department Report", 14, 20);
    doc.text(`Department ID: ${department._id}`, 14, 30);
    doc.text(`Department Name: ${department.departmentName}`, 14, 40);
    doc.text(`Description: ${department.departmentDescription}`, 14, 50);
    doc.text(`Phone Number: ${department.phoneNumber}`, 14, 60);
    doc.text(`Email Address: ${department.emailAddress}`, 14, 70);
    doc.text(`Department Head ID: ${department.departmentHeadID}`, 14, 80);
    doc.text(`Operating Hours: ${department.operatingHours}`, 14, 90);

    doc.save("department-report.pdf");
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
            View Department Details
          </AnimatedTypography>
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={fetchDepartment}
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
                  Department Information
                </Typography>
                <InfoItem
                  icon={<Business />}
                  label="Department ID"
                  value={department._id}
                />
                <InfoItem
                  icon={<Business />}
                  label="Department Name"
                  value={department.departmentName}
                />
                <InfoItem
                  icon={<Description />}
                  label="Description"
                  value={department.departmentDescription}
                />
                <InfoItem
                  icon={<Phone />}
                  label="Phone Number"
                  value={department.phoneNumber}
                />
              </ModernCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <ModernCard>
                <Typography variant="h6" color="primary" gutterBottom>
                  Additional Details
                </Typography>
                <InfoItem
                  icon={<Email />}
                  label="Email Address"
                  value={department.emailAddress}
                />
                <InfoItem
                  icon={<Person />}
                  label="Department Head ID"
                  value={department.departmentHeadID}
                />
                <InfoItem
                  icon={<AccessTime />}
                  label="Operating Hours"
                  value={department.operatingHours}
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

export default ViewDepartment;
