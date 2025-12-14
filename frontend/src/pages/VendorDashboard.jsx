import React, { useState } from 'react';
import {
    Container, Grid, Paper, Typography, Box, Avatar, Tabs, Tab,
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, MenuItem, IconButton
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

const VendorDashboard = () => {
    const { user, logout } = useAuth();
    const { products, addProduct, deleteProduct } = useProducts();
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();

    // Determine my products (mock logic: all products since auth is local, 
    // or filter if we had vendor IDs. Let's assume for this single-session mock, all new products are ours.
    // Real app would filter by user.id)
    const myProducts = products.filter(p => p.vendor?.name === user?.name || !p.vendor); // Simple filter

    const [newProduct, setNewProduct] = useState({
        title: '',
        price: '',
        category: CATEGORIES[0].name,
        location: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=500' // Placeholder
    });

    if (!user) {
        return <Container sx={{ py: 4 }}>Loading...</Container>;
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleAddProduct = (e) => {
        e.preventDefault();
        const productData = {
            ...newProduct,
            price: Number(newProduct.price),
            currency: 'KES',
            vendor: {
                name: user.name,
                phone: user.phone,
                whatsapp: user.whatsapp
            }
        };
        addProduct(productData);
        setTabValue(0); // Switch to list
        setNewProduct({ ...newProduct, title: '', price: '', description: '' }); // Reset form
        alert('Product added successfully to Marketplace!');
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Paper elevation={3} sx={{ p: 4, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'secondary.main', fontSize: '2rem' }}>
                        {user.avatar}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>{user.name}</Typography>
                        <Typography variant="body1" color="text.secondary">{user.email}</Typography>
                    </Box>
                </Box>
                <Button variant="outlined" color="error" onClick={() => { logout(); navigate('/'); }}>
                    Logout
                </Button>
            </Paper>

            {/* Dashboard Content */}
            <Paper sx={{ mb: 4 }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                    <Tab label="My Products" />
                    <Tab label="Add Product" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {tabValue === 0 && (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Active Listings ({myProducts.length})</Typography>
                                <Button startIcon={<Add />} variant="contained" onClick={() => setTabValue(1)}>New Listing</Button>
                            </Box>

                            <TableContainer component={Paper} elevation={0} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Image</TableCell>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {myProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <Box component="img" src={product.image} sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }} />
                                                </TableCell>
                                                <TableCell>{product.title}</TableCell>
                                                <TableCell>{product.category}</TableCell>
                                                <TableCell>{product.currency} {product.price.toLocaleString()}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton color="error" onClick={() => deleteProduct(product.id)}>
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {myProducts.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">No products found. Start selling today!</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}

                    {tabValue === 1 && (
                        <Box component="form" onSubmit={handleAddProduct} sx={{ maxWidth: 600, mx: 'auto' }}>
                            <Typography variant="h6" gutterBottom>Create New Listing</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Product Title" required
                                        value={newProduct.title}
                                        onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select fullWidth label="Category" required
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Price" type="number" required
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Location" required
                                        value={newProduct.location}
                                        onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Description" multiline rows={4} required
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Image URL (Placeholder)"
                                        value={newProduct.image}
                                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                        helperText="For demo, using a default placeholder image"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" size="large" fullWidth>Post Ad</Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default VendorDashboard;
