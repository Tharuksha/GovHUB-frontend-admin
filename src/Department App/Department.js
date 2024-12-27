import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  MenuItem,
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
    size: 40,
  }),
  columnHelper.accessor("departmentName", {
    header: "Department Name",
    size: 120,
  }),
  columnHelper.accessor("phoneNumber", {
    header: "Phone Number",
    size: 120,
  }),
  columnHelper.accessor("emailAddress", {
    header: "Email Address",
    size: 220,
  }),
  columnHelper.accessor("departmentHeadID", {
    header: "Department Head",
    size: 150,
    Cell: ({ cell }) => {
      const [name, setName] = useState(null);
      const navigate = useNavigate();

      useEffect(() => {
        const fetchName = async () => {
          try {
            const response = await axios.get(
              `https://govhub-backend.onrender.com/api/staff/${cell.getValue()}`
            );
            const firstName = response.data.firstName || "No data found";
            const lastName = response.data.lastName || "";
            setName(`${firstName} ${lastName}`.trim());
          } catch (error) {
            console.error("Error fetching department head name:", error);
          }
        };
        cell.getValue() && fetchName();
      }, [cell]);

      const handleClick = () => {
        navigate("/viewStaff");
        localStorage.setItem("viewId", cell.getValue());
      };

      return (
        <Button
          onClick={handleClick}
          variant="text"
          disabled={!name || name === "No data found"}
          sx={{
            borderRadius: "0px",
            "&:hover": {
              borderBottom: "1px solid",
              borderColor: theme.palette.primary.main,
              boxShadow: "none",
            },
          }}
        >
          {name || "No data"}
        </Button>
      );
    },
  }),
  columnHelper.accessor("operatingHours", {
    header: "Operating Hours",
  }),
];

const DepartmentApp = () => {
  const [data, setData] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  useEffect(() => {
    fetchData();
    fetchUserRole();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://govhub-backend.onrender.com/api/departments"
      );
      setData(response.data);
    } catch (error) {
      toast.error("Failed to fetch departments");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRole = () => {
    const staffData = localStorage.getItem("staff");
    if (staffData) {
      try {
        const { role } = JSON.parse(staffData);
        setUserRole(role);
      } catch (error) {
        toast.error("Failed to parse user role from localStorage");
      }
    } else {
      toast.error("User role not found in localStorage");
    }
  };

  const handleExportRows = (rows) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save("departments.pdf");
  };

  const handleUpdate = (id) => {
    navigate(`/addDepartment`);
    localStorage.setItem("editId", id);
  };

  const gotoViewPage = (id) => {
    navigate("/viewDepartment");
    localStorage.setItem("viewId", id);
  };

  const handleDelete = async (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure you want to delete this department?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await axios.delete(
                `https://govhub-backend.onrender.com/api/departments/${id}`
              );
              toast.success("Department deleted successfully");
              fetchData();
            } catch (error) {
              toast.error("Failed to delete department");
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
    enableRowActions: userRole === "admin",
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
        {userRole === "admin" && (
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
            onClick={() => navigate("/addDepartment")}
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
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
            Departments Management
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

export default DepartmentApp;
