import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { useLocation } from "wouter";
import styles from "./NavBar.module.css";
import MenuIcon from "@mui/icons-material/Menu";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchInput from "../Commons/SearchInput";

interface NavBarProps {
  toggleTheme: () => void;
  currentMode: boolean;
  onMenuClicked: () => void;
  onSearchSubmit: (str: string) => void;
  goHome: () => void;
}
const NavBar = ({
  toggleTheme,
  currentMode,
  onMenuClicked,
  onSearchSubmit,
  goHome,
}: NavBarProps) => {
  const [location] = useLocation();
  const hideOnMobile = {
    flexGrow: 1,
    display: {
      xs: "none",
      sm: "block",
      md: "block",
      lg: "block",
      xl: "block",
    },
  };
  const showOnMobile = {
    flexGrow: 1,
    display: {
      xs: "block",
      sm: "none",
      md: "none",
      lg: "none",
      xl: "none",
    },
  };
  return (
    <AppBar position="static" style={{ width: "100%" }} sx={{ Height: 1 }}>
      <Box sx={{ width: "100%" }}>
        <Toolbar disableGutters>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", width: "10%" }}>
              {currentMode && (
                <Box
                  sx={hideOnMobile}
                  onClick={() => {
                    goHome();
                  }}
                >
                  <img
                    className={styles.logoImage}
                    src={"/assets/finn-tunes-primary-dark.png"}
                  />
                </Box>
              )}
              {!currentMode && (
                <Box
                  sx={hideOnMobile}
                  onClick={() => {
                    goHome();
                  }}
                >
                  <img
                    className={styles.logoImage}
                    src={"/assets/finn-tunes-primary-light.png"}
                  />
                </Box>
              )}
              {location !== "/" && (
                <Box sx={showOnMobile}>
                  <IconButton onClick={() => onMenuClicked()}>
                    <MenuIcon />
                  </IconButton>
                </Box>
              )}
              {location == "/" && (
                <Box sx={showOnMobile}>
                  <img
                    className={styles.logoImage}
                    src={"/assets/finn-tunes-icon.png"}
                  />
                </Box>
              )}
            </div>
            {location === "/home" && (
              <div>
                <SearchInput onSearchSubmit={onSearchSubmit} />
              </div>
            )}
            <Box
              className={styles.themeButton}
              onClick={() => {
                toggleTheme();
              }}
            >
              {currentMode && (
                <IconButton aria-label="theme-switch" color="primary">
                  <ModeNightIcon />
                </IconButton>
              )}
              {!currentMode && (
                <IconButton aria-label="theme-switch" color="secondary">
                  <LightModeIcon />
                </IconButton>
              )}
            </Box>
          </div>
        </Toolbar>
      </Box>
    </AppBar>
  );
};
export default NavBar;
