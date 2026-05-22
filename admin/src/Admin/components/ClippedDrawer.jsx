import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CollectionsIcon from '@mui/icons-material/Collections';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FeedbackIcon from '@mui/icons-material/Feedback';
import Logo from '../../Images/logo.png';
import PaidIcon from '@mui/icons-material/Paid';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupIcon from '@mui/icons-material/Group';

const drawerWidth = 240;

export default function ClippedDrawer({ children }) {
  const [openCategory, setOpenCategory] = React.useState(false);
  const [openSubCategory, setOpenSubCategory] = React.useState(false);
  const [openProducts, setOpenProducts] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleCategoryClick = () => {
    setOpenCategory(!openCategory);
  };
  const handleSubCategoryClick = () => {
    setOpenSubCategory(!openSubCategory);
  };
  const handleProductsClick = () => {
    setOpenProducts(!openProducts);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      // Clear the token from localStorage
      localStorage.removeItem('AdminToken');
      
      // Close the menu
      handleMenuClose();
      
      // Navigate to the admin login page
      navigate('/AdminLogin');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(to left, white,white)' }}>
       <Toolbar>
  <img src={Logo} alt="Logo" style={{ width: '100px' }} />
  <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'black' }}>
    Admin Panel
  </Typography>
  <IconButton
    edge="end"
    onClick={handleLogout}
    sx={{ color: 'black' }}
  >
    <LogoutIcon />
  </IconButton>
</Toolbar>

      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', overflow: 'hidden' }, // Prevent scrollbar
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'hidden' }}>
          <List style={{marginTop:'30px'}} >
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/">
                <ListItemIcon>
                  <DashboardCustomizeIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleCategoryClick}>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Category" />
                {openCategory ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openCategory} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/AddCategory">
                  <ListItemText primary="Add Category" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/ViewCategory">
                  <ListItemText primary="View Category" />
                </ListItemButton>
              </List>
            </Collapse>
            
            <ListItem disablePadding>
              <ListItemButton onClick={handleSubCategoryClick}>
                <ListItemIcon>
                  <PostAddIcon />
                </ListItemIcon>
                <ListItemText primary="Manage SubCategory" />
                {openSubCategory ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openSubCategory} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/AddSubCategory">
                  <ListItemText primary="Add SubCategory" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/ViewSubcategory">
                  <ListItemText primary="View SubCategory" />
                </ListItemButton>
              </List>
            </Collapse>
            {/* <ListItem disablePadding>
              <ListItemButton onClick={handleProductsClick}>
                <ListItemIcon>
                  <PostAddIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Products" />
                {openProducts ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem> */}
           
                <ListItem disablePadding>
              <ListItemButton component={Link} to="/ManageCompany">
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Company" />
              </ListItemButton>
            </ListItem>

              <ListItem disablePadding>
              <ListItemButton component={Link} to="/Viewuser">
                <ListItemIcon>
                  <GroupAddIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Users" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/ViewPayments">
                <ListItemIcon>
                  <PaidIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Payment" />
              </ListItemButton>
            </ListItem>
            {/* <ListItem disablePadding>
              <ListItemButton component={Link} to="/Admin/AddContractor">
                <ListItemIcon>
                  <PaidIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Contractor" />
              </ListItemButton>
            </ListItem> */}
            {/* <ListItem disablePadding>
              <ListItemButton component={Link} to="/Admin/ViewContractors">
                <ListItemIcon>
                  <PaidIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Contractor" />
              </ListItemButton>
            </ListItem> */}
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/ViewFeedback">
                <ListItemIcon>
                  <FeedbackIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Feedback" />
              </ListItemButton>
            </ListItem>

           
            {/* <ListItem disablePadding>
              <ListItemButton component={Link} to="/Admin/generateBill">
                <ListItemIcon>
                  <CollectionsIcon />
                </ListItemIcon>
                <ListItemText primary="Genrate Bill" />
              </ListItemButton>
            </ListItem> */}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
