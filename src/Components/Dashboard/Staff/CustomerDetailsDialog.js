import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Grid,
  IconButton,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated } from "react-spring";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CloseIcon from "@mui/icons-material/Close";

const AnimatedDialogContent = animated(DialogContent);

const ModernDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: 8,
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
}));

const CustomerDetailsDialog = ({
  openDialog,
  handleCloseDialog,
  customerData,
}) => {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(-50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 280, friction: 60 },
  });

  return (
    <ModernDialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
        Customer Details
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <AnimatedDialogContent style={fadeIn} dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InfoItem>
              <VpnKeyIcon sx={{ marginRight: 2, color: "primary.main" }} />
              <Typography variant="body1">
                <strong>Customer ID:</strong> {customerData._id}
              </Typography>
            </InfoItem>
          </Grid>

          <Grid item xs={12}>
            <InfoItem>
              <PersonIcon sx={{ marginRight: 2, color: "primary.main" }} />
              <Typography variant="body1">
                <strong>Name:</strong> {customerData.firstName}{" "}
                {customerData.lastName}
              </Typography>
            </InfoItem>
          </Grid>

          <Grid item xs={12}>
            <InfoItem>
              <EmailIcon sx={{ marginRight: 2, color: "primary.main" }} />
              <Typography variant="body1">
                <strong>Email:</strong> {customerData.emailAddress}
              </Typography>
            </InfoItem>
          </Grid>

          <Grid item xs={12}>
            <InfoItem>
              <PhoneIcon sx={{ marginRight: 2, color: "primary.main" }} />
              <Typography variant="body1">
                <strong>Phone:</strong> {customerData.phoneNumber}
              </Typography>
            </InfoItem>
          </Grid>

          <Grid item xs={12}>
            <InfoItem>
              <CalendarTodayIcon
                sx={{ marginRight: 2, color: "primary.main" }}
              />
              <Typography variant="body1">
                <strong>Date of Birth:</strong>{" "}
                {new Date(customerData.dateOfBirth).toLocaleDateString()}
              </Typography>
            </InfoItem>
          </Grid>

          <Grid item xs={12}>
            <InfoItem>
              <LocationOnIcon sx={{ marginRight: 2, color: "primary.main" }} />
              <Typography variant="body1">
                <strong>Address:</strong> {customerData.address}
              </Typography>
            </InfoItem>
          </Grid>
        </Grid>
      </AnimatedDialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDialog}
          color="primary"
          variant="contained"
          sx={{
            borderRadius: 20,
            px: 3,
            py: 1,
            textTransform: "none",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </ModernDialog>
  );
};

export default CustomerDetailsDialog;
