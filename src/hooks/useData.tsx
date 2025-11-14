// import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
// import axios from "axios";

import axios from "axios";
import type { Album, AppleAPIData, Category, Country } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { transformItems } from "../services/transformer";

interface ListQuery {
  category: Category;
  country: Country;
}
const useData = ({ category, country }: ListQuery) => {
  const fetchAPIData = () => {
    return axios
      .get<AppleAPIData>(
        `https://itunes.apple.com/${country.slug}/rss/${category.slug}/limit=100/json`
      )
      .then((res) => {
        console.log("res.data", res.data);
        const result = transformItems(res.data.feed.entry);
        console.log("result", result);
        return result;
      });
  };
  return useQuery<Album[], Error>({
    queryKey: ["data", { country, category }],
    queryFn: fetchAPIData,
  });
};

export default useData;
