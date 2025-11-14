import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "./Home";
import useAlbums from "../../hooks/useData";
import { categories, countries } from "../../services/commonLists";
import type { Album, Country } from "../../types/types";

vi.mock("../../hooks/useData");
vi.mock("../SideNav/SideNav", () => ({
  default: ({ categoryClicked }: { categoryClicked: (cat: any) => void }) => (
    <div data-testid="side-nav">
      <button onClick={() => categoryClicked(categories[1])}>Category</button>
    </div>
  ),
}));
vi.mock("../ImageCard/ImageCard", () => ({
  default: ({ cardData }: { cardData: Album }) => (
    <div data-testid={`image-card-${cardData.id}`}>{cardData.name}</div>
  ),
}));
vi.mock("../ImageCard/ImageCardSkeleton", () => ({
  default: () => <div data-testid="image-card-skeleton">Loading...</div>,
}));
vi.mock("../Commons/CountryList", () => ({
  default: ({
    selectedCountry,
    onSelectedCountry,
  }: {
    selectedCountry: string;
    onSelectedCountry: (country: Country) => void;
  }) => (
    <div data-testid="country-list">
      <span>{selectedCountry}</span>
      <button onClick={() => onSelectedCountry(countries[1])}>Country</button>
    </div>
  ),
}));

const mockAlbumData = [
  {
    name: "Around The World In A Day",
    title: "Around The World In A Day - Prince & The Revolution",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/de/3c/76/de3c7606-c57a-09d1-0ca0-32e020fc7660/886448892939.jpg/55x55bb.png",
    artist: "Prince & The Revolution",
    price: "$9.99",
    currency: "USD",
    url: "https://music.apple.com/us/album/around-the-world-in-a-day/1544292005?uo=2",
    id: "1544292005",
    releaseDate: "April 22, 1985",
  },
  {
    name: "12 ERA",
    title: "12 ERA - Rutshelle Guillaume",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d0/d8/d7/d0d8d727-6dcb-d5e0-7747-a83cd38365d9/cover.jpg/55x55bb.png",
    artist: "Rutshelle Guillaume",
    price: "$15.99",
    currency: "USD",
    url: "https://music.apple.com/us/album/12-era/1850498708?uo=2",
    id: "1850498708",
    releaseDate: "November 12, 2025",
  },
  {
    name: "Another Miracle",
    title: "Of Mice & Men",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d0/d8/d7/d0d8d727-6dcb-d5e0-7747-a83cd38365d9/cover.jpg/55x55bb.png",
    artist: "Rutshelle Guillaume",
    price: "$9.99",
    currency: "USD",
    url: "https://music.apple.com/us/album/another-miracle/1822538816?uo=2",
    id: "1822538816",
    releaseDate: "November 14, 2025",
  },
];

describe("Home Component", () => {
  const defaultProps = {
    showMenuBar: false,
    onMenuBarClosed: vi.fn(),
    searchString: "",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });
  // casted as any react query is already well tested
  describe("Loading State", () => {
    it("should display skeleton loaders when data is loading", () => {
      vi.mocked(useAlbums).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
      } as any);

      render(<Home {...defaultProps} />);

      const skeletons = screen.getAllByTestId("image-card-skeleton");
      expect(skeletons).toHaveLength(12);
    });
  });

  describe("Error State", () => {
    it("should display error message when there is an error", () => {
      const errorMessage = "Failed to fetch albums";
      vi.mocked(useAlbums).mockReturnValue({
        data: undefined,
        error: new Error(errorMessage),
        isLoading: false,
      } as any);

      render(<Home {...defaultProps} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe("Data Display", () => {
    it("should render album cards when data is loaded", () => {
      vi.mocked(useAlbums).mockReturnValue({
        data: mockAlbumData,
        error: null,
        isLoading: false,
      } as any);

      render(<Home {...defaultProps} />);

      expect(screen.getByTestId("image-card-1544292005")).toBeInTheDocument();
      expect(screen.getByTestId("image-card-1850498708")).toBeInTheDocument();
      expect(screen.getByTestId("image-card-1822538816")).toBeInTheDocument();
      expect(screen.getByText("Around The World In A Day")).toBeInTheDocument();
    });

    it("should display category name in header", () => {
      vi.mocked(useAlbums).mockReturnValue({
        data: mockAlbumData,
        error: null,
        isLoading: false,
      } as any);

      render(<Home {...defaultProps} />);

      expect(screen.getByText(`Top ${categories[0].name}`)).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    beforeEach(() => {
      vi.mocked(useAlbums).mockReturnValue({
        data: mockAlbumData,
        error: null,
        isLoading: false,
      } as any);
    });

    it("should filter albums by name when search string is provided", () => {
      render(
        <Home {...defaultProps} searchString="Around The World In A Day" />
      );

      expect(screen.getByTestId("image-card-1544292005")).toBeInTheDocument();
    });

    it("should filter albums by artist when search string is provided", () => {
      render(<Home {...defaultProps} searchString="Prince & The Revolution" />);

      expect(screen.queryByTestId("image-card-1544292005")).toBeInTheDocument();
    });

    it("should display all albums when search string is empty", () => {
      render(<Home {...defaultProps} searchString="" />);

      expect(screen.getByTestId("image-card-1544292005")).toBeInTheDocument();
      expect(screen.getByTestId("image-card-1850498708")).toBeInTheDocument();
      expect(screen.getByTestId("image-card-1822538816")).toBeInTheDocument();
    });
  });

  describe("Category and Country Selection", () => {
    it("should pass category query to useAlbums hook", () => {
      const mockUseAlbums = vi.mocked(useAlbums);
      mockUseAlbums.mockReturnValue({
        data: mockAlbumData,
        error: null,
        isLoading: false,
      } as any);

      render(<Home {...defaultProps} />);

      expect(mockUseAlbums).toHaveBeenCalledWith({
        category: categories[0],
        country: countries[0],
      });
    });

    it("should render SideNav component", () => {
      vi.mocked(useAlbums).mockReturnValue({
        data: mockAlbumData,
        error: null,
        isLoading: false,
      } as any);

      render(<Home {...defaultProps} />);

      expect(screen.getAllByTestId("side-nav")).toHaveLength(1);
    });

    it("should render CountryList component", () => {
      vi.mocked(useAlbums).mockReturnValue({
        data: mockAlbumData,
        error: null,
        isLoading: false,
      } as any);

      render(<Home {...defaultProps} />);

      expect(screen.getByTestId("country-list")).toBeInTheDocument();
    });
  });

  describe("Empty Data State", () => {
    it("should handle empty data array", () => {
      vi.mocked(useAlbums).mockReturnValue({
        data: [],
        error: null,
        isLoading: false,
      } as any);

      render(<Home {...defaultProps} />);

      expect(screen.queryByTestId(/image-card-/)).not.toBeInTheDocument();
    });
  });
});
