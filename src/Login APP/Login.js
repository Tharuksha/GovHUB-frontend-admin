import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSpring, animated, config } from "react-spring";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Logo from "../assets/logo.png"; // Assuming logo.png is present in assets

// Theme setup
const theme = createTheme({
  palette: {
    primary: {
      main: "#2979ff",
    },
    background: {
      default: "#e3f2fd",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            transition: "border-color 0.3s ease, background-color 0.3s ease",
            "&:hover fieldset": {
              borderColor: "#2979ff",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2979ff",
              backgroundColor: "#e3f2fd",
            },
          },
        },
      },
    },
  },
});

const AnimatedBox = animated(Box);
const AnimatedTextField = animated(TextField);
const AnimatedButton = animated(Button);
const AnimatedTypography = animated(Typography);
const AnimatedContainer = animated(Container);

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation for form sliding in from the bottom
  const slideInForm = useSpring({
    from: { transform: "translateY(50px)", opacity: 0 },
    to: { transform: "translateY(0px)", opacity: 1 },
    config: config.slow,
  });

  // Animation for logo bouncing on load
  const bounceLogo = useSpring({
    from: { transform: "scale(1)", opacity: 0 },
    to: { transform: "scale(1.1)", opacity: 1 },
    config: { tension: 180, friction: 12 },
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://govhub-backend.tharuksha.com/api/staff/login",
        credentials
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("staff", JSON.stringify(res.data.staff));
      toast.success("Login successful");
      setLoading(false);
      navigate("/");
      window.location.reload();
    } catch (error) {
      setLoading(false);
      toast.error("Login failed! " + error.response.data.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatedBox
        style={slideInForm}
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #e3f2fd, #bbdefb, #90caf9, #64b5f6)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 6s ease infinite",
          "@keyframes gradientShift": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
        }}
      >
        <AnimatedContainer component="main" maxWidth="xs">
          <AnimatedBox
            style={slideInForm}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              padding: 4,
              borderRadius: 3,
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
            }}
          >
            <animated.img
              src={Logo}
              alt="Company Logo"
              style={{
                ...bounceLogo,
                width: "140px",
                height: "auto",
                marginBottom: "24px",
              }}
            />
            <AnimatedTypography
              component="h1"
              variant="h5"
              sx={{ mb: 3, fontWeight: 600 }}
            >
              Portal Login
            </AnimatedTypography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              <AnimatedTextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleInputChange}
                value={credentials.email}
                variant="outlined"
              />
              <AnimatedTextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                onChange={handleInputChange}
                value={credentials.password}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <AnimatedButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Sign In"
                )}
              </AnimatedButton>
            </Box>
          </AnimatedBox>
        </AnimatedContainer>
      </AnimatedBox>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default LoginPage;
