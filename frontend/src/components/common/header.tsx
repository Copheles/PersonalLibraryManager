"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  NotificationsNone,
  Settings,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import useLogout from "@/libs/tanstack/auth/useLogout";

interface HeaderProps {
  onDrawerToggle?: () => void;
}

export default function Header({ onDrawerToggle }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const mutation = useLogout();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    router.push("/profile");
  };

  const handleLogout = () => {
    mutation.mutate();
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { xs: "100%", md: "calc(100% - 240px)" },
        ml: { md: "240px" },
        backgroundColor: "background.paper",
        color: "text.primary",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: { xs: 2, sm: 3 } }}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2, color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Title */}
        <Typography
          variant="h6"
          component="h1"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            fontSize: "1.25rem",
            background: "linear-gradient(45deg, #1976d2, #00bcd4)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          
        </Typography>

        {/* Action Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <Badge badgeContent={3} color="error">
              <NotificationsNone fontSize="small" />
            </Badge>
          </IconButton>

          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <Settings fontSize="small" />
          </IconButton>
        </Box>

        {/* User Menu */}
        <Box>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{
              border: "2px solid",
              borderColor: "divider",
              "&:hover": {
                borderColor: "primary.main",
              },
              transition: "all 0.2s ease",
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: "primary.main",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              U
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 140,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                border: "1px solid",
                borderColor: "divider",
                "& .MuiMenuItem-root": {
                  fontSize: "0.875rem",
                  py: 1,
                  px: 2,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                },
              },
            }}
          >
            <MenuItem onClick={handleProfile}>My Profile</MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
