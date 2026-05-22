import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import FeedbackIcon from '@mui/icons-material/Feedback';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalCategories: 0,
    totalFeedback: 0
  });

  useEffect(() => {
    axios.get('http://localhost:6102/api/dashboard/counts')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const card = (title, value, Icon) => (
    <Grid item xs={12} sm={6} style={{width: '250px'}}>
      <Card sx={{ background: 'linear-gradient(to top, #00c8b7, #000)', color: '#fff', borderRadius: 2 }}>
        <CardActionArea>
          <Icon sx={{ fontSize: 50, marginTop: 2 }} />
          <CardContent>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="h4">{value}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );

  return (
    <Grid container spacing={3} p={3}>
      {card('Total Users', stats.totalUsers, PeopleIcon)}
      {card('Total Companies', stats.totalCompanies, BusinessIcon)}
      {card('Categories', stats.totalCategories, CategoryIcon)}
      {card('Feedback', stats.totalFeedback, FeedbackIcon)}
    </Grid>
  );
}
