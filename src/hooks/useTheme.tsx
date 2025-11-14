import { createTheme } from "@mui/material";
import { useState } from "react";

const useTheme = () => {
  const [isDark, setTheme] = useState(true);
  const theme = createTheme({
    colorSchemes: {
      dark: isDark,
    },
  });

  const onToggleTheme = () => {
    setTheme(!isDark);
  };

  return { theme, isDark, onToggleTheme };
};

export default useTheme;
