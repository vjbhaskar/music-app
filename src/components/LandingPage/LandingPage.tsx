import { Box, Button, Grid, Typography } from "@mui/material";
import { Link } from "wouter";
import { useBodyClass } from "../../hooks/useBodyClass";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  useBodyClass("landing-gradient");
  return (
    <>
      <Grid
        className="landing-page"
        container
        direction={"row"}
        display={"flex"}
        alignContent={"start"}
        justifyContent={"center"}
        sx={{
          margin: {
            xs: "0 10px",
            sm: "0 20px",
            md: "0 20vh",
            lg: "0 40vh",
            xl: "0 40vh",
          },
        }}
      >
        <Box>
          <img className={styles.finnLogo} src="../src/assets/logo_1.png" />
        </Box>
        <Grid size={12} className={styles.banner} textAlign={"center"}>
          <Typography variant="h2">FINN Tunes</Typography>
        </Grid>
        <Grid size={12} className={styles.banner} textAlign={"center"}>
          <Typography variant="h5">
            What’s a drive without the right soundtrack? FINN now offers
            subscriptions not only for cars, but also for great music to
            accompany every journey.
          </Typography>
        </Grid>

        <Link href="/home">
          <Button className={styles.homeNavigationButton} variant="contained">
            Get Started
          </Button>
        </Link>
      </Grid>
    </>
  );
};

export default LandingPage;
