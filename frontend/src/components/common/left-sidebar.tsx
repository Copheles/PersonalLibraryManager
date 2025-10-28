"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { Book, Dashboard, Close, Add } from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/books" },
  { text: "Create Book", icon: <Add />, path: "/books/create" },
];

interface LeftSideBarProps {
  mobileOpen?: boolean;
  onDrawerToggle?: () => void;
}

export default function LeftSideBar({
  mobileOpen = false,
  onDrawerToggle,
}: LeftSideBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile && onDrawerToggle) {
      onDrawerToggle();
    }
  };

  const drawerContent = (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                background: "linear-gradient(45deg, #1976d2, #00bcd4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <Book sx={{ fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              BookHub
            </Typography>
          </Box>
        </Box>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <Box
          sx={{
            p: 3,
            borderBottom: 1,
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                background: "linear-gradient(45deg, #1976d2, #00bcd4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <Book sx={{ fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              BookHub
            </Typography>
          </Box>
        </Box>
      )}

      {/* Navigation Items */}
      <Box sx={{ p: 2 }}>
        <List sx={{ width: "100%", p: 0 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ width: "100%", mb: 0.5 }}
            >
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: pathname === item.path ? "white" : "text.secondary",
                    minWidth: "40px",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: pathname === item.path ? 600 : 500,
                    fontSize: "0.9rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            border: "none",
            boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: 260,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 260,
            border: "none",
            background: "background.paper",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
