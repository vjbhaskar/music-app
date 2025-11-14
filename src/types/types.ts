import type { SvgIconProps } from "@mui/material";
export interface AppleAPIData {
  feed: {
    id: string;
    entry: RawAlbum[];
    country: string;
    title: string;
  };
}

export interface RawAlbum {
  ["im:name"]: { label: string };
  ["im:image"]: { label: string; attributes: { height: string } }[];
  ["im:price"]: {
    label: string;
    attributes: { amount: string; currency: string };
  };
  title: { label: string };
  link: { attributes: { href: string } };
  id: { attributes: { "im:id": string } };
  ["im:artist"]: { label: string };
  ["im:releaseDate"]: { label: string };
}

export type Album = {
  name: string;
  title: string;
  image: string;
  artist: string;
  price: string;
  currency: string;
  url: string;
  id: string;
  releaseDate: string;
};

export interface Genres {
  genreId: string;
  name: string;
  url: string;
}

export interface Country {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  slug: string;
  icon: React.ElementType<SvgIconProps>;
}
