'use client';
import {
  Home,
  Label,
  Logout,
  Person,
  PersonAdd,
  Settings,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  OutlinedInput,
  Tooltip,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { userDTO } from '@/model/user.model';
import axios from 'axios';
import Image from 'next/image';
import LocalGroceryStoreOutlinedIcon from '@mui/icons-material/LocalGroceryStoreOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
const Navbar = () => {
  const [profile, setProfile] = useState<userDTO>({});

  const router = useRouter();
  const API_URL = process.env.API_URL;
  const accessToken = Cookies.get('accessToken');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove('accessToken');
    router.push('/login/user-account');
    handleClose();
  };

  const handleNavigation = (e: string) => {
    router.push(e);
  };

  const getProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="p-4 bg-white flex justify-between items-center sticky top-0 z-10">
      <div className="flex flex-wrap w-[50%]">
        <div className="flex flex-wrap text-white p-1 bgr-primary mb-1 rounded">
          Cari Barang Mu
        </div>
        <FormControl variant="outlined" className="w-full">
          <OutlinedInput
            id="outlined-adornment-weight"
            sx={{ height: '40px' }}
            placeholder="Cari di WarungKu"
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              'aria-label': 'weight',
            }}
          />
        </FormControl>
      </div>
      <div className="flex">
        <Box
          sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
        >
          <Tooltip title="Wishlist">
            <IconButton
              size="small"
              sx={{ ml: 0 }}
              aria-haspopup="true"
              className="btn-circle overflow-hidden txt-primary"
              aria-expanded={open ? 'true' : undefined}
            >
              <FavoriteBorderOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
        >
          <Tooltip title="Keranjang Belanja">
            <IconButton
              size="small"
              sx={{ ml: 0 }}
              aria-haspopup="true"
              className="btn-circle overflow-hidden txt-primary"
              aria-expanded={open ? 'true' : undefined}
              onClick={() => handleNavigation('/cart')}
            >
              <LocalGroceryStoreOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
        >
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 0 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              className="btn-circle overflow-hidden txt-primary"
              aria-expanded={open ? 'true' : undefined}
            >
              {profile.images ? (
                <Avatar alt="" src={profile.images} />
              ) : (
                <Avatar sx={{ width: 32, height: 32 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.05))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleNavigation(`/`)}>
            <ListItemIcon>
              <Home fontSize="small" />
            </ListItemIcon>
            Dashboard
          </MenuItem>
          <MenuItem
            onClick={() =>
              handleNavigation(
                `${profile.rolesName === 'super' ? '/super/profile' : '/user'}`
              )
            }
          >
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            {profile.fullName}
          </MenuItem>
          {/* <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem> */}
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
