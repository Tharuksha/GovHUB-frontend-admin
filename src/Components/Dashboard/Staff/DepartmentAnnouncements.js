import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const DepartmentAnnouncements = ({ user }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.departmentID) {
      fetchAnnouncements();
    }
  }, [user?.departmentID]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(
        `https://govhub-backend-6375764a4f5c.herokuapp.com/api/announcements/${user.departmentID}`
      );
      if (!response.ok) throw new Error("Failed to fetch announcements");
      const data = await response.json();
      setAnnouncements(data);
      setError(null);
    } catch (error) {
      setError("Error fetching announcements. Please try again later.");
      console.error("Error fetching announcements", error);
    }
  };

  const handlePostAnnouncement = async () => {
    try {
      const response = await fetch(
        "https://govhub-backend-6375764a4f5c.herokuapp.com/api/announcements",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            departmentID: user.departmentID,
            content: newAnnouncement,
            postedBy: user.id,
            userRole: user.role,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to post announcement");

      setNewAnnouncement("");
      setIsDialogOpen(false);
      fetchAnnouncements();
      setError(null);
    } catch (error) {
      setError("Error posting announcement. Please try again later.");
      console.error("Error posting announcement", error);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      const response = await fetch(
        `https://govhub-backend-6375764a4f5c.herokuapp.com/api/announcements/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userRole: user.role,
            departmentID: user.departmentID,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete announcement");

      fetchAnnouncements();
      setError(null);
    } catch (error) {
      setError("Error deleting announcement. Please try again later.");
      console.error("Error deleting announcement", error);
    }
  };

  // If user is not provided, show an error message
  if (!user) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          <Typography variant="subtitle1">
            Unable to load announcements. User information is missing.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 0 }}>
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mb: 3,
          px: 2,
          py: 1,
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#1976d2",
            fontWeight: 500,
            fontSize: "1.2rem",
          }}
        >
          Department Announcements
        </Typography>
        {user.role === "dhead" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsDialogOpen(true)}
            sx={{
              textTransform: "none",
              borderRadius: "20px",
              px: 3,
            }}
          >
            Post Announcement
          </Button>
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{ px: 2, mb: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Announcements List */}
      <Box sx={{ px: 2 }}>
        {announcements.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ py: 4 }}
          >
            No announcements yet
          </Typography>
        ) : (
          announcements.map((announcement) => (
            <Card
              key={announcement._id}
              sx={{
                mb: 2,
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                },
                transition: "box-shadow 0.3s ease-in-out",
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Typography variant="body1" sx={{ mb: 1, flexGrow: 1 }}>
                    {announcement.content}
                  </Typography>
                  {user.role === "dhead" && (
                    <Tooltip title="Delete Announcement">
                      <IconButton
                        onClick={() =>
                          handleDeleteAnnouncement(announcement._id)
                        }
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    display: "block",
                    mt: 1,
                  }}
                >
                  Posted by: {announcement.postedBy.name} |{" "}
                  {new Date(announcement.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* Post Announcement Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
          Post New Announcement
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Announcement"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Button onClick={() => setIsDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handlePostAnnouncement}
            variant="contained"
            color="primary"
            disabled={!newAnnouncement.trim()}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DepartmentAnnouncements;
