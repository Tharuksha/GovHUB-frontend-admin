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
  LinearProgress,
} from "@mui/material";
import axios from "axios";
import moment from "moment";

const DepartmentAnnouncements = ({ user }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        `https://govhub-backend-6375764a4f5c.herokuapp.com/api/announcements/${user.departmentID}`
      );
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements", error);
    }
  };

  const handlePostAnnouncement = async () => {
    try {
      await axios.post(
        "https://govhub-backend-6375764a4f5c.herokuapp.com/api/announcements",
        {
          departmentID: user.departmentID,
          content: newAnnouncement,
          postedBy: user.id,
        }
      );
      setNewAnnouncement("");
      setIsDialogOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error("Error posting announcement", error);
    }
  };

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
          announcements.map((announcement, index) => (
            <Card
              key={index}
              sx={{
                mb: 2,
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {announcement.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    display: "block",
                    mt: 1,
                  }}
                >
                  Posted by: {announcement.postedBy.name} |{" "}
                  {moment(announcement.createdAt).format("MMMM D, YYYY h:mm A")}
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
