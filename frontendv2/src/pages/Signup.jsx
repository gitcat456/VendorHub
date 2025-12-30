import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Link,
    Alert,
    CircularProgress,
    Grid
} from '@mui/material';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone_number: '',
        role: 'vendor' // Default to vendor for this app
    });
    const [error, setError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFormLoading(true);

        try {
            await signup(formData);
            navigate('/dashboard');
        } catch (err) {
            // Handle specific field errors or general errors
            const msg = err.response?.data
                ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join(', ')
                : 'Registration failed. Please try again.';
            setError(msg);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Create Vendor Account
                </Typography>

                {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="phone_number"
                                label="Phone Number"
                                name="phone_number"
                                autoComplete="tel"
                                helperText="Format: +254..."
                                value={formData.phone_number}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={formLoading}
                    >
                        {formLoading ? <CircularProgress size={24} /> : 'Sign Up'}
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Link component={RouterLink} to="/login" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Signup;
