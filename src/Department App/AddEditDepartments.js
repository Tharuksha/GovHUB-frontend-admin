import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  ThemeProvider,
  Typography,
  CssBaseline,
  TextField,
  InputAdornment,
  Grid,
  Autocomplete,
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
  SaveAlt,
  Save,
  ArrowBack,
  Cancel,
  Refresh,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

const AddEditDepartments = () => {
  const id = localStorage.getItem("editId");
  const navigate = useNavigate();
  const [department, setDepartment] = useState({
    departmentName: "",
    departmentDescription: "",
    phoneNumber: "",
    emailAddress: "",
    departmentHeadID: "",
    operatingHours: "",
  });
  const [appointmentReasons, setAppointmentReasons] = useState([""]); // Added for appointment reasons
  const [isEdit, setIsEdit] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [previousHeadID, setPreviousHeadID] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  useEffect(() => {
    if (id) {
      fetchDepartmentDetails();
    }
    fetchStaffMembers();
  }, [id]);

  const fetchDepartmentDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://govhub-backend.onrender.com/api/departments/${id}`
      );
      setDepartment(response.data);
      setIsEdit(true);
      setPreviousHeadID(response.data.departmentHeadID);
      setAppointmentReasons(response.data.appointmentReasons || [""]);
    } catch (error) {
      console.error("Error fetching department details:", error);
      toast.error("Error fetching department details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStaffMembers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://govhub-backend.onrender.com/api/staff"
      );
      setStaffMembers(response.data);
    } catch (error) {
      console.error("Error fetching staff members:", error);
      toast.error("Error fetching staff members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleAppointmentReasonChange = (index, value) => {
    const updatedReasons = [...appointmentReasons];
    updatedReasons[index] = value;
    setAppointmentReasons(updatedReasons);
  };

  const addAppointmentReason = () => {
    setAppointmentReasons([...appointmentReasons, ""]);
  };

  const removeAppointmentReason = (index) => {
    const updatedReasons = [...appointmentReasons];
    updatedReasons.splice(index, 1);
    setAppointmentReasons(updatedReasons);
  };

  const validateInputs = () => {
    let tempErrors = {};
    tempErrors.departmentName = !/^[a-zA-Z0-9 ]{2,50}$/.test(
      department.departmentName
    )
      ? "Department Name should be 2-50 characters long and contain only letters, numbers, and spaces."
      : "";
    tempErrors.departmentDescription = !department.departmentDescription.trim()
      ? "Department Description is required."
      : "";
    tempErrors.phoneNumber = !/^\d{7,15}$/.test(department.phoneNumber)
      ? "Phone Number should be 7-15 digits long."
      : "";
    tempErrors.emailAddress = !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(
      department.emailAddress
    )
      ? "Enter a valid email address."
      : "";
    tempErrors.operatingHours = !department.operatingHours
      ? "Enter a valid time in HH:MM format."
      : "";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        ...department,
        appointmentReasons, // Include appointment reasons in the payload
      };
      if (isEdit) {
        await axios.put(
          `https://govhub-backend.onrender.com/api/departments/${id}`,
          payload
        );
        toast.success("Department updated successfully");
      } else {
        await axios.post(
          "https://govhub-backend.onrender.com/api/departments",
          payload
        );
        toast.success("Department added successfully");
      }
      navigate("/department");
      localStorage.removeItem("editId");
    } catch (error) {
      console.error("API error:", error);
      toast.error(error.response?.data?.message || "Failed to save department");
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
            {isEdit ? "Edit Department" : "Add Department"}
          </AnimatedTypography>
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={isEdit ? fetchDepartmentDetails : fetchStaffMembers}
              color="primary"
              disabled={isLoading}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {isLoading && <LinearProgress sx={{ mb: 2 }} />}

        <ModernCard>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Department Name"
                  name="departmentName"
                  value={department.departmentName}
                  onChange={handleInputChange}
                  required
                  error={!!errors.departmentName}
                  helperText={errors.departmentName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Department Description"
                  name="departmentDescription"
                  value={department.departmentDescription}
                  onChange={handleInputChange}
                  required
                  error={!!errors.departmentDescription}
                  helperText={errors.departmentDescription}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Description />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  value={department.phoneNumber}
                  onChange={handleInputChange}
                  required
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="emailAddress"
                  type="email"
                  value={department.emailAddress}
                  onChange={handleInputChange}
                  required
                  error={!!errors.emailAddress}
                  helperText={errors.emailAddress}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={staffMembers}
                  getOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName}`
                  }
                  onChange={(event, newValue) =>
                    setDepartment({
                      ...department,
                      departmentHeadID: newValue?._id || "",
                    })
                  }
                  value={
                    staffMembers.find(
                      (member) => member._id === department.departmentHeadID
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Department Head"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Operating Hours"
                  name="operatingHours"
                  type="time"
                  value={department.operatingHours}
                  onChange={handleInputChange}
                  required
                  error={!!errors.operatingHours}
                  helperText={errors.operatingHours}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTime />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* New Section for Appointment Reasons */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Appointment Reasons
                </Typography>
                {appointmentReasons.map((reason, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                  >
                    <TextField
                      fullWidth
                      label={`Reason ${index + 1}`}
                      value={reason}
                      onChange={(e) =>
                        handleAppointmentReasonChange(index, e.target.value)
                      }
                      sx={{ mr: 2 }}
                    />
                    <IconButton
                      color="secondary"
                      onClick={() => removeAppointmentReason(index)}
                    >
                      <Cancel />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={addAppointmentReason}
                  startIcon={<AddIcon />}
                >
                  Add Reason
                </Button>
              </Grid>
            </Grid>
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
                onClick={() => navigate("/department")}
                startIcon={<ArrowBack />}
              >
                Back
              </Button>
              <Button
                color="secondary"
                onClick={() => navigate("/department")}
                startIcon={<Cancel />}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                variant="contained"
                startIcon={isEdit ? <SaveAlt /> : <Save />}
                disabled={isLoading}
              >
                {isEdit ? "Update" : "Save"}
              </Button>
            </Box>
          </form>
        </ModernCard>
      </Box>
      <ToastContainer position="bottom-right" />
    </ThemeProvider>
  );
};

export default AddEditDepartments;
