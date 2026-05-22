import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, TextField, Button, Typography, Box, IconButton } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import bgImage from '../../Images//companybg.jpg';

const API_HOST = "http://localhost:6102";
const API_ENDPOINT = "/api/admin/login";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [adminToken, setAdminToken] = useState(null);
    const [adminInfo, setAdminInfo] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storeToken = localStorage.getItem('AdminToken');
        if (storeToken) {
            try {
                setAdminToken(JSON.parse(storeToken));
            } catch (error) {
                console.error("Invalid JSON in localStorage for 'AdminToken'");
            }
        }
    }, []);

    const handleChange = (e) => {
        setAdminInfo({ ...adminInfo, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = adminInfo;
        try {
            const response = await axios.post(`${API_HOST}${API_ENDPOINT}`, { email, password });
            alert(response.data.message);
            if (response.data.success) {
                localStorage.setItem('AdminToken', JSON.stringify(response.data.adminToken));
                setAdminToken(response.data.adminToken);
                navigate('/'); // Redirect to admin dashboard
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };

    return (
<Box
  sx={{
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  }}
>
<Card
  sx={{
    bgcolor: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    boxShadow: 3,
    width: "100%",
    maxWidth: 400,
  }}
>
                <CardContent sx={{ p: 5, textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" mb={5}>Admin Login</Typography>
                    <Typography variant="body1" mb={3}>Welcome back! Please log in to access your dashboard and manage the system.</Typography>
                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            variant="outlined"
                            margin="normal"
                            value={adminInfo.email}
                            onChange={handleChange}
                            InputProps={{ sx: { bgcolor: 'transparent' } }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={adminInfo.password}
                            onChange={handleChange}
                            InputProps={{ sx: { bgcolor: 'transparent' } }}
                        />
                        <Button fullWidth variant="contained"  size="large" type="submit" sx={{ 
                mt: 2, 
                color: 'white', 
                borderColor: '#6f4f28', 
                padding: '10px',
                width: '200px',
                background: 'linear-gradient(to left,white, black)', // Gradient from coffee brown to dark brown
                borderRadius: '4px', // Optional: adjust the border radius
                '&:hover': {
                  background:'linear-gradient(to left,white, black)', // Keep the gradient on hover
                  borderColor: '#6f4f28'
                }
              }} >Sign In</Button>
                    </form>
                    {message && (
                        <Typography color="error" variant="body2" align="center">
                            {message}
                        </Typography>
                    )}
                    {/* <Typography variant="body1" mb={2}>or sign in with:</Typography> */}
                    {/* <Box display="flex" justifyContent="center">
                        <IconButton color="primary" component="a">
                            <FacebookIcon />
                        </IconButton>
                        <IconButton color="primary" component="a">
                            <TwitterIcon />
                        </IconButton>
                        <IconButton color="primary" component="a">
                            <GoogleIcon />
                        </IconButton>
                        <IconButton color="primary" component="a">
                            <GitHubIcon />
                        </IconButton>
                    </Box> */}
                </CardContent>
            </Card>
        {/* </Container> */}
        </Box>
    );
};

export default AdminLogin;
