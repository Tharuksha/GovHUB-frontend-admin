import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Stack,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
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
import axios from "axios";
import CustomerDetailsDialog from "./CustomerDetailsDialog";
import InfiniteScroll from "react-infinite-scroll-component";

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

const TicketHistory = ({ tickets: allTickets }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomerID, setSelectedCustomerID] = useState("");
  const [customerData, setCustomerData] = useState({});
  const [displayedTickets, setDisplayedTickets] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 280, friction: 60 },
  });

  useEffect(() => {
    if (allTickets && allTickets.length > 0) {
      setDisplayedTickets(allTickets.slice(0, 3));
      setHasMore(allTickets.length > 3);
    }
  }, [allTickets]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (selectedCustomerID) {
        try {
          const response = await axios.get(
            `http://localhost:8070/api/customers/${selectedCustomerID}`
          );
          setCustomerData(response.data);
        } catch (error) {
          console.error("Error fetching customer data", error);
        }
      }
    };

    fetchCustomerData();
  }, [selectedCustomerID]);

  const loadMoreTickets = () => {
    const nextPage = page + 1;
    const startIndex = 3 * (nextPage - 1);
    const endIndex = startIndex + 3;
    const nextTickets = allTickets.slice(startIndex, endIndex);
    setDisplayedTickets([...displayedTickets, ...nextTickets]);
    setPage(nextPage);
    setHasMore(endIndex < allTickets.length);
  };

  const gotoView = (id) => {
    localStorage.setItem("ticketId", id);
    navigate("/viewTicket");
  };

  const gotoEdit = (id) => {
    localStorage.setItem("ticketId", id);
    navigate("/editTicket");
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
        Ticket History
      </Typography>
      <InfiniteScroll
        dataLength={displayedTickets.length}
        next={loadMoreTickets}
        hasMore={hasMore}
        loader={
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        }
        endMessage={
          <Typography variant="body2" align="center" sx={{ my: 2 }}>
            No more tickets to load
          </Typography>
        }
      >
        {displayedTickets.map((ticket, index) => (
          <ModernCard key={index} style={fadeIn}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <StyledAvatar>{ticket.issueDescription[0]}</StyledAvatar>
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
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Solved"
                      color="success"
                      variant="outlined"
                    />
                    <StyledButton
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      color="primary"
                      onClick={() => gotoView(ticket._id)}
                    >
                      View
                    </StyledButton>
                    <StyledButton
                      variant="contained"
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
        ))}
      </InfiniteScroll>

      <CustomerDetailsDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        customerData={customerData}
      />
    </Box>
  );
};

export default TicketHistory;
