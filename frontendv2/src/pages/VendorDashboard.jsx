import React, { useState } from 'react';
import {
    Container, Grid, Paper, Typography, Box, Avatar, Tabs, Tab,
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress, DialogContentText
} from '@mui/material';
import { Add, Delete, Logout, Edit, Payment, CheckCircle, CloudUpload, Close, Warning } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useNotification } from '../context/NotificationContext';
import { updateProfile } from '../api/auth';
import { initiatePayment } from '../api/subscriptions';
import { useNavigate } from 'react-router-dom';

const VendorDashboard = () => {
    const { user, logout } = useAuth();
    const { products, categories, addProduct, updateProduct, deleteProduct, loading } = useProducts();
    const { showNotification } = useNotification();
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();

    // Modals state
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [openSubscriptionModal, setOpenSubscriptionModal] = useState(false);
    const [openEditProductModal, setOpenEditProductModal] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Profile Edit State
    const [editProfileData, setEditProfileData] = useState({
        username: user?.username || '',
        phone_number: user?.phone_number || '',
        location: user?.location || '',
        email: user?.email || '',
        profile_pic: null
    });
    const [profileLoading, setProfileLoading] = useState(false);

    // Subscription State
    const [subscriptionData, setSubscriptionData] = useState({ phone_number: user?.phone_number || '', amount: '1000' });
    const [paymentLoading, setPaymentLoading] = useState(false);

    // Filter products for the logged-in vendor
    const myProducts = products.filter(p => p.vendor?.id === user?.id || p.vendor === user?.id);

    // Add Product State
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category_id: '',
        description: '',
        image: null
    });
    const [newProductImagePreview, setNewProductImagePreview] = useState(null);
    const [addProductLoading, setAddProductLoading] = useState(false);

    // Edit Product State
    const [editingProduct, setEditingProduct] = useState(null);
    const [editProductData, setEditProductData] = useState({
        name: '',
        price: '',
        category_id: '',
        description: '',
        image: null
    });
    const [editProductImagePreview, setEditProductImagePreview] = useState(null);
    const [updateProductLoading, setUpdateProductLoading] = useState(false);

    if (!user) {
        return <Container sx={{ py: 8, textAlign: 'center' }}><Typography>Please login to view dashboard</Typography></Container>;
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        return path.startsWith('http') ? path : `http://127.0.0.1:8000${path}`;
    };

    // --- Image Handling Helper ---
    const handleImageChange = (e, setFileState, setPreviewState) => {
        const file = e.target.files[0];
        if (file) {
            setFileState(prev => ({ ...prev, image: file }));
            setPreviewState(URL.createObjectURL(file));
        }
    };

    // --- Product CRUD ---
    const handleAddProduct = async (e) => {
        e.preventDefault();
        setAddProductLoading(true);
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price);
        formData.append('description', newProduct.description);
        formData.append('category_id', newProduct.category_id || (categories[0]?.id));
        if (newProduct.image) {
            formData.append('image', newProduct.image);
        }

        try {
            await addProduct(formData);
            setTabValue(0);
            setNewProduct({ name: '', price: '', category_id: '', description: '', image: null });
            setNewProductImagePreview(null);
            showNotification('Product added successfully!', 'success');
        } catch (error) {
            console.error(error);
            showNotification('Failed to add product. Please check inputs.', 'error');
        } finally {
            setAddProductLoading(false);
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setEditProductData({
            name: product.name,
            price: product.price,
            category_id: product.category?.id || product.category_id || '',
            description: product.description,
            image: null
        });
        setEditProductImagePreview(getImageUrl(product.image));
        setOpenEditProductModal(true);
    };

    const handleUpdateProductSubmit = async (e) => {
        e.preventDefault();
        setUpdateProductLoading(true);
        const formData = new FormData();
        formData.append('name', editProductData.name);
        formData.append('price', editProductData.price);
        formData.append('description', editProductData.description);
        formData.append('category_id', editProductData.category_id);
        if (editProductData.image) {
            formData.append('image', editProductData.image);
        }

        try {
            await updateProduct(editingProduct.id, formData);
            setOpenEditProductModal(false);
            setEditingProduct(null);
            showNotification('Product updated successfully!', 'success');
        } catch (error) {
            console.error(error);
            showNotification('Failed to update product.', 'error');
        } finally {
            setUpdateProductLoading(false);
        }
    };

    const confirmDelete = (product) => {
        setProductToDelete(product);
        setOpenDeleteConfirm(true);
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        try {
            await deleteProduct(productToDelete.id);
            showNotification('Product deleted successfully', 'success');
            setOpenDeleteConfirm(false);
            setProductToDelete(null);
        } catch (error) {
            console.error(error);
            showNotification('Failed to delete product', 'error');
        }
    };

    // --- Profile Management ---
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        const formData = new FormData();
        formData.append('username', editProfileData.username);
        formData.append('phone_number', editProfileData.phone_number);
        formData.append('location', editProfileData.location);
        formData.append('email', editProfileData.email);
        if (editProfileData.profile_pic) {
            formData.append('profile_pic', editProfileData.profile_pic);
        }

        try {
            await updateProfile(formData);
            showNotification("Profile updated! Re-login to fully see changes.", 'success');
            setOpenProfileModal(false);
        } catch (error) {
            console.error(error);
            showNotification("Failed to update profile.", 'error');
        } finally {
            setProfileLoading(false);
        }
    };

    // --- Subscription Management ---
    const handleSubscribe = async () => {
        if (!subscriptionData.phone_number) {
            showNotification("Please enter a phone number", 'warning');
            return;
        }
        setPaymentLoading(true);
        try {
            const response = await initiatePayment(subscriptionData.amount, subscriptionData.phone_number);
            if (response.success || response.ResponseCode === "0") {
                showNotification(`Payment initiated! Check phone ${subscriptionData.phone_number}`, 'info');
                setOpenSubscriptionModal(false);
            } else {
                showNotification("Payment initiation failed: " + (response.error || "Unknown error"), 'error');
            }
        } catch (error) {
            console.error(error);
            showNotification("Error connecting to payment server.", 'error');
        } finally {
            setPaymentLoading(false);
        }
    };

    // --- Render Components ---
    const ImageUploadPreview = ({ preview, onClear, onChange, label }) => (
        <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>{label}</Typography>
            {preview ? (
                <Box sx={{ position: 'relative', width: '100%', height: 200, borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                    <Box component="img" src={preview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <IconButton
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}
                        onClick={onClear}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                </Box>
            ) : (
                <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ height: 200, borderStyle: 'dashed', flexDirection: 'column', gap: 1, color: 'text.secondary', borderColor: 'divider' }}
                >
                    <CloudUpload fontSize="large" />
                    <Typography>{label || "Click to upload image"}</Typography>
                    <input type="file" hidden accept="image/*" onChange={onChange} />
                </Button>
            )}
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Paper elevation={0} sx={{ p: 4, mb: 4, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#f8fafc' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main', fontSize: '2rem', border: '2px solid white', boxShadow: 1 }}
                            src={getImageUrl(user.profile_pic)}
                        >
                            {user.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight={700} sx={{ color: 'text.primary' }}>{user.username}</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                {user.email || 'Vendor Account'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Edit />}
                                    onClick={() => setOpenProfileModal(true)}
                                >
                                    Edit Profile
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    startIcon={<Payment />}
                                    onClick={() => setOpenSubscriptionModal(true)}
                                >
                                    Subscribe
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                    <Button variant="text" color="error" startIcon={<Logout />} onClick={() => { logout(); navigate('/'); }}>
                        Logout
                    </Button>
                </Box>
            </Paper>

            {/* Dashboard Content */}
            <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }} elevation={1}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'white' }}>
                    <Tab label="My Products" sx={{ fontWeight: 600 }} />
                    <Tab label="Add New Product" sx={{ fontWeight: 600 }} />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {tabValue === 0 && (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight={600}>Active Listings ({myProducts.length})</Typography>
                                <Button startIcon={<Add />} variant="contained" onClick={() => setTabValue(1)}>Create Listing</Button>
                            </Box>

                            <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                                <Table>
                                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {myProducts.length > 0 ? myProducts.map((product) => (
                                            <TableRow key={product.id} hover>
                                                <TableCell>
                                                    <Box component="img" src={getImageUrl(product.image) || 'https://via.placeholder.com/50'} sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }} />
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                                                <TableCell>{product.category?.name || 'Product'}</TableCell>
                                                <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>KES {Number(product.price).toLocaleString()}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton color="primary" size="small" onClick={() => handleEditClick(product)} sx={{ mr: 1 }}>
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton color="error" size="small" onClick={() => confirmDelete(product)}>
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                                    {loading ? 'Loading products...' : "You haven't posted any products yet."}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}

                    {tabValue === 1 && (
                        <Box component="form" onSubmit={handleAddProduct} sx={{ maxWidth: 700, mx: 'auto', py: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Create New Listing</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Product Name" required
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select fullWidth label="Category" required
                                        value={newProduct.category_id}
                                        onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                                    >
                                        {categories.map((cat) => (
                                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Price (KES)" type="number" required
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Description" multiline rows={6} required
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        placeholder="Describe the condition, features, and reason for selling..."
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <ImageUploadPreview
                                        preview={newProductImagePreview}
                                        label="Upload Product Image"
                                        onClear={() => { setNewProduct(prev => ({ ...prev, image: null })); setNewProductImagePreview(null); }}
                                        onChange={(e) => handleImageChange(e, setNewProduct, setNewProductImagePreview)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.5, fontSize: '1.1rem' }} disabled={addProductLoading}>
                                        {addProductLoading ? <CircularProgress size={24} /> : 'Post Ad Now'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Edit Product Modal */}
            <Dialog open={openEditProductModal} onClose={() => setOpenEditProductModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit Listing</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ pt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth label="Product Name" required
                                    value={editProductData.name}
                                    onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select fullWidth label="Category" required
                                    value={editProductData.category_id}
                                    onChange={(e) => setEditProductData({ ...editProductData, category_id: e.target.value })}
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth label="Price (KES)" type="number" required
                                    value={editProductData.price}
                                    onChange={(e) => setEditProductData({ ...editProductData, price: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth label="Description" multiline rows={6} required
                                    value={editProductData.description}
                                    onChange={(e) => setEditProductData({ ...editProductData, description: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ImageUploadPreview
                                    preview={editProductImagePreview}
                                    label="Update Product Image"
                                    onClear={() => { setEditProductData(prev => ({ ...prev, image: null })); setEditProductImagePreview(null); }}
                                    onChange={(e) => handleImageChange(e, setEditProductData, setEditProductImagePreview)}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditProductModal(false)}>Cancel</Button>
                    <Button onClick={handleUpdateProductSubmit} variant="contained" color="primary" disabled={updateProductLoading}>
                        {updateProductLoading ? <CircularProgress size={24} /> : 'Update Listing'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Profile Edit Modal */}
            <Dialog open={openProfileModal} onClose={() => setOpenProfileModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Username" fullWidth
                            value={editProfileData.username}
                            onChange={(e) => setEditProfileData({ ...editProfileData, username: e.target.value })}
                        />
                        <TextField
                            label="Phone Number" fullWidth
                            value={editProfileData.phone_number}
                            onChange={(e) => setEditProfileData({ ...editProfileData, phone_number: e.target.value })}
                        />
                        <TextField
                            label="Location" fullWidth
                            value={editProfileData.location}
                            onChange={(e) => setEditProfileData({ ...editProfileData, location: e.target.value })}
                        />
                        <TextField
                            label="Email" fullWidth
                            value={editProfileData.email}
                            onChange={(e) => setEditProfileData({ ...editProfileData, email: e.target.value })}
                        />
                        <Button variant="outlined" component="label">
                            Upload New Profile Picture
                            <input type="file" hidden accept="image/*" onChange={(e) => setEditProfileData({ ...editProfileData, profile_pic: e.target.files[0] })} />
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenProfileModal(false)}>Cancel</Button>
                    <Button onClick={handleProfileUpdate} variant="contained" disabled={profileLoading}>
                        {profileLoading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Subscription Modal */}
            <Dialog open={openSubscriptionModal} onClose={() => setOpenSubscriptionModal(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle color="success" /> Premium Subscription
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Subscribe to remove limits and boost your vendor profile visibility.
                    </Typography>
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f0fff4', borderRadius: 1, border: '1px solid #c6f6d5' }}>
                        <Typography variant="h5" color="success.main" fontWeight="bold">KES 1,000</Typography>
                        <Typography variant="caption">per month</Typography>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <TextField
                            label="M-Pesa Phone Number" fullWidth
                            value={subscriptionData.phone_number}
                            onChange={(e) => setSubscriptionData({ ...subscriptionData, phone_number: e.target.value })}
                            placeholder="2547XXXXXXXX"
                            helperText="Enter format: 2547..."
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSubscriptionModal(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubscribe}
                        variant="contained"
                        color="success"
                        disabled={paymentLoading}
                        startIcon={!paymentLoading && <Payment />}
                    >
                        {paymentLoading ? <CircularProgress size={24} color="inherit" /> : 'Pay Now'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteConfirm}
                onClose={() => setOpenDeleteConfirm(false)}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                    <Warning /> Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this listing? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
                    <Button onClick={handleDeleteProduct} variant="contained" color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default VendorDashboard;
