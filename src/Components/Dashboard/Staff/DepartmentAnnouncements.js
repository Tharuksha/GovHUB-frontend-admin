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
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" color="primary">
          Department Announcements
        </Typography>
        {user.role === "dhead" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsDialogOpen(true)}
          >
            Post Announcement
          </Button>
        )}
      </Box>
      {announcements.map((announcement, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="body1">{announcement.content}</Typography>
            <Typography variant="caption" color="text.secondary">
              Posted by: {announcement.postedBy.name} |{" "}
              {moment(announcement.createdAt).format("MMMM D, YYYY h:mm A")}
            </Typography>
          </CardContent>
        </Card>
      ))}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Post New Announcement</DialogTitle>
        <DialogContent>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handlePostAnnouncement}
            variant="contained"
            color="primary"
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DepartmentAnnouncements;
