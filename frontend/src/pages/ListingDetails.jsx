import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
    Box, Typography, Grid, Container, Button, Paper,
    Avatar, Chip, Divider, Alert
} from '@mui/material';
import {
    ArrowBack, Place, AccessTime, Phone, WhatsApp,
    Security, VerifiedUser
} from '@mui/icons-material';
import { useProducts } from '../context/ProductContext';

const ListingDetails = () => {
    const { id } = useParams();
    const { products } = useProducts();
    const listing = products.find(l => l.id === id);

    if (!listing) {
        return (
            <Container sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>Listing not found</Typography>
                <Button component={RouterLink} to="/" variant="contained">Go Home</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Button
                component={RouterLink}
                to="/"
                startIcon={<ArrowBack />}
                sx={{ mb: 3, color: 'text.secondary' }}
            >
                Back to Browse
            </Button>

            <Grid container spacing={4}>
                {/* Main Content: Image & Description */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 0, borderRadius: 2, overflow: 'hidden', mb: 3, border: '1px solid #e0e0e0' }}>
                        <Box
                            component="img"
                            src={listing.image}
                            alt={listing.title}
                            sx={{
                                width: '100%',
                                height: { xs: 300, md: 500 },
                                objectFit: 'cover',
                                display: 'block'
                            }}
                        />
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                                {listing.title}
                            </Typography>
                        </Box>

                        <Typography variant="h4" color="primary" sx={{ fontWeight: 800, mb: 3 }}>
                            {listing.currency} {listing.price.toLocaleString()}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 3, color: 'text.secondary', mb: 3, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Place fontSize="small" />
                                <Typography variant="body2">{listing.location}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccessTime fontSize="small" />
                                <Typography variant="body2">{listing.postedAt}</Typography>
                            </Box>
                            <Chip label={listing.category} size="small" variant="outlined" />
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Description</Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary' }}>
                            {listing.description}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Sidebar: Vendor & Actions */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 88 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Contact Vendor</Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
                            <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'secondary.main', fontWeight: 'bold' }}>
                                {listing.vendor.name.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    {listing.vendor.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Replies within 1 hour
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<Phone />}
                                href={`tel:${listing.vendor.phone}`}
                                fullWidth
                            >
                                Show Contact
                            </Button>
                            <Button
                                variant="outlined"
                                color="success"
                                size="large"
                                startIcon={<WhatsApp />}
                                href={`https://wa.me/${listing.vendor.whatsapp}`}
                                target="_blank"
                                fullWidth
                                sx={{ borderColor: '#25D366', color: '#25D366', '&:hover': { borderColor: '#128C7E', bgcolor: '#e8f5e9' } }}
                            >
                                Start Chat
                            </Button>
                        </Box>

                        <Alert severity="warning" icon={<Security fontSize="inherit" />} sx={{ '& .MuiAlert-message': { fontSize: '0.85rem' } }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Safety Tips</Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                <li>Do not pay in advance</li>
                                <li>Meet in a safe public place</li>
                                <li>Check item before buying</li>
                            </Box>
                        </Alert>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ListingDetails;
