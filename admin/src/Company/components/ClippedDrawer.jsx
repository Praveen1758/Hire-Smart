import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import PaidIcon from '@mui/icons-material/Paid';
import LogoutIcon from '@mui/icons-material/Logout';
import Logo from '../../Images/logo.png';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import WorkIcon from '@mui/icons-material/Work';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';


const drawerWidth = 240;

export default function ClippedDrawer({ children }) {
    const [openCategory, setOpenCategory] = React.useState(false);
  const [openProducts, setOpenProducts] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      localStorage.removeItem('CompanyToken');
      localStorage.removeItem('CompanyId');
      alert('Logout successful');
      navigate('/Company/');
    }
  };
  const handleCategoryClick = () => {
    setOpenCategory(!openCategory);
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(to left, white,white)' }}>
        <Toolbar>
          <img src={Logo} alt="Logo" style={{ width: '8%' }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'black' }}>
            Company Panel
          </Typography>
          <IconButton edge="end" color="inherit" onClick={handleLogout}>
            <LogoutIcon sx={{ color: 'black' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', overflow: 'hidden',marginTop: '64px' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'hidden' }}>
          <List style={{ marginTop: '30px' }}>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/Company">
                <ListItemIcon>
                  <DashboardCustomizeIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
          

     
<ListItem disablePadding>
  <ListItemButton onClick={handleCategoryClick}>
    <ListItemIcon>
      <BusinessCenterIcon />
    </ListItemIcon>
    <ListItemText primary="Job Options" />
    {openCategory ? <ExpandLess /> : <ExpandMore />}
  </ListItemButton>
</ListItem>

<Collapse in={openCategory} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
    <ListItemButton sx={{ pl: 4 }} component={Link} to="/Company/AddJob">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Add Job" />
    </ListItemButton>
    <ListItemButton sx={{ pl: 4 }} component={Link} to="/Company/ViewJobs">
      <ListItemIcon>
        <WorkIcon />
      </ListItemIcon>
      <ListItemText primary="View Job" />
    </ListItemButton>
  </List>
</Collapse>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/Company/ManagePayment">
                <ListItemIcon>
                  <PaidIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Payment" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/Company/ApplicationDetails">
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Applicats" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box
  component="main"
  sx={{
    flexGrow: 1,
    p: 3,
    backgroundImage: 'url(/your-job-theme-bg.jpg)', // ensure this image is in the public folder
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
  }}
>

        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
