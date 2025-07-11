import { useState } from 'react';
import { useNotifications } from '../services/notificationService';
import { 
  Badge, 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography 
} from '@mui/material';
import { Notifications } from '@mui/icons-material';

const NotificationBell = () => {
  const { notifications } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);

  const unreadCount = notifications.length;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {notifications.length === 0 ? (
          <MenuItem>No new notifications</MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem key={notification.id} onClick={handleClose}>
              <Typography variant="inherit" noWrap>
                {notification.message}
              </Typography>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;