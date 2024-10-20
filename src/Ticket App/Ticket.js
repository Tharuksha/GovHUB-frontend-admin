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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated, config } from "react-spring";
import {
  MaterialReactTable,
  createMRTColumnHelper,
  useMaterialReactTable,
} from "material-react-table";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import theme from "../theme/TableTheme";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import dayjs from "dayjs";

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

const StyledChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: "bold",
  color: "#ffffff",
  backgroundColor:
    status === "Solved"
      ? theme.palette.success.main
      : status === "Pending"
      ? theme.palette.warning.main
      : status === "Rejected"
      ? theme.palette.error.main
      : theme.palette.info.main,
}));

const TicketApp = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [userDepartment, setUserDepartment] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

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
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://govhub-backend-6375764a4f5c.herokuapp.com/api/tickets"
      );
      let ticketsData = response.data;
      if (userRole !== "admin") {
        ticketsData = ticketsData.filter(
          (item) => item.departmentID === userDepartment
        );
      }
      setData(ticketsData);
    } catch (error) {
      toast.error("Error fetching tickets.");
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
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

    doc.save("tickets.pdf");
  };

  const gotoView = (id) => {
    localStorage.setItem("ticketId", id);
    navigate("/viewTicket");
  };

  const gotoEdit = (id) => {
    localStorage.setItem("ticketId", id);
    navigate("/editTicket");
  };

  const gotoSolve = (id) => {
    localStorage.setItem("ticketId", id);
    navigate("/solveTicket");
  };

  const handleReject = (id) => {
    setSelectedTicketId(id);
    setRejectDialogOpen(true);
  };

  const handleRejectClose = () => {
    setRejectDialogOpen(false);
    setRejectReason("");
    setSelectedTicketId(null);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setIsLoading(true);
    try {
      await axios.put(
        `https://govhub-backend-6375764a4f5c.herokuapp.com/api/tickets/${selectedTicketId}/reject`,
        {
          rejectionReason: rejectReason,
        }
      );
      toast.success("Ticket rejected successfully");
      handleRejectClose();
      fetchData(); // Refresh the ticket list
    } catch (error) {
      console.error("Error rejecting ticket:", error);
      toast.error("Failed to reject ticket");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTicket = (id) => {
    if (userRole !== "admin") {
      toast.error("Only administrators can delete tickets.");
      return;
    }

    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this ticket?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await axios.delete(
                `https://govhub-backend-6375764a4f5c.herokuapp.com/api/tickets/${id}`
              );
              toast.success("Ticket deleted successfully");
              fetchData(); // Refetch data after deletion
            } catch (error) {
              toast.error("Failed to delete ticket");
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

  const columnHelper = createMRTColumnHelper();
  const columns = [
    columnHelper.accessor("_id", {
      header: "Ticket ID",
      size: 80,
      Cell: ({ cell }) => (
        <Typography variant="body2" noWrap>
          {cell.getValue().slice(-6)}
        </Typography>
      ),
    }),
    columnHelper.accessor("customerID", {
      header: "Customer ID",
      size: 80,
      Cell: ({ cell }) => (
        <Typography variant="body2" noWrap>
          {cell.getValue().slice(-6)}
        </Typography>
      ),
    }),
    columnHelper.accessor("issueDescription", {
      header: "Issue Description",
      size: 300,
      Cell: ({ cell }) => (
        <Typography variant="body2">
          {cell.getValue().length > 100
            ? `${cell.getValue().substring(0, 100)}...`
            : cell.getValue()}
        </Typography>
      ),
    }),
    columnHelper.accessor("departmentID", {
      header: "Department",
      size: 150,
      Cell: ({ cell }) => (
        <Typography variant="body2">{cell.getValue()}</Typography>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      Cell: ({ cell }) => (
        <StyledChip label={cell.getValue()} status={cell.getValue()} />
      ),
    }),
    columnHelper.accessor("createdDate", {
      header: "Created Date",
      Cell: ({ cell }) => (
        <Typography variant="body2">
          {dayjs(cell.getValue()).format("YYYY-MM-DD")}
        </Typography>
      ),
    }),
    columnHelper.accessor("appointmentDate", {
      header: "Appointment Date",
      Cell: ({ cell }) => (
        <Typography variant="body2">
          {cell.getValue()
            ? dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm")
            : "Not Set"}
        </Typography>
      ),
    }),
  ];

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
          <IconButton color="info" onClick={() => gotoView(row.original._id)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton
            color="primary"
            onClick={() => gotoEdit(row.original._id)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        {userRole !== "admin" &&
          userRole !== "dhead" &&
          row.original.status === "Pending" && (
            <>
              <Tooltip title="Solve">
                <IconButton
                  color="success"
                  onClick={() => gotoSolve(row.original._id)}
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  color="error"
                  onClick={() => handleReject(row.original._id)}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        {userRole === "admin" && (
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => deleteTicket(row.original._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{ display: "flex", gap: "16px", padding: "8px", flexWrap: "wrap" }}
      >
        <Button
          variant="contained"
          color="primary"
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          variant="contained"
          color="primary"
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
            Tickets Management
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

        {/* Reject Ticket Dialog */}
        <Dialog open={rejectDialogOpen} onClose={handleRejectClose}>
          <DialogTitle>Reject Ticket</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="reject-reason"
              label="Reason for Rejection"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRejectClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleRejectSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <ToastContainer position="bottom-right" />
    </ThemeProvider>
  );
};

export default TicketApp;
