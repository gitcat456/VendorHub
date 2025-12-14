import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import { Place, AccessTime } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/listing/${listing.id}`)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={listing.image}
        alt={listing.title}
        sx={{ bgcolor: '#eee' }}
      />
      <Chip
        label={listing.category}
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          bgcolor: 'rgba(0,0,0,0.6)',
          color: 'white',
          backdropFilter: 'blur(4px)'
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 2, pb: '16px !important' }}>
        <Typography gutterBottom variant="h6" component="div" noWrap sx={{ fontSize: '1rem', fontWeight: 600 }}>
          {listing.title}
        </Typography>

        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
          {listing.currency} {listing.price.toLocaleString()}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Place sx={{ fontSize: 14 }} />
            <Typography variant="caption">{listing.location}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime sx={{ fontSize: 14 }} />
            <Typography variant="caption">{listing.postedAt}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ListingCard;
