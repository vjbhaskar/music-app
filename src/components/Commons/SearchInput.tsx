import SearchRounded from "@mui/icons-material/SearchRounded";
import { FormControl, InputLabel, Input, InputAdornment } from "@mui/material";
import { useRef } from "react";
interface SearchInputProps {
  onSearchSubmit: (searchString: string) => void;
}
const SearchInput = ({ onSearchSubmit }: SearchInputProps) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <form
      style={{ width: "100%" }}
      onSubmit={(event) => {
        event.preventDefault();
        if (ref.current) {
          onSearchSubmit(ref.current.value);
        }
      }}
    >
      <FormControl
        sx={{ width: "100%", paddingLeft: "3px" }}
        variant="standard"
      >
        <InputLabel htmlFor="input-with-icon-adornment">Search</InputLabel>
        <Input
          id="input-with-icon-adornment"
          inputRef={ref}
          startAdornment={
            <InputAdornment position="start">
              <SearchRounded />
            </InputAdornment>
          }
        />
      </FormControl>
    </form>
  );
};

export default SearchInput;
