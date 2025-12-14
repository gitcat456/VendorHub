import React, { useState } from 'react';
import {
    AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge,
    Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
    useMediaQuery, useTheme, Button, Container,
    BottomNavigation, BottomNavigationAction, Paper
} from '@mui/material';
import {
    Menu as MenuIcon, Search as SearchIcon, AccountCircle,
    ShoppingCart, Add as AddIcon, Home as HomeIcon, Person as PersonIcon,
    DirectionsCar, Smartphone, Weekend, Build, Checkroom, FitnessCenter, Work
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

// Map icon strings to components
const IconMap = {
    DirectionsCar, Home: HomeIcon, Smartphone, Weekend, Build, Checkroom, FitnessCenter, Work
};

const MainLayout = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigate = (path) => {
        navigate(path);
        if (isMobile) setMobileOpen(false);
    };

    const drawerContent = (
        <div>
            <Toolbar>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    MarketPlace
                </Typography>
            </Toolbar>
            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        selected={location.pathname === '/'}
                        onClick={() => handleNavigate('/')}
                    >
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>
                {CATEGORIES.map((cat) => {
                    const Icon = IconMap[cat.icon] || HomeIcon;
                    return (
                        <ListItem key={cat.id} disablePadding>
                            <ListItemButton
                                selected={location.pathname === `/category/${cat.id}`}
                                onClick={() => handleNavigate(`/category/${cat.id}`)}
                            >
                                <ListItemIcon><Icon /></ListItemIcon>
                                <ListItemText primary={cat.name} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: 'background.paper',
                    color: 'text.primary'
                }}
                elevation={1}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer', mr: 4, color: 'primary.main', fontWeight: 800 }}
                        onClick={() => navigate('/')}
                    >
                        MarketPlace
                    </Typography>

                    {/* Search Bar in AppBar */}
                    <Box sx={{
                        position: 'relative',
                        borderRadius: 2,
                        backgroundColor: '#f5f5f5',
                        '&:hover': { backgroundColor: '#e0e0e0' },
                        mr: 2,
                        ml: 0,
                        width: '100%',
                        maxWidth: 500
                    }}>
                        <Box sx={{ padding: '0 16px', height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SearchIcon color="action" />
                        </Box>
                        <InputBase
                            placeholder="I am looking for..."
                            inputProps={{ 'aria-label': 'search' }}
                            sx={{ color: 'inherit', padding: '8px 8px 8px 0', paddingLeft: '48px', width: '100%' }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    navigate(`/search?q=${e.target.value}`);
                                }
                            }}
                        />
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        sx={{ borderRadius: 20, whiteSpace: 'nowrap' }}
                        onClick={() => {
                            if (user) {
                                navigate('/dashboard');
                            } else {
                                navigate('/login', { state: { from: { pathname: '/dashboard' } } });
                            }
                        }}
                    >
                        Sell
                    </Button>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                {/* Mobile Temporary Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawerContent}
                </Drawer>

                {/* Desktop Permanent Drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` }, bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
            >
                <Toolbar /> {/* Spacer for AppBar */}
                <Box sx={{ flexGrow: 1 }}>
                    {children}
                </Box>

                <Box component="footer" sx={{ py: 3, textAlign: 'center', color: 'text.secondary', borderTop: '1px solid #e0e0e0', mt: 4, mb: { xs: 7, md: 0 } }}>
                    <Typography variant="body2">
                        MarketPlace &copy; {new Date().getFullYear()}. All rights reserved.
                    </Typography>
                </Box>
            </Box>

            {/* Mobile Bottom Navigation */}
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { md: 'none' }, zIndex: 1000 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={location.pathname === '/' ? 0 : location.pathname === '/dashboard' ? 2 : 1}
                    onChange={(event, newValue) => {
                        if (newValue === 0) navigate('/');
                        if (newValue === 1) {
                            if (user) navigate('/dashboard'); // Sell -> Dashboard
                            else navigate('/login', { state: { from: { pathname: '/dashboard' } } });
                        }
                        if (newValue === 2) {
                            if (user) navigate('/dashboard');
                            else navigate('/login');
                        }
                    }}
                >
                    <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                    <BottomNavigationAction label="Sell" icon={<AddIcon />} />
                    <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
};

export default MainLayout;
