import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated } from "react-spring";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import GroupsIcon from "@mui/icons-material/Groups";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";

const AnimatedBox = animated(Box);

const SidebarButton = styled(Button)(({ theme, active }) => ({
  width: "100%",
  justifyContent: "flex-start",
  padding: theme.spacing(1, 2),
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: active ? theme.palette.background.default : "transparent",
  "&:hover": {
    backgroundColor: theme.palette.background.default,
  },
}));

const SideBar = () => {
  const user = JSON.parse(localStorage.getItem("staff"));
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateX(-50px)" },
    to: { opacity: 1, transform: "translateX(0)" },
    config: { tension: 280, friction: 60 },
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logOut = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: <DashboardIcon /> },
    {
      name: "Department",
      path: "/department",
      icon: <BusinessIcon />,
      roles: ["dhead", "admin"],
    },
    {
      name: "Staff",
      path: "/staff",
      icon: <GroupsIcon />,
      roles: ["dhead", "admin"],
    },
    { name: "Ticket", path: "/ticket", icon: <ConfirmationNumberIcon /> },
  ];

  const drawer = (
    <AnimatedBox
      style={fadeIn}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 2,
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{ height: 60, width: 60, marginBottom: 10 }}
        />
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Gov Hub
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1, mt: 2 }}>
        {navItems.map(
          (item) =>
            (item.roles ? item.roles.includes(user?.role) : true) && (
              <ListItem key={item.name} disablePadding>
                <SidebarButton
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) handleDrawerToggle();
                  }}
                  active={location.pathname === item.path}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </SidebarButton>
              </ListItem>
            )
        )}
      </List>
      <Button
        variant="text"
        sx={{
          margin: 2,
          color: theme.palette.error.main,
          justifyContent: "flex-start",
        }}
        onClick={logOut}
        startIcon={<ExitToAppIcon />}
      >
        Logout
      </Button>
    </AnimatedBox>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: 250 }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
            zIndex: 99999, // Added high z-index here
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default SideBar;
