import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  InputAdornment,
  ThemeProvider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Autocomplete,
  Typography,
  CssBaseline,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated, config } from "react-spring";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import {
  Person,
  PersonOutline,
  DateRange,
  Event,
  Phone,
  Email,
  Home,
  Work,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowBack,
  Cancel,
  SaveAlt,
  Save,
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

const AddEditStaff = () => {
  const id = localStorage.getItem("editId");
  const navigate = useNavigate();
  const [staff, setStaff] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    emailAddress: "",
    address: "",
    departmentID: "",
    password: "",
    hireDate: "",
  });
  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [showHidePassword, setShowHidePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  useEffect(() => {
    if (id) {
      fetchStaffDetails(id);
      setIsEdit(true);
    }
    fetchDepartments();
  }, [id]);

  const fetchStaffDetails = async (staffId) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://govhub-backend.tharuksha.com/api/staff/${staffId}`
      );
      setStaff({
        ...res.data,
        hireDate: dayjs(res.data.hireDate).format("YYYY-MM-DD"),
        dateOfBirth: dayjs(res.data.dateOfBirth).format("YYYY-MM-DD"),
      });
    } catch (error) {
      toast.error("Error fetching staff details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        "https://govhub-backend.tharuksha.com/api/departments"
      );
      setDepartments(res.data);
    } catch (error) {
      toast.error("Error fetching departments");
    } finally {
      setIsLoading(false);
    }
  };

  const validate = () => {
    let tempErrors = {};
    const today = dayjs().format("YYYY-MM-DD");

    tempErrors.firstName = staff.firstName ? "" : "First Name is required";
    tempErrors.lastName = staff.lastName ? "" : "Last Name is required";
    tempErrors.dateOfBirth = !staff.dateOfBirth
      ? "Date of Birth is required"
      : staff.dateOfBirth > today
      ? "Date of Birth cannot be in the future"
      : "";
    tempErrors.hireDate = staff.hireDate ? "" : "Hire Date is required";
    tempErrors.emailAddress = !staff.emailAddress
      ? "Email Address is required"
      : !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(staff.emailAddress)
      ? "Email is not valid"
      : "";
    tempErrors.phoneNumber = !staff.phoneNumber
      ? "Phone Number is required"
      : !/^\d{10}$/.test(staff.phoneNumber)
      ? "Phone Number is not valid"
      : "";
    tempErrors.password = !staff.password
      ? "Password is required"
      : !/(?=.*[0-9])(?=.*[a-zA-Z]).{8,}/.test(staff.password)
      ? "Password must be at least 8 characters and include both letters and numbers"
      : "";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaff({ ...staff, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleDepartmentChange = (event, value) => {
    setStaff({ ...staff, departmentID: value ? value._id : "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (isEdit) {
        await axios.put(
          `https://govhub-backend.tharuksha.com/api/staff/${id}`,
          staff
        );
        toast.success("Staff updated successfully");
      } else {
        await axios.post(
          "https://govhub-backend.tharuksha.com/api/staff",
          staff
        );
        toast.success("Staff added successfully");
      }
      navigate("/staff");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
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
            {isEdit ? "Edit Staff" : "Add Staff"}
          </AnimatedTypography>
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={isEdit ? () => fetchStaffDetails(id) : fetchDepartments}
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
                  label="First Name"
                  name="firstName"
                  onChange={handleInputChange}
                  required
                  value={staff.firstName}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  onChange={handleInputChange}
                  required
                  value={staff.lastName}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  onChange={handleInputChange}
                  type="date"
                  value={staff.dateOfBirth}
                  required
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRange />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hire Date"
                  name="hireDate"
                  onChange={handleInputChange}
                  required
                  type="date"
                  value={staff.hireDate}
                  error={!!errors.hireDate}
                  helperText={errors.hireDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Event />
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
                  onChange={handleInputChange}
                  required
                  type="email"
                  value={staff.emailAddress}
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
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  onChange={handleInputChange}
                  required
                  value={staff.phoneNumber}
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
                <FormControl component="fieldset">
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={staff.gender}
                    onChange={handleInputChange}
                  >
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio />}
                      label="Other"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  onChange={handleInputChange}
                  required
                  error={!!errors.address}
                  value={staff.address}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Home />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={departments}
                  getOptionLabel={(option) => option.departmentName || ""}
                  onChange={handleDepartmentChange}
                  value={
                    departments.find(
                      (member) => member._id === staff.departmentID
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Department"
                      name="departmentID"
                      required
                      error={!!errors.departmentID}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Work />
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
                  label="Password"
                  name="password"
                  type={showHidePassword ? "text" : "password"}
                  onChange={handleInputChange}
                  required
                  value={staff.password}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowHidePassword(!showHidePassword)}
                          edge="end"
                        >
                          {showHidePassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
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
                onClick={() => navigate("/staff")}
                startIcon={<ArrowBack />}
              >
                Back
              </Button>
              <Button
                color="secondary"
                onClick={() => navigate("/staff")}
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

export default AddEditStaff;
