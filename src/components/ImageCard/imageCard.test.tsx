import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ImageCard from "./ImageCard";
import type { Album } from "../../types/types";

// Mock the image service
// Not an exact mock as the item being tested here is image card component
vi.mock("../../services/image-url", () => ({
  default: (url: string, width: number, height: number) =>
    `${url}?w=${width}&h=${height}`,
}));

// Mock the CSS module
vi.mock("./ImageCard.module.css", () => ({
  default: {
    infoText: "infoText",
  },
}));

// Helper function to render with Material-UI theme
const renderWithTheme = (component: React.ReactElement) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("ImageCard", () => {
  const mockAlbum: Album = {
    id: "1544292005",
    name: "Around The World In A Day",
    artist: "Prince & The Revolution",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/de/3c/76/de3c7606-c57a-09d1-0ca0-32e020fc7660/886448892939.jpg/55x55bb.png",
    price: "$9.99",
    url: "https://music.apple.com/us/album/around-the-world-in-a-day/1544292005?uo=2",
    title: "Around The World In A Day - Prince & The Revolution",
    currency: "USD",
    releaseDate: "April 22, 1985",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("open", vi.fn());
  });

  it("renders without crashing", () => {
    renderWithTheme(<ImageCard cardData={mockAlbum} />);
    expect(screen.getByText("Around The World In A Day")).toBeInTheDocument();
  });

  it("displays album name", () => {
    renderWithTheme(<ImageCard cardData={mockAlbum} />);
    expect(screen.getByText("Around The World In A Day")).toBeInTheDocument();
  });

  it("displays artist name", () => {
    renderWithTheme(<ImageCard cardData={mockAlbum} />);
    expect(screen.getByText("Prince & The Revolution")).toBeInTheDocument();
  });

  it("displays price", () => {
    renderWithTheme(<ImageCard cardData={mockAlbum} />);
    expect(screen.getByText("$9.99")).toBeInTheDocument();
  });

  it("renders album image with correct src", () => {
    renderWithTheme(<ImageCard cardData={mockAlbum} />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute(
      "src",
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/de/3c/76/de3c7606-c57a-09d1-0ca0-32e020fc7660/886448892939.jpg/55x55bb.png?w=200&h=150"
    );
  });

  it("applies correct image dimensions to CardMedia", () => {
    renderWithTheme(<ImageCard cardData={mockAlbum} />);
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
  });

  it("shows title attributes for name and artist", () => {
    renderWithTheme(<ImageCard cardData={mockAlbum} />);

    const nameElement = screen.getByText("Around The World In A Day");
    expect(nameElement).toHaveAttribute("title", "Around The World In A Day");

    const artistElement = screen.getByText("Prince & The Revolution");
    expect(artistElement).toHaveAttribute("title", "Prince & The Revolution");
  });

  it("initially renders unfilled favorite icon", () => {
    renderWithTheme(<ImageCard cardData={mockAlbum} />);
    const favoriteButton = screen.getByTitle("Favourite");

    const svg = within(favoriteButton).getByTestId("FavoriteBorderIcon");
    expect(svg).toBeInTheDocument();
  });

  it("toggles favorite icon when clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ImageCard cardData={mockAlbum} />);

    const favoriteButton = screen.getByTitle("Favourite");

    expect(
      within(favoriteButton).getByTestId("FavoriteBorderIcon")
    ).toBeInTheDocument();

    await user.click(favoriteButton);

    expect(
      within(favoriteButton).getByTestId("FavoriteIcon")
    ).toBeInTheDocument();
  });

  it("toggles favorite back to unfilled when clicked twice", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ImageCard cardData={mockAlbum} />);

    const favoriteButton = screen.getByTitle("Favourite");

    await user.click(favoriteButton);
    expect(
      within(favoriteButton).getByTestId("FavoriteIcon")
    ).toBeInTheDocument();

    await user.click(favoriteButton);
    expect(
      within(favoriteButton).getByTestId("FavoriteBorderIcon")
    ).toBeInTheDocument();
  });

  it("renders shop/buy button", () => {
    renderWithTheme(<ImageCard cardData={mockAlbum} />);
    const buyButton = screen.getByTitle("Buy on Itunes");
    expect(buyButton).toBeInTheDocument();
  });

  it("opens album URL in new tab when buy button is clicked", async () => {
    const user = userEvent.setup();
    const mockWindowOpen = vi.fn();
    vi.stubGlobal("open", mockWindowOpen);

    renderWithTheme(<ImageCard cardData={mockAlbum} />);

    const buyButton = screen.getByTitle("Buy on Itunes");
    await user.click(buyButton);

    expect(mockWindowOpen).toHaveBeenCalledTimes(1);
    expect(mockWindowOpen).toHaveBeenCalledWith(
      "https://music.apple.com/us/album/around-the-world-in-a-day/1544292005?uo=2",
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("renders ShopIcon in buy button", () => {
    renderWithTheme(<ImageCard cardData={mockAlbum} />);
    const buyButton = screen.getByTitle("Buy on Itunes");
    const shopIcon = within(buyButton).getByTestId("ShopIcon");
    expect(shopIcon).toBeInTheDocument();
  });

  it("renders both action buttons", () => {
    renderWithTheme(<ImageCard cardData={mockAlbum} />);

    const favoriteButton = screen.getByTitle("Favourite");
    const buyButton = screen.getByTitle("Buy on Itunes");

    expect(favoriteButton).toBeInTheDocument();
    expect(buyButton).toBeInTheDocument();
  });

  it("handles different price formats", () => {
    const differentPriceAlbum: Album = {
      ...mockAlbum,
      price: "€15.99",
    };

    renderWithTheme(<ImageCard cardData={differentPriceAlbum} />);
    expect(screen.getByText("€15.99")).toBeInTheDocument();
  });

  it("card has proper structure with all sections", () => {
    const { container } = renderWithTheme(<ImageCard cardData={mockAlbum} />);

    const card = container.querySelector(".MuiCard-root");
    expect(card).toBeInTheDocument();

    expect(container.querySelector(".MuiCardMedia-root")).toBeInTheDocument();

    expect(container.querySelector(".MuiCardContent-root")).toBeInTheDocument();

    expect(container.querySelector(".MuiCardActions-root")).toBeInTheDocument();
  });

  it("calls getCroppedImageUrl with correct parameters", () => {
    renderWithTheme(<ImageCard cardData={mockAlbum} />);
    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("src", expect.stringContaining("w=200"));
    expect(image).toHaveAttribute("src", expect.stringContaining("h=150"));
  });
});
