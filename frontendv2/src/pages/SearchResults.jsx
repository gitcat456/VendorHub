import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const SearchResults = () => {
    return (
        <Container sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>Search Results</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                This feature is under construction. Please browse via the Home page or Categories.
            </Typography>
            <Button variant="contained" component={Link} to="/">Return Home</Button>
        </Container>
    );
};

export default SearchResults;
