import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import axios from 'axios';

export default function Dashboard() {
  const companyId = localStorage.getItem('CompanyId');

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0
  });

  useEffect(() => {
    axios.get(`http://localhost:6102/api/dashboard/count/${companyId}`)
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, [companyId]);

  return (
    <Grid container spacing={3} p={3}>
      <Grid item xs={12} md={6} style={{width: '250px'}}>
        <Card sx={{ background:'linear-gradient(to top, #00c8b7, #000)', color: '#fff' }}>
          <CardActionArea>
            <WorkIcon sx={{ fontSize: 50, mt: 2 }} />
            <CardContent>
              <Typography variant="h6">Total Jobs</Typography>
              <Typography variant="h4">{stats.totalJobs}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>

      <Grid item lg={12} md={6} style={{width: '250px'}}>
        <Card sx={{ background: 'linear-gradient(to top, #00c8b7, #000)', color: '#fff' }}>
          <CardActionArea>
            <PeopleIcon sx={{ fontSize: 50, mt: 2 }} />
            <CardContent>
              <Typography variant="h6">Applicants</Typography>
              <Typography variant="h4">{stats.totalApplicants}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
}
