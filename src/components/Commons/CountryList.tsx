import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { Country } from "../../types/types";
import { countries } from "../../services/commonLists";

interface CountryPros {
  selectedCountry: string;
  onSelectedCountry: (country: Country) => void;
}

const CountryList = ({ selectedCountry, onSelectedCountry }: CountryPros) => {
  const onSelected = (countrySlug: string) => {
    // Need to filter using slug because we cannot give value as an object for MenuItem.
    const countryVal = countries.filter((c) => c.slug === countrySlug);
    onSelectedCountry(countryVal[0]);
  };
  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 140 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Country</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={selectedCountry}
          onChange={(event) => {
            onSelected(event.target.value);
          }}
          autoWidth
          label="Country"
        >
          {countries.map((country) => (
            <MenuItem key={country.slug} value={country.slug}>
              {country.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default CountryList;
