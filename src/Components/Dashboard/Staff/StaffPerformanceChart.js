import React from "react";
import ReactECharts from "echarts-for-react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated } from "react-spring";

const AnimatedBox = animated(Box);

const ChartContainer = styled(AnimatedBox)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  padding: theme.spacing(3),
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.1)",
  },
}));

const StaffPerformanceChart = ({
  performanceData,
  chartHeight = 400,
  chartWidth = "100%",
}) => {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 280, friction: 60 },
  });

  const chartOptions = {
    title: {
      text: "",
      left: "center",
      top: 0,
      textStyle: {
        color: "#333",
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
      formatter: "{b0}: {c0} tickets solved",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      borderColor: "#ccc",
      borderWidth: 1,
      textStyle: {
        color: "#333",
      },
    },
    xAxis: {
      type: "category",
      data: performanceData?.days,
      axisLabel: {
        rotate: 45,
        color: "#666",
      },
    },
    yAxis: {
      type: "value",
      name: "Tickets Solved",
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: {
        color: "#666",
        fontSize: 14,
      },
      min: 0,
      minInterval: 1,
      axisLabel: {
        color: "#666",
      },
    },
    series: [
      {
        data: performanceData?.count,
        type: "bar",
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#83bff6" },
              { offset: 1, color: "#188df0" },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "#188df0" },
                { offset: 1, color: "#83bff6" },
              ],
            },
          },
        },
      },
    ],
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
      top: "15%",
      containLabel: true,
    },
  };

  return (
    <ChartContainer style={fadeIn}>
      <Typography
        variant="h6"
        gutterBottom
        color="primary.main"
        align="center"
      ></Typography>
      <ReactECharts
        option={chartOptions}
        style={{ height: chartHeight, width: chartWidth }}
        opts={{ renderer: "svg" }}
      />
    </ChartContainer>
  );
};

export default StaffPerformanceChart;
