import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import {
    Home as HomeIcon,
    DirectionsCar, Smartphone, Weekend, Build, Checkroom, FitnessCenter, Work
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../data/mockData';

// Map icon strings to components
const IconMap = {
    DirectionsCar, Home: HomeIcon, Smartphone, Weekend, Build, Checkroom, FitnessCenter, Work
};

const CategoryTabs = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Find current tab value
    // If root, value is 'all' (optional, or false). If category, value is category ID.
    const currentPath = location.pathname;
    const value = currentPath === '/' ? 'home' : (currentPath.includes('/category/') ? currentPath.split('/category/')[1] : false);

    const handleChange = (event, newValue) => {
        if (newValue === 'home') {
            navigate('/');
        } else {
            navigate(`/category/${newValue}`);
        }
    };

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper', position: 'sticky', top: 0, zIndex: 10, mb: 2, display: { md: 'none' } }}>
            <Tabs
                value={value || false}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons={false}
                aria-label="category tabs"
                sx={{
                    '& .MuiTab-root': {
                        minHeight: 64,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.8rem'
                    }
                }}
            >
                <Tab
                    icon={<HomeIcon />}
                    label="All"
                    value="home"
                    iconposition="top"
                />
                {CATEGORIES.map((cat) => {
                    const Icon = IconMap[cat.icon] || HomeIcon;
                    return (
                        <Tab
                            key={cat.id}
                            icon={<Icon />}
                            label={cat.name}
                            value={cat.id}
                        />
                    );
                })}
            </Tabs>
        </Box>
    );
};

export default CategoryTabs;
