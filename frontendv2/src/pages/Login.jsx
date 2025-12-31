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
    CircularProgress
} from '@mui/material';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [formLoading, setFormLoading] = useState(false);
    const { login } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            await login(credentials.username, credentials.password);
            showNotification(`Welcome back, ${credentials.username}!`, 'success');
            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Invalid username or password';
            showNotification(errorMsg, 'error');
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign in to VendorHub
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal" required fullWidth
                        id="username" label="Username" name="username"
                        autoComplete="username" autoFocus
                        value={credentials.username} onChange={handleChange}
                    />
                    <TextField
                        margin="normal" required fullWidth
                        name="password" label="Password" type="password" id="password"
                        autoComplete="current-password"
                        value={credentials.password} onChange={handleChange}
                    />
                    <Button
                        type="submit" fullWidth variant="contained"
                        sx={{ mt: 3, mb: 2 }} disabled={formLoading}
                    >
                        {formLoading ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Link component={RouterLink} to="/signup" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
