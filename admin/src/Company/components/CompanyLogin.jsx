import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../Images//companybg.jpg';


const API_HOST = "http://localhost:6102";
const API_ENDPOINT = "/api/company/Login";

const CompanyLogin = () => {
    const navigate = useNavigate();
    const [companyToken, setCompanyToken] = useState(null);
    const [contractorInfo, setContractorInfo] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storeToken = localStorage.getItem('CompanyToken');
        if (storeToken) {
            try {
                setCompanyToken(JSON.parse(storeToken));
            } catch (error) {
                console.error("Invalid JSON in localStorage for 'CompanyToken'");
            }
        }
    }, []);

    const handleChange = (e) => {
        setContractorInfo({ ...contractorInfo, [e.target.name]: e.target.value });
    };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = contractorInfo;
    try {
        const response = await axios.post(`${API_HOST}${API_ENDPOINT}`, { email, password });

        if (response.data.success) {
            alert(response.data.message);

            // Store both token and contractor ID
            localStorage.setItem('CompanyToken', JSON.stringify(response.data.CompanyToken));
            localStorage.setItem('CompanyId', response.data.contractorId); // New line to store contractor ID

            setCompanyToken(response.data.CompanyToken);
            alert('Login successful');
            navigate('/Company/Dashboard');
        } else {
            setMessage(response.data.message);
        }
    } catch (error) {
        console.error("Login error:", error);
        if (error.response?.data?.message) {
            setMessage(error.response.data.message);
        } else {
            setMessage('An unexpected error occurred.');
        }
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
                        <Typography variant="h4" fontWeight="bold" mb={5}>Company Login</Typography>
                        <Typography variant="body1" mb={3}>Welcome back! Please log in to access your dashboard and manage the system.</Typography>
                        <form onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                variant="outlined"
                                margin="normal"
                                value={contractorInfo.email}
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
                                value={contractorInfo.password}
                                onChange={handleChange}
                                InputProps={{ sx: { bgcolor: 'transparent' } }}
                            />
                            <Button fullWidth variant="contained" size="large" type="submit" sx={{
                                mt: 2,
                                color: 'white',
                                borderColor: '#6f4f28',
                                padding: '10px',
                                width: '200px',
                                background: 'linear-gradient(to left,white, black)',
                                borderRadius: '4px',
                                '&:hover': {
                                    background: 'linear-gradient(to left,white, black)',
                                    borderColor: '#6f4f28'
                                }
                            }}>
                                Sign In
                            </Button>
                        </form>
                        {message && (
                            <Typography color="error" variant="body2" align="center">
                                {message}
                            </Typography>
                        )}
                          <Typography variant="body2" sx={{ mt: 3 }}>
              Don't have an account?{' '}
              <Button
                variant="text"
                onClick={() => navigate('/Company/CompanyRegister')}
                sx={{ textTransform: 'none', fontWeight: 'bold', padding: 0, minWidth: 0 }}
              >
                Register
              </Button>
            </Typography>
                    </CardContent>
                </Card>
            {/* </Container> */}
        </Box>
    );
};

export default CompanyLogin;
