import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import ListingCard from '../features/ListingCard';
import CategoryTabs from '../features/CategoryTabs';
import { useProducts } from '../context/ProductContext';

const Home = () => {
    const { products } = useProducts();

    return (
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
            {/* Mobile Category Tabs */}
            <CategoryTabs />

            {/* Hero / Welcome - simplified since Search is in AppBar */}
            <Box sx={{ mb: 4, mt: { xs: 2, md: 4 }, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, color: 'primary.main' }}>
                    Find anything in <span style={{ color: '#ffa000' }}>Kenya</span>
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    The best place to buy and sell safely.
                </Typography>
            </Box>

            {/* Recent Listings */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Trending Ads
                </Typography>
                <Grid container spacing={3}>
                    {products.map((listing) => (
                        <Grid item key={listing.id} xs={12} sm={6} md={4} lg={3}>
                            <ListingCard listing={listing} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default Home;

