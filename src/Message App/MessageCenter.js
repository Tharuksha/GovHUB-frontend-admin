import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  ThemeProvider,
  CssBaseline,
  IconButton,
  Tooltip,
  LinearProgress,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSpring, animated, config } from "react-spring";
import { Send as SendIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import theme from "../theme/Theme";

const AnimatedTypography = animated(Typography);

const ModernPaper = styled(Paper)(({ theme }) => ({
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

const MessageCenter = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("staff"));

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  useEffect(() => {
    fetchDepartments();
    fetchMessages();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        "https://govhub-backend-6375764a4f5c.herokuapp.com/api/departments"
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
    }
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://govhub-backend-6375764a4f5c.herokuapp.com/api/messages"
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedDepartment) {
      toast.error("Please enter a message and select a department");
      return;
    }

    try {
      await axios.post(
        "https://govhub-backend-6375764a4f5c.herokuapp.com/api/messages",
        {
          senderId: user.id,
          senderName: `${user.firstName} ${user.lastName}`,
          senderDepartment: user.departmentID,
          recipientDepartment: selectedDepartment,
          content: newMessage,
        }
      );
      setNewMessage("");
      fetchMessages();
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ padding: 3, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
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
            Inter-departmental Message Center
          </AnimatedTypography>
          <Tooltip title="Refresh Messages">
            <IconButton
              onClick={fetchMessages}
              color="primary"
              disabled={isLoading}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {isLoading && <LinearProgress sx={{ mb: 2 }} />}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <ModernPaper>
              <Typography variant="h6" gutterBottom>
                Message History
              </Typography>
              <List>
                {messages.map((message, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={`${message.senderName} (${message.senderDepartment} to ${message.recipientDepartment})`}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {message.content}
                            </Typography>
                            {` — ${new Date(
                              message.timestamp
                            ).toLocaleString()}`}
                          </>
                        }
                      />
                    </ListItem>
                    {index < messages.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </ModernPaper>
          </Grid>
          <Grid item xs={12} md={4}>
            <ModernPaper>
              <Typography variant="h6" gutterBottom>
                Send New Message
              </Typography>
              <TextField
                select
                fullWidth
                label="Select Department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                margin="normal"
                variant="outlined"
              >
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </option>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                margin="normal"
                variant="outlined"
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={handleSendMessage}
                sx={{ mt: 2 }}
              >
                Send Message
              </Button>
            </ModernPaper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default MessageCenter;
