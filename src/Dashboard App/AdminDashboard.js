import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  MenuItem,
  Select,
  Grid,
  Typography,
  ThemeProvider,
  CssBaseline,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated, config } from "react-spring";
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import ReactECharts from "echarts-for-react";
import axios from "axios";
import theme from "../theme/Theme";
import DepartmentAnnouncements from "../Components/Dashboard/Staff/DepartmentAnnouncements";

const AnimatedCard = animated(Card);
const AnimatedTypography = animated(Typography);

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

const CountCard = ({ icon, label, count, progress }) => {
  return (
    <ModernCard>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" alignItems="center">
          {React.cloneElement(icon, {
            style: {
              fontSize: 24,
              marginRight: "12px",
              color: theme.palette.primary.main,
            },
          })}
          <Typography variant="h6" color="textSecondary">
            {label}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight="bold" color="primary">
          {count}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </ModernCard>
  );
};

const AdminDashboard = () => {
  const [departmentCount, setDepartmentCount] = useState(0);
  const [solvedTicketCount, setSolvedTicketCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [topStaff, setTopStaff] = useState([]);
  const [duration, setDuration] = useState("today");
  const [performance, setPerformance] = useState("best");
  const [departmentSolvedTicket, setDepartmentSolvedTicket] = useState([]);
  const [solvedAndUnsolvedTicketCount, setSolvedAndUnsolvedTicketCount] =
    useState({});
  const [ticketDetailsForWeek, setTicketDetailsForWeek] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("staff"));

  useEffect(() => {
    fetchData();
  }, [duration, performance]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [
        departmentRes,
        solvedTicketRes,
        staffRes,
        customerRes,
        departmentSolvedTicketRes,
        solvedTicketCountRes,
        solvedAndPendingTicketsRes,
        topStaffRes,
      ] = await Promise.all([
        axios.get(
          "https://govhub-backend-6375764a4f5c.herokuapp.com/api/dashboard/departments/count"
        ),
        axios.get(
          "https://govhub-backend-6375764a4f5c.herokuapp.com/api/dashboard/tickets/solved/count"
        ),
        axios.get(
          "https://govhub-backend-6375764a4f5c.herokuapp.com/api/dashboard/staff/count"
        ),
        axios.get(
          "https://govhub-backend-6375764a4f5c.herokuapp.com/api/dashboard/customers/count"
        ),
        axios.get(
          "https://govhub-backend-6375764a4f5c.herokuapp.com/api/dashboard/departments/solvedTickets"
        ),
        axios.get(
          "https://govhub-backend-6375764a4f5c.herokuapp.com/api/dashboard/tickets/solvedTickets"
        ),
        axios.get(
          "https://govhub-backend-6375764a4f5c.herokuapp.com/api/dashboard/tickets/solvedAndPendingTickets"
        ),
        axios.post(
          "https://govhub-backend-6375764a4f5c.herokuapp.com/api/dashboard/staff/solvedTickets",
          {
            duration,
            performance,
          }
        ),
      ]);

      setTicketDetailsForWeek(solvedAndPendingTicketsRes.data);
      setSolvedAndUnsolvedTicketCount(solvedTicketCountRes.data);
      setDepartmentSolvedTicket(departmentSolvedTicketRes.data);
      setDepartmentCount(departmentRes.data.count);
      setSolvedTicketCount(solvedTicketRes.data.count);
      setStaffCount(staffRes.data.count);
      setCustomerCount(customerRes.data.count);
      setTopStaff(topStaffRes.data);

      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setIsLoading(false);
    }
  };

  const onDurationchange = (value) => {
    setDuration(value);
  };

  const onPerformancechange = (value) => {
    setPerformance(value);
  };

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  // Chart options
  const chartColors = ["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6"];

  const departmentChartOptions = {
    title: { text: "Department Solved Ticket Distribution", left: "center" },
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    series: [
      {
        type: "pie",
        radius: "50%",
        data: departmentSolvedTicket.map((item, index) => ({
          value: item.count,
          name: item.departmentName,
          itemStyle: { color: chartColors[index % chartColors.length] },
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  const staffPerformanceChartOptions = {
    title: { text: "Staff Performance", left: "center" },
    xAxis: { type: "category", data: topStaff.map((staff) => staff.staffName) },
    yAxis: { type: "value" },
    series: [
      {
        data: topStaff.map((staff, index) => ({
          value: staff.count,
          itemStyle: { color: chartColors[index % chartColors.length] },
        })),
        type: "bar",
      },
    ],
    tooltip: { trigger: "axis", formatter: "{b0}: {c0}" },
  };

  const solvedCasesChartOptions = {
    title: {
      text: "Solved Cases Over Time",
      left: "center",
      top: 20,
      textStyle: {
        fontSize: 16,
      },
    },
    grid: {
      top: 60,
      bottom: 20,
      left: 20,
      right: 20,
      containLabel: true,
    },
    xAxis: { type: "category", data: ticketDetailsForWeek.dates },
    yAxis: { type: "value" },
    series: [
      {
        name: "Pending Tickets",
        data: ticketDetailsForWeek.pendingCounts,
        type: "line",
        smooth: true,
        itemStyle: { color: chartColors[0] },
      },
      {
        name: "Solved Tickets",
        data: ticketDetailsForWeek.solvedCounts,
        type: "line",
        smooth: true,
        itemStyle: { color: chartColors[1] },
      },
    ],
    legend: {
      data: ["Pending Tickets", "Solved Tickets"],
      bottom: 0,
    },
    tooltip: { trigger: "axis" },
  };

  const departmentSolvedTicketsOptions = {
    title: { text: "Department-Wise Solved Tickets", left: "center" },
    xAxis: {
      type: "category",
      data: departmentSolvedTicket.map((item) => item.departmentName),
    },
    yAxis: { type: "value" },
    series: [
      {
        data: departmentSolvedTicket.map((item, index) => ({
          value: item.count,
          itemStyle: { color: chartColors[index % chartColors.length] },
        })),
        type: "bar",
      },
    ],
    tooltip: { trigger: "axis" },
  };

  const solvedPendingTicketsOptions = {
    title: { text: "Solved vs. Pending Tickets", left: "center" },
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    series: [
      {
        name: "Tickets",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "20",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: solvedAndUnsolvedTicketCount.solved,
            name: "Solved",
            itemStyle: { color: chartColors[0] },
          },
          {
            value: solvedAndUnsolvedTicketCount.pending,
            name: "Pending",
            itemStyle: { color: chartColors[1] },
          },
        ],
      },
    ],
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          paddingTop: "30px",
          paddingLeft: "40px",
          paddingRight: "10px",
          backgroundColor: "#f5f7fa",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <AnimatedTypography
            variant="h4"
            style={fadeIn}
            color="primary"
            fontWeight="bold"
          >
            Admin Dashboard
          </AnimatedTypography>
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={fetchData}
              color="primary"
              disabled={isLoading}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {isLoading && <LinearProgress sx={{ mb: 2 }} />}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <CountCard
              icon={<BusinessIcon />}
              label="Departments"
              count={departmentCount}
              progress={75}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CountCard
              icon={<WorkIcon />}
              label="Staff"
              count={staffCount}
              progress={60}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CountCard
              icon={<PeopleIcon />}
              label="Customers"
              count={customerCount}
              progress={85}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CountCard
              icon={<AssignmentTurnedInIcon />}
              label="Solved Tickets"
              count={solvedTicketCount}
              progress={50}
            />
          </Grid>

          {/* Add the DepartmentAnnouncements component */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ModernCard>
                <DepartmentAnnouncements user={user} />
              </ModernCard>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <ModernCard>
              <Typography variant="h6" gutterBottom color="primary">
                Staff Performance
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Select
                  value={duration}
                  onChange={(e) => onDurationchange(e.target.value)}
                  sx={{ width: "48%" }}
                >
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="thisWeek">This week</MenuItem>
                  <MenuItem value="lastWeek">Last week</MenuItem>
                  <MenuItem value="thisMonth">This Month</MenuItem>
                  <MenuItem value="lastMonth">Last Month</MenuItem>
                  <MenuItem value="thisYear">This Year</MenuItem>
                  <MenuItem value="lastYear">Last Year</MenuItem>
                </Select>
                <Select
                  value={performance}
                  onChange={(e) => onPerformancechange(e.target.value)}
                  sx={{ width: "48%" }}
                >
                  <MenuItem value="best">Best Performed</MenuItem>
                  <MenuItem value="worst">Worst Performed</MenuItem>
                </Select>
              </Box>
              <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                {topStaff.map((staff, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      p: 2,
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="primary"
                      >
                        {staff.staffName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ ml: 1 }}
                      >
                        {staff.staffRole}
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      Resolved: {staff.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </ModernCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <ModernCard>
              <ReactECharts
                option={departmentChartOptions}
                style={{ height: 400 }}
              />
            </ModernCard>
          </Grid>

          <Grid item xs={12}>
            <ModernCard>
              <ReactECharts
                option={staffPerformanceChartOptions}
                style={{ height: 400 }}
              />
            </ModernCard>
          </Grid>

          <Grid item xs={12} md={7}>
            <ModernCard>
              <ReactECharts
                option={departmentSolvedTicketsOptions}
                style={{ height: 400 }}
              />
            </ModernCard>
          </Grid>

          <Grid item xs={12} md={5}>
            <ModernCard>
              <ReactECharts
                option={solvedPendingTicketsOptions}
                style={{ height: 400 }}
              />
            </ModernCard>
          </Grid>

          <Grid item xs={12}>
            <ModernCard>
              <ReactECharts
                option={solvedCasesChartOptions}
                style={{ height: 400 }}
              />
            </ModernCard>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;
