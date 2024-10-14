import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated } from "react-spring";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AnimatedCard = animated(Card);

const ModernCard = styled(AnimatedCard)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  marginBottom: theme.spacing(2),
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.1)",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: theme.spacing(6),
  height: theme.spacing(6),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "20px",
  textTransform: "none",
  boxShadow: "none",
}));

const TicketList = ({ tickets }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomerID, setSelectedCustomerID] = useState("");
  const navigate = useNavigate();

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 280, friction: 60 },
  });

  const gotoView = (id) => {
    localStorage.setItem("ticketId", id);
    navigate("/viewTicket");
  };

  const gotoEdit = (id) => {
    localStorage.setItem("ticketId", id);
    navigate("/editTicket");
  };

  const gotoSolve = (id) => {
    localStorage.setItem("ticketId", id);
    navigate("/solveTicket");
  };

  const handleCustomerClick = (customerID) => {
    setSelectedCustomerID(customerID);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", mb: 3, color: "primary.main" }}
      >
        Pending Tickets
      </Typography>
      {tickets && tickets.length > 0 ? (
        tickets.map((ticket, index) => (
          <ModernCard key={index} style={fadeIn}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <StyledAvatar>
                    {ticket.issueDescription[0].trim()}
                  </StyledAvatar>
                </Grid>
                <Grid item xs>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "primary.main", fontWeight: "bold" }}
                  >
                    {ticket.issueDescription}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ticket ID: {ticket._id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Appointment:{" "}
                    {new Date(ticket.appointmentDate).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description: {ticket.feedback}
                  </Typography>
                  <StyledButton
                    variant="text"
                    startIcon={<PersonIcon />}
                    onClick={() => handleCustomerClick(ticket.customerID)}
                    sx={{ mt: 1 }}
                  >
                    Customer ID: {ticket.customerID}
                  </StyledButton>
                </Grid>
                <Grid item>
                  <Stack direction="column" spacing={1}>
                    <StyledButton
                      variant="contained"
                      startIcon={<CheckCircleIcon />}
                      color="success"
                      onClick={() => gotoSolve(ticket._id)}
                    >
                      Solve
                    </StyledButton>
                    <StyledButton
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      color="primary"
                      onClick={() => gotoView(ticket._id)}
                    >
                      View
                    </StyledButton>
                    <StyledButton
                      variant="outlined"
                      startIcon={<EditIcon />}
                      color="primary"
                      onClick={() => gotoEdit(ticket._id)}
                    >
                      Edit
                    </StyledButton>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </ModernCard>
        ))
      ) : (
        <Typography variant="body1" align="center">
          No pending ticket data to display
        </Typography>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Customer Details</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Customer ID: {selectedCustomerID}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Name: John Doe
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Email: johndoe@example.com
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Phone: +1 234 567 890
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketList;
