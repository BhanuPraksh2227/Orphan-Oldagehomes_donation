import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import './styles/VolunteerScheduler.css';

const VolunteerScheduler = () => {
  const [schedule, setSchedule] = useState({
    date: null,
    activity: '',
    duration: '',
    numberOfVolunteers: 1
  });

  return (
    <Paper className="scheduler-container">
      <Typography variant="h6" className="scheduler-title">
        Schedule Volunteer Time
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DateTimePicker
            label="Select Date and Time"
            value={schedule.date}
            onChange={(newDate) => setSchedule({ ...schedule, date: newDate })}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        {/* Add other scheduling fields */}
      </Grid>
    </Paper>
  );
};

export default VolunteerScheduler;