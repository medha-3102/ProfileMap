import React, { useState } from 'react';
import { useProfiles } from './ProfileContext';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  MenuItem,
  Container,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ProfileListPage = () => {
  const { profiles } = useProfiles();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredProfiles = profiles
    .filter((profile) =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((profile) =>
      filter === 'All' ? true : profile.description.toLowerCase() === filter.toLowerCase()
    );

  const professions = ['All', ...new Set(profiles.map((p) => p.description))];

  return (
    <Container
      sx={{
        pt: 0, 
        px: 2, 
        pb: 3,
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3, 
          mt: 2, 
        }}
      >
        <TextField
          label="Search by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="medium"
          sx={{ 
            flex: 1,
            minWidth: '250px',
            '& .MuiOutlinedInput-root': {
              borderRadius: 1
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          label="Filter by Profession"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          variant="outlined"
          size="medium"
          sx={{ 
            flex: 1,
            minWidth: '200px',
            '& .MuiOutlinedInput-root': {
              borderRadius: 1
            }
          }}
        >
          {professions.map((profession, index) => (
            <MenuItem key={index} value={profession}>
              {profession}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {filteredProfiles.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" sx={{ py: 4 }}>
              No profiles found.
            </Typography>
          </Grid>
        ) : (
          filteredProfiles.map((profile) => (
            <Grid item xs={12} sm={6} md={4} key={profile.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3, // Added hover shadow effect
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={profile.image || 'https://via.placeholder.com/150'}
                  alt={profile.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {profile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {profile.description}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/profile/${profile.id}`}
                    variant="contained"
                    color="primary"
                    sx={{ 
                      alignSelf: 'flex-start',
                      textTransform: 'none',
                      borderRadius: 1,
                    }}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default ProfileListPage;
