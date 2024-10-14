import React from "react";
import { Button, Icon } from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated } from "react-spring";
import { useLocation, Link } from "react-router-dom";
import theme from "../theme/Theme";

const AnimatedButton = animated(Button);

const ModernNavButton = styled(AnimatedButton)(({ theme, isActive }) => ({
  width: "100%",
  height: "48px",
  backgroundColor: isActive ? theme.palette.primary.main : "transparent",
  color: isActive ? theme.palette.common.white : theme.palette.text.primary,
  fontWeight: isActive ? "bold" : "normal",
  display: "flex",
  textTransform: "none",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(1),
  borderRadius: "12px",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: isActive
      ? theme.palette.primary.dark
      : theme.palette.action.hover,
    transform: "translateY(-2px)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
}));

const IconWrapper = styled(Icon)(({ theme }) => ({
  width: "24px",
  height: "24px",
  marginRight: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const NavItem = ({ name, path, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  const springProps = useSpring({
    opacity: isActive ? 1 : 0.8,
    transform: isActive ? "scale(1.05)" : "scale(1)",
    config: { tension: 300, friction: 10 },
  });

  return (
    <ModernNavButton
      component={Link}
      to={path}
      isActive={isActive}
      style={springProps}
    >
      <IconWrapper>{icon}</IconWrapper>
      {name}
    </ModernNavButton>
  );
};

export default NavItem;
