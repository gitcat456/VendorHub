import React, { useMemo } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Box, Typography, Grid, Container, Alert } from '@mui/material';
import ListingCard from '../features/ListingCard';
import CategoryTabs from '../features/CategoryTabs';
import { CATEGORIES } from '../data/mockData';
import { useProducts } from '../context/ProductContext';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const { id: categoryId } = useParams();
    const { products } = useProducts();

    const query = searchParams.get('q') || '';

    const filteredListings = useMemo(() => {
        return products.filter(listing => {
            const matchesQuery = listing.title.toLowerCase().includes(query.toLowerCase()) ||
                listing.description.toLowerCase().includes(query.toLowerCase());

            const categoryObj = categoryId ? CATEGORIES.find(c => c.id === categoryId) : null;
            const matchesCategory = categoryObj ? listing.category === categoryObj.name : true;

            return matchesQuery && matchesCategory;
        });
    }, [query, categoryId, products]);

    const title = categoryId
        ? CATEGORIES.find(c => c.id === categoryId)?.name || 'Category'
        : query ? `Search results for "${query}"` : 'All Listings';

    return (
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
            <CategoryTabs />

            <Box sx={{ mb: 4, mt: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {filteredListings.length} results found
                </Typography>

                {filteredListings.length > 0 ? (
                    <Grid container spacing={3}>
                        {filteredListings.map(listing => (
                            <Grid item key={listing.id} xs={12} sm={6} md={4} lg={3}>
                                <ListingCard listing={listing} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        No listings found matching your criteria. Try adjusting your search or category.
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default SearchResults;
