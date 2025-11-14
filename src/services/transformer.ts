import type { Album, RawAlbum } from "../types/types";

export function transformItems(items: RawAlbum[]): Album[] {
  return items.map((item) => ({
    name: item["im:name"].label,
    title: item.title.label,
    artist: item["im:artist"].label,
    image: item["im:image"][item["im:image"].length - 1].label,
    price: item["im:price"]?.label ? item["im:price"].label : "0",
    currency: item["im:price"]?.attributes.currency
      ? item["im:price"].attributes.currency
      : "N/A",
    url: Array.isArray(item.link)
      ? item.link[0].attributes.href
      : item.link.attributes.href,
    id: item.id.attributes["im:id"],
    releaseDate: item["im:releaseDate"]?.label,
  }));
}
