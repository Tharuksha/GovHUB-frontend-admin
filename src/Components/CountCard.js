// src/Components/CountCard.js

import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useSpring, animated } from "react-spring";

const AnimatedCard = animated(Card);

const CountCard = ({ icon, label, count }) => {
  const cardSpring = useSpring({
    from: { opacity: 0, transform: "scale(0.9)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 300, friction: 10 },
  });

  return (
    <AnimatedCard style={cardSpring}>
      <CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>{icon}</div>
          <div style={{ textAlign: "right" }}>
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              {count}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
          </div>
        </div>
      </CardContent>
    </AnimatedCard>
  );
};

export default CountCard;
