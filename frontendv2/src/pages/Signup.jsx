import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Link,
    CircularProgress,
    Grid
} from '@mui/material';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone_number: '',
        location: '', // Added location
        role: 'vendor'
    });
    const [formLoading, setFormLoading] = useState(false);
    const { signup } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { username, email, password, confirmPassword, phone_number, location } = formData;

        if (!username || !email || !password || !confirmPassword || !phone_number || !location) {
            showNotification('All fields are required', 'warning');
            return false;
        }

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return false;
        }

        if (password.length < 6) {
            showNotification('Password must be at least 6 characters', 'warning');
            return false;
        }

        // Basic phone validation (starts with + or digits, min 10 chars)
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(phone_number)) {
            showNotification('Invalid phone number format. Try +254... or 07...', 'error');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setFormLoading(true);

        try {
            // Transform data for backend (password -> password1, password2)
            const submissionData = {
                username: formData.username,
                email: formData.email,
                phone_number: formData.phone_number,
                location: formData.location,
                password: formData.password, // Required for AuthContext auto-login
                password1: formData.password,
                password2: formData.confirmPassword
            };

            await signup(submissionData);
            showNotification('Registration successful! Redirecting...', 'success');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            const msg = err.response?.data
                ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join(', ')
                : 'Registration failed. Please try again.';
            showNotification(msg, 'error');
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

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required fullWidth id="username" label="Username" name="username"
                                autoComplete="username" value={formData.username} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required fullWidth id="email" label="Email Address" name="email"
                                autoComplete="email" type="email" value={formData.email} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required fullWidth id="phone_number" label="Phone Number" name="phone_number"
                                autoComplete="tel" helperText="Format: +254... or 07..."
                                value={formData.phone_number} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required fullWidth id="location" label="Location" name="location"
                                autoComplete="address-level2" value={formData.location} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required fullWidth name="password" label="Password" type="password" id="password"
                                autoComplete="new-password" value={formData.password} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required fullWidth name="confirmPassword" label="Confirm Password" type="password" id="confirmPassword"
                                autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit" fullWidth variant="contained"
                        sx={{ mt: 3, mb: 2 }} disabled={formLoading}
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
