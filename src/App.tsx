import { Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useTheme from "./hooks/useTheme";
import "./App.css";
import { Redirect, Route, Switch } from "wouter";
import NavBar from "./components/Navbar/NavBar";
import { lazy, Suspense, useCallback, useState } from "react";
import { useLocation } from "wouter";

const LandingPage = lazy(() => import("./components/LandingPage/LandingPage"));
const Home = lazy(() => import("./components/Home/Home"));

function App() {
  const { theme, isDark, onToggleTheme } = useTheme();
  const [showMenuBar, setShowMenuBar] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [location, setLocation] = useLocation();
  const onMenuBarClosed = (val: boolean) => {
    setShowMenuBar(val);
  };

  const goHome = () => {
    if (location !== "/") setLocation("/");
  };
  const onMenuClicked = useCallback(() => {
    setShowMenuBar((prevVal) => !prevVal);
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Grid container direction="row" className="app-wrapper">
          <NavBar
            currentMode={isDark}
            toggleTheme={onToggleTheme}
            goHome={goHome}
            onMenuClicked={onMenuClicked}
            onSearchSubmit={(searchText) => setSearchString(searchText)}
          />
          <Grid
            display="flex"
            className="route-wrapper"
            container
            direction="row"
          >
            <Suspense fallback={<div className="loading-screen">Loading…</div>}>
              <Switch>
                <Route path="/" component={LandingPage} />
                <Route path="/home">
                  {() => (
                    <Home
                      showMenuBar={showMenuBar}
                      onMenuBarClosed={onMenuBarClosed}
                      searchString={searchString}
                    />
                  )}
                </Route>
                <Route>{() => <Redirect to="/" />}</Route>
              </Switch>
            </Suspense>
          </Grid>
        </Grid>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
