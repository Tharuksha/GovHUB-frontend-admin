import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  ThemeProvider,
  Typography,
  CssBaseline,
  IconButton,
  Tooltip,
  LinearProgress,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated, config } from "react-spring";
import {
  MaterialReactTable,
  createMRTColumnHelper,
  useMaterialReactTable,
} from "material-react-table";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import theme from "../theme/TableTheme";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AnimatedTypography = animated(Typography);

const ModernCard = styled(Card)(({ theme }) => ({
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

const columnHelper = createMRTColumnHelper();
const columns = [
  columnHelper.accessor("_id", {
    header: "ID",
    size: 120,
  }),
  columnHelper.accessor("firstName", {
    header: "First Name",
    size: 120,
  }),
  columnHelper.accessor("lastName", {
    header: "Last Name",
    size: 120,
  }),
  columnHelper.accessor("emailAddress", {
    header: "Email Address",
    size: 200,
  }),
  columnHelper.accessor("phoneNumber", {
    header: "Phone Number",
    size: 150,
  }),
  columnHelper.accessor("departmentID", {
    header: "Department",
    size: 150,
    Cell: ({ cell }) => {
      const [departmentName, setDepartmentName] = useState(null);
      const navigate = useNavigate();

      useEffect(() => {
        const fetchDepartmentName = async () => {
          try {
            const response = await axios.get(
              `http://localhost:8070/api/departments/${cell.getValue()}`
            );
            setDepartmentName(response.data.departmentName);
          } catch (error) {
            console.error("Error fetching department name:", error);
          }
        };
        fetchDepartmentName();
      }, [cell]);

      const handleDepartmentClick = () => {
        navigate("/viewDepartment");
        localStorage.setItem("viewId", cell.getValue());
      };
      return (
        <Button
          onClick={handleDepartmentClick}
          variant="text"
          sx={{
            borderRadius: "0px",
            "&:hover": {
              borderBottom: "1px solid",
              borderColor: theme.palette.primary.main,
              boxShadow: "none",
            },
          }}
        >
          {departmentName || "Loading..."}
        </Button>
      );
    },
  }),
];

const StaffApp = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [userDepartment, setUserDepartment] = useState("");

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("staff"));
    if (user) {
      setUserRole(user.role);
      setUserDepartment(user.departmentID);
    }
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8070/api/staff");
      let filteredData = response.data;

      // Filter out admin users if the current user is not an admin
      if (userRole !== "admin") {
        filteredData = filteredData.filter((staff) => staff.role !== "admin");
      }

      // Further filter for department heads
      if (userRole === "dhead") {
        filteredData = filteredData.filter(
          (staff) => staff.departmentID === userDepartment
        );
      }

      setData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching staff members");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userRole, userDepartment]);

  const handleExportRows = (rows) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save("staff-members.pdf");
  };

  const gotoViewPage = (id) => {
    navigate("/viewStaff");
    localStorage.setItem("viewId", id);
  };

  const handleUpdate = (id) => {
    navigate(`/addStaff`);
    localStorage.setItem("editId", id);
  };

  const handleDelete = async (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure you want to delete this staff member?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:8070/api/staff/${id}`);
              toast.success("Staff member deleted successfully");
              fetchData(); // Refetch data after deletion
            } catch (error) {
              toast.error("Failed to delete staff member");
              console.error(error);
            }
          },
        },
        {
          label: "No",
          onClick: () => toast.info("Deletion canceled"),
        },
      ],
    });
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableColumnFilters: true,
    enableColumnFilterModes: true,
    enablePagination: true,
    enableSorting: true,
    enableBottomToolbar: true,
    enableTopToolbar: true,
    muiTableBodyRowProps: { hover: true },
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "8px" }}>
        <Tooltip title="View">
          <IconButton
            color="info"
            onClick={() => gotoViewPage(row.original._id)}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        {(userRole === "admin" ||
          (userRole === "dhead" &&
            row.original.departmentID === userDepartment)) && (
          <>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() => handleUpdate(row.original._id)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => handleDelete(row.original._id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{ display: "flex", gap: "16px", padding: "8px", flexWrap: "wrap" }}
      >
        {userRole === "admin" && (
          <Button
            color="primary"
            onClick={() => navigate("/addStaff")}
            startIcon={<AddIcon />}
            variant="contained"
          >
            Add New
          </Button>
        )}
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "30px 40px",
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
            Staff Management
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
          <Grid item xs={12}>
            <ModernCard>
              <MaterialReactTable table={table} />
            </ModernCard>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer position="bottom-right" />
    </ThemeProvider>
  );
};

export default StaffApp;
