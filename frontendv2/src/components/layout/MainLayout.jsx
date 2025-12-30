import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';

const MainLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header />
            <Container component="main" sx={{ flexGrow: 1, py: 4 }} maxWidth="xl">
                {children}
            </Container>
            <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'white', textAlign: 'center', borderTop: '1px solid #e0e0e0' }}>
                <Container maxWidth="sm">
                    © {new Date().getFullYear()} VendorHub. All rights reserved.
                </Container>
            </Box>
        </Box>
    );
};

export default MainLayout;
