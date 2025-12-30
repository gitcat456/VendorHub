import {
    DirectionsCar,
    Home,
    Smartphone,
    Weekend,
    Build,
    Checkroom,
    FitnessCenter,
    Work,
    Category
} from '@mui/icons-material';

export const getCategoryIcon = (categoryName) => {
    const normalize = (name) => name?.toLowerCase() || '';

    if (normalize(categoryName).includes('vehicle') || normalize(categoryName).includes('car')) return <DirectionsCar />;
    if (normalize(categoryName).includes('propert') || normalize(categoryName).includes('home')) return <Home />;
    if (normalize(categoryName).includes('electronic') || normalize(categoryName).includes('phone')) return <Smartphone />;
    if (normalize(categoryName).includes('furnitur')) return <Weekend />;
    if (normalize(categoryName).includes('service') || normalize(categoryName).includes('repair')) return <Build />;
    if (normalize(categoryName).includes('fashion') || normalize(categoryName).includes('cloth')) return <Checkroom />;
    if (normalize(categoryName).includes('health') || normalize(categoryName).includes('fitness')) return <FitnessCenter />;
    if (normalize(categoryName).includes('job') || normalize(categoryName).includes('work')) return <Work />;

    return <Category />;
};
