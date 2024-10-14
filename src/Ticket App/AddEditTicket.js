import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  ThemeProvider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated } from "react-spring";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  Person,
  AssignmentInd,
  Business,
  Description,
  ListAlt,
  CalendarToday,
  Note,
  Feedback,
  SaveAlt,
  Save,
  ArrowBack,
  Cancel,
} from "@mui/icons-material";
import theme from "../theme/Theme";

const AnimatedCard = animated(Card);

const ModernCard = styled(AnimatedCard)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "20px",
  padding: "8px 24px",
  textTransform: "none",
  fontWeight: 600,
}));

const AddEditTicket = () => {
  const id = localStorage.getItem("ticketId");
  const navigate = useNavigate();
  const [ticket, setTicket] = useState({
    customerID: "",
    staffID: "",
    departmentID: "",
    issueDescription: "",
    status: "",
    createdDate: "",
    closedDate: "",
    notes: "",
    feedback: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 280, friction: 60 },
  });

  useEffect(() => {
    if (id) {
      const fetchTicketDetails = async () => {
        try {
          const res = await axios.get(
            `http://localhost:8070/api/tickets/${id}`
          );
          setTicket(res.data);
          setIsEdit(true);
        } catch (error) {
          toast.error("Failed to fetch ticket details");
        }
      };
      fetchTicketDetails();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEdit && name !== "feedback") {
      return; // Prevent changes to other fields when editing
    }
    setTicket({ ...ticket, [name]: value });
  };

  const handleDateChange = (e) => {
    if (isEdit) return; // Prevent date changes when editing
    const { name, value } = e.target;
    setTicket({ ...ticket, [name]: new Date(value).toISOString() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://localhost:8070/api/tickets/${id}`, {
          feedback: ticket.feedback,
        });
        toast.success("Feedback updated successfully");
      } else {
        await axios.post("http://localhost:8070/api/tickets", ticket);
        toast.success("Ticket added successfully");
      }
      navigate("/ticket");
    } catch (error) {
      toast.error("Failed to save ticket");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: 3, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
        <ToastContainer />
        <ModernCard style={fadeIn}>
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              color="primary"
              fontWeight="bold"
            >
              {isEdit ? "Edit Ticket Feedback" : "Add New Ticket"}
            </Typography>
            <Typography variant="body2" gutterBottom color="text.secondary">
              {isEdit
                ? "Only feedback can be edited"
                : "Fill in the details to add a new ticket"}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Customer ID"
                    name="customerID"
                    value={ticket.customerID}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    disabled={isEdit}
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
                    label="Staff ID"
                    name="staffID"
                    value={ticket.staffID}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    disabled={isEdit}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AssignmentInd />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Issue Description"
                    name="issueDescription"
                    value={ticket.issueDescription}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    disabled={isEdit}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Created Date"
                    name="createdDate"
                    type="date"
                    value={
                      ticket.createdDate ? ticket.createdDate.split("T")[0] : ""
                    }
                    onChange={handleDateChange}
                    required
                    variant="outlined"
                    disabled={isEdit}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Closed Date"
                    name="closedDate"
                    type="date"
                    value={
                      ticket.closedDate ? ticket.closedDate.split("T")[0] : ""
                    }
                    onChange={handleDateChange}
                    variant="outlined"
                    disabled={isEdit}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                {/* Add other form fields here, following the same pattern */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Feedback"
                    name="feedback"
                    value={ticket.feedback}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    multiline
                    rows={4}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Feedback />
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
                  mt: 4,
                  gap: 2,
                }}
              >
                <Tooltip title="Go back to previous page">
                  <StyledButton
                    color="inherit"
                    onClick={() => navigate(-1)}
                    startIcon={<ArrowBack />}
                  >
                    Back
                  </StyledButton>
                </Tooltip>

                <Tooltip title={isEdit ? "Update ticket" : "Save new ticket"}>
                  <StyledButton
                    color="primary"
                    type="submit"
                    variant="contained"
                    startIcon={isEdit ? <SaveAlt /> : <Save />}
                  >
                    {isEdit ? "Update" : "Save"}
                  </StyledButton>
                </Tooltip>
              </Box>
            </form>
          </CardContent>
        </ModernCard>
      </Box>
    </ThemeProvider>
  );
};

export default AddEditTicket;
