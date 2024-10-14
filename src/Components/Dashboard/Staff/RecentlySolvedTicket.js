import React from "react";
import { Card, Typography, Button, Stack, Grid, Box } from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated } from "react-spring";
import {
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Note as NoteIcon,
  Feedback as FeedbackIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AnimatedCard = animated(Card);

const ModernCard = styled(AnimatedCard)(({ theme }) => ({
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

const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const RecentlySolvedTicketCard = ({ ticket }) => {
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

  if (!ticket?._id) {
    return (
      <ModernCard style={fadeIn}>
        <Typography variant="body1" align="center">
          No last solved ticket data to display
        </Typography>
      </ModernCard>
    );
  }

  return (
    <ModernCard style={fadeIn}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", marginBottom: 2, color: "primary.main" }}
      ></Typography>
      <Typography
        variant="subtitle2"
        sx={{ color: "text.secondary", marginBottom: 2 }}
      >
        Ticket ID: {ticket._id}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InfoItem>
            <IconWrapper>
              <AssignmentIcon />
            </IconWrapper>
            <Typography variant="body2">
              Issue: {ticket.issueDescription}
            </Typography>
          </InfoItem>
          <InfoItem>
            <IconWrapper>
              <DescriptionIcon />
            </IconWrapper>
            <Typography variant="body2">Status: {ticket.status}</Typography>
          </InfoItem>
          <InfoItem>
            <IconWrapper>
              <EventIcon />
            </IconWrapper>
            <Typography variant="body2">
              Created: {new Date(ticket.createdDate).toLocaleString()}
            </Typography>
          </InfoItem>
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoItem>
            <IconWrapper>
              <EventIcon />
            </IconWrapper>
            <Typography variant="body2">
              Appointment: {new Date(ticket.appointmentDate).toLocaleString()}
            </Typography>
          </InfoItem>
          <InfoItem>
            <IconWrapper>
              <NoteIcon />
            </IconWrapper>
            <Typography variant="body2">Notes: {ticket.notes}</Typography>
          </InfoItem>
          <InfoItem>
            <IconWrapper>
              <CheckCircleIcon />
            </IconWrapper>
            <Typography variant="body2">
              Closed: {new Date(ticket.closedDate).toLocaleString()}
            </Typography>
          </InfoItem>
          <InfoItem>
            <IconWrapper>
              <FeedbackIcon />
            </IconWrapper>
            <Typography variant="body2">Feedback: {ticket.feedback}</Typography>
          </InfoItem>
        </Grid>
      </Grid>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ marginTop: 3 }}
      >
        <Button
          variant="outlined"
          startIcon={<VisibilityIcon />}
          color="primary"
          onClick={() => gotoView(ticket._id)}
          sx={{
            borderRadius: 20,
            textTransform: "none",
          }}
        >
          View
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          color="primary"
          onClick={() => gotoEdit(ticket._id)}
          sx={{
            borderRadius: 20,
            textTransform: "none",
          }}
        >
          Edit
        </Button>
      </Stack>
    </ModernCard>
  );
};

export default RecentlySolvedTicketCard;
