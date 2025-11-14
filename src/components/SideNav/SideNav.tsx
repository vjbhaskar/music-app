import {
  Box,
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import { categories } from "../../services/commonLists";
import type { Category } from "../../types/types";
import { useState } from "react";
import { useLocation } from "wouter";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";

interface SideNavProps {
  categoryClicked: (navItem: Category) => void;
}

const SideNav = ({ categoryClicked }: SideNavProps) => {
  const [selectedItem, setSelectedItem] = useState("");
  const [location, setLocation] = useLocation();
  const theme = useTheme();
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
  const goToHome = () => {
    if (location !== "/") setLocation("/");
  };
  return (
    <Box
      sx={{ borderRight: `1px solid ${theme.palette.divider}`, height: "100%" }}
    >
      <List>
        {categories.map((navItem, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              selected={navItem.slug === selectedItem}
              onClick={() => {
                setSelectedItem(navItem.slug);
                categoryClicked(navItem);
              }}
            >
              <Icon component={navItem.icon} />
              <ListItemText primary={navItem.name} sx={{ p: 1 }} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem sx={showOnMobile} disablePadding>
          <ListItemButton
            onClick={() => {
              goToHome();
            }}
          >
            <Icon component={HomeFilledIcon} />
            <ListItemText primary={"Main Page"} sx={{ p: 1 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default SideNav;
