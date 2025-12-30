import React, { useEffect, useState } from 'react';
import { getProducts, getCategories } from '../api/products';
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActionArea,
    Chip,
    Box,
    Skeleton,
    Tabs,
    Tab,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(0); // 0 = All
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    getProducts(),
                    getCategories()
                ]);
                setProducts(prodRes);
                setCategories(catRes);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCategoryChange = (event, newValue) => {
        setSelectedCategory(newValue);
    };

    const filteredProducts = selectedCategory === 0
        ? products
        : products.filter(p => p.category?.id == categories[selectedCategory - 1].id);

    return (
        <Box>
            <Box sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="category tabs"
                >
                    <Tab label="All" />
                    {categories.map((cat) => (
                        <Tab key={cat.id} label={cat.name} />
                    ))}
                </Tabs>
            </Box>

            <Grid container spacing={3}>
                {loading ? (
                    Array.from(new Array(6)).map((_, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                            <Skeleton width="60%" sx={{ mt: 1 }} />
                            <Skeleton width="40%" />
                        </Grid>
                    ))
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardActionArea onClick={() => navigate(`/listing/${product.id}`)}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={product.image || 'https://via.placeholder.com/300?text=No+Image'}
                                        alt={product.name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                            <Typography gutterBottom variant="h6" component="div" noWrap title={product.name}>
                                                {product.name}
                                            </Typography>
                                            <Chip
                                                label={`$${product.price}`}
                                                color="secondary"
                                                size="small"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            display: '-webkit-box',
                                            overflow: 'hidden',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 2,
                                        }}>
                                            {product.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" color="text.secondary">
                                No products found in this category.
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default Home;
