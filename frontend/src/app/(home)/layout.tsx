"use client";

import Header from "@/components/common/header";
import LeftSideBar from "@/components/common/left-sidebar";
import ProtectedPage from "@/components/guard/protected.guard";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <ProtectedPage />
      <Box
        sx={{
          display: "flex",
          bgcolor: "#f0f2f5",
          minHeight: "100vh",
          width: "100vw",
          maxWidth: "100%",
          overflowX: "hidden", // Prevent horizontal scroll
        }}
      >
        {/* Left Sidebar */}
        <LeftSideBar
          mobileOpen={mobileOpen}
          onDrawerToggle={handleDrawerToggle}
        />

        {/* Main Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", md: `calc(100% - 240px)` },
            minHeight: "100vh",
          }}
        >
          {/* Header */}
          <Header onDrawerToggle={handleDrawerToggle} />

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 2 },
              mt: { xs: 7, sm: 8 },
              minHeight: "calc(100vh - 64px)",
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              overflow: "hidden", 
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "100%",
                overflow: "auto", 
                backgroundColor: "white",
                minHeight: '80vh',
                borderRadius: '10px',
                p: '10px',
                "&::-webkit-scrollbar": {
                  width: "8px",
                  height: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#c1c1c1",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#a8a8a8",
                },
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
