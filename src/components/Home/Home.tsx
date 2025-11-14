import { Drawer, Grid, Typography } from "@mui/material";
import SideNav from "../SideNav/SideNav";
import useAlbums from "../../hooks/useData";
import ImageCard from "../ImageCard/ImageCard";
import { useMemo, useState } from "react";
import ImageCardSkeleton from "../ImageCard/ImageCardSkeleton";
import { categories, countries } from "../../services/commonLists";
import type { Category, Country } from "../../types/types";
import CountryList from "../Commons/CountryList";

interface HomeProps {
  showMenuBar: boolean;
  onMenuBarClosed: (val: boolean) => void;
  searchString: string;
}

const Home = ({ showMenuBar, onMenuBarClosed, searchString }: HomeProps) => {
  const [categoryQuery, setCategoryQuery] = useState<Category>(categories[0]);
  const [countryQuery, setCountryQuery] = useState<Country>(countries[0]);
  const { data, error, isLoading } = useAlbums({
    category: categoryQuery,
    country: countryQuery,
  });

  const queriedData = useMemo(() => {
    if (!searchString) return data;
    const q = searchString.trim().toLowerCase();
    return data?.filter(
      (a) =>
        a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q)
    );
  }, [data, searchString]);

  const cardStyles = {
    display: "flex",
    justifyContent: "space-evenly",
    flexFlow: "wrap",
    mb: 1.5,
    mt: 2,
  };

  const hideInSmallScreen = {
    display: {
      xs: "none",
      sm: "block",
      md: "block",
      lg: "block",
      xl: "block",
    },
  };

  const showInSmallScreen = {
    display: {
      xs: "block",
      sm: "none",
      md: "none",
      lg: "none",
      xl: "none",
    },
  };
  return (
    <>
      <Grid size={{ sm: 2, md: 2, lg: 2, xl: 2 }} sx={hideInSmallScreen}>
        <SideNav categoryClicked={(category) => setCategoryQuery(category)} />
      </Grid>
      <Grid size={{ sm: 2, md: 2, lg: 2, xl: 2 }} sx={showInSmallScreen}>
        <Drawer
          anchor={"left"}
          open={showMenuBar}
          onClose={() => {
            onMenuBarClosed(!showMenuBar);
          }}
        >
          <SideNav
            categoryClicked={(category) => {
              setCategoryQuery(category);
              onMenuBarClosed(!showMenuBar);
            }}
          />
        </Drawer>
      </Grid>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
        }}
        size={{ xs: 12, sm: 10, md: 10, lg: 10, xl: 10 }}
      >
        <Grid
          size={12}
          sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
        >
          <Typography variant="h4">{`Top ${categoryQuery.name}`}</Typography>
          <CountryList
            selectedCountry={countryQuery.slug}
            onSelectedCountry={(country) => setCountryQuery(country)}
          />
        </Grid>
        <Grid
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            flexFlow: "wrap",
          }}
        >
          {isLoading &&
            Array.from({ length: 12 }, (_, i) => i).map((_, index) => {
              return (
                <Grid
                  key={index}
                  size={{ xs: 8, sm: 4, md: 3, lg: 3, xl: 2 }}
                  sx={cardStyles}
                >
                  <ImageCardSkeleton />
                </Grid>
              );
            })}
          {!isLoading && error && <p> {error.message} </p>}
          {!isLoading && queriedData?.length === 0 && (
            <Typography>No albums found matching "{searchString}"</Typography>
          )}

          {!isLoading &&
            queriedData &&
            queriedData.map((g) => (
              <Grid
                key={g.id}
                size={{ xs: 8, sm: 4, md: 3, lg: 3, xl: 2 }}
                sx={cardStyles}
              >
                <ImageCard cardData={g} />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
