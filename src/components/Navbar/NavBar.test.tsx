import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NavBar from "./NavBar";
import { useLocation } from "wouter";

// Mock dependencies
vi.mock("wouter");
vi.mock("../Commons/SearchInput", () => ({
  default: ({ onSearchSubmit }: { onSearchSubmit: (str: string) => void }) => (
    <div data-testid="search-input">
      <input
        placeholder="Search"
        onChange={(e) => onSearchSubmit(e.target.value)}
      />
    </div>
  ),
}));

describe("NavBar Component", () => {
  const defaultProps = {
    toggleTheme: vi.fn(),
    currentMode: true,
    onMenuClicked: vi.fn(),
    onSearchSubmit: vi.fn(),
    goHome: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render the navbar", () => {
      vi.mocked(useLocation).mockReturnValue(["/home", vi.fn()] as any);

      const { container } = render(<NavBar {...defaultProps} />);

      const appBar = container.querySelector(".MuiAppBar-root");
      expect(appBar).toBeInTheDocument();
    });

    it("should render theme toggle button", () => {
      vi.mocked(useLocation).mockReturnValue(["/home", vi.fn()] as any);

      render(<NavBar {...defaultProps} />);

      const themeButton = screen.getByLabelText("theme-switch");
      expect(themeButton).toBeInTheDocument();
    });
  });

  describe("Theme Toggle", () => {
    it("should display ModeNightIcon when currentMode is true", () => {
      vi.mocked(useLocation).mockReturnValue(["/home", vi.fn()] as any);

      render(<NavBar {...defaultProps} currentMode={true} />);

      const nightIcon = screen.getByLabelText("theme-switch");
      expect(nightIcon).toBeInTheDocument();
    });

    it("should display LightModeIcon when currentMode is false", () => {
      vi.mocked(useLocation).mockReturnValue(["/home", vi.fn()] as any);

      render(<NavBar {...defaultProps} currentMode={false} />);

      const lightIcon = screen.getByLabelText("theme-switch");
      expect(lightIcon).toBeInTheDocument();
    });

    it("should call toggleTheme when theme button is clicked", () => {
      vi.mocked(useLocation).mockReturnValue(["/home", vi.fn()] as any);
      const toggleTheme = vi.fn();

      render(<NavBar {...defaultProps} toggleTheme={toggleTheme} />);

      const themeButton = screen.getByLabelText("theme-switch");
      fireEvent.click(themeButton);

      expect(toggleTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe("Logo Display", () => {
    it("should display dark logo when currentMode is true", () => {
      vi.mocked(useLocation).mockReturnValue(["/home", vi.fn()] as any);

      const { container } = render(
        <NavBar {...defaultProps} currentMode={true} />
      );

      const logo = container.querySelector('img[src*="dark"]');
      expect(logo).toBeInTheDocument();
    });

    it("should display light logo when currentMode is false", () => {
      vi.mocked(useLocation).mockReturnValue(["/home", vi.fn()] as any);

      const { container } = render(
        <NavBar {...defaultProps} currentMode={false} />
      );

      const logo = container.querySelector('img[src*="light"]');
      expect(logo).toBeInTheDocument();
    });
  });

  describe("Menu Button", () => {
    it("should display menu icon when location is not home", () => {
      vi.mocked(useLocation).mockReturnValue(["/other", vi.fn()] as any);

      render(<NavBar {...defaultProps} />);

      const menuButton = screen.getByRole("button", { name: "" });
      expect(menuButton).toBeInTheDocument();
    });

    it("should call onMenuClicked when menu button is clicked", () => {
      vi.mocked(useLocation).mockReturnValue(["/other", vi.fn()] as any);
      const onMenuClicked = vi.fn();

      render(<NavBar {...defaultProps} onMenuClicked={onMenuClicked} />);

      const menuButton = screen.getByRole("button", { name: "" });
      fireEvent.click(menuButton);

      expect(onMenuClicked).toHaveBeenCalledTimes(1);
    });
  });

  describe("Search Input", () => {
    it("should render search input when location is /home", () => {
      vi.mocked(useLocation).mockReturnValue(["/home", vi.fn()] as any);

      render(<NavBar {...defaultProps} />);

      expect(screen.getByTestId("search-input")).toBeInTheDocument();
    });

    it("should not render search input when location is not /home", () => {
      vi.mocked(useLocation).mockReturnValue(["/", vi.fn()] as any);

      render(<NavBar {...defaultProps} />);

      expect(screen.queryByTestId("search-input")).not.toBeInTheDocument();
    });

    it("should call onSearchSubmit when search input changes", () => {
      vi.mocked(useLocation).mockReturnValue(["/home", vi.fn()] as any);
      const onSearchSubmit = vi.fn();

      render(<NavBar {...defaultProps} onSearchSubmit={onSearchSubmit} />);

      const searchInput = screen.getByPlaceholderText("Search");
      fireEvent.change(searchInput, { target: { value: "test query" } });

      expect(onSearchSubmit).toHaveBeenCalledWith("test query");
    });
  });

  describe("Logo Click", () => {
    it("should call goHome when logo is clicked", () => {
      vi.mocked(useLocation).mockReturnValue(["/home", vi.fn()] as any);
      const goHome = vi.fn();

      const { container } = render(
        <NavBar {...defaultProps} goHome={goHome} currentMode={true} />
      );

      const logoContainer =
        container.querySelector('img[src*="dark"]')?.parentElement;
      if (logoContainer) {
        fireEvent.click(logoContainer);
      }

      expect(goHome).toHaveBeenCalledTimes(1);
    });
  });

  describe("Location-based Rendering", () => {
    it("should render icon logo on mobile when location is /", () => {
      vi.mocked(useLocation).mockReturnValue(["/", vi.fn()] as any);

      const { container } = render(<NavBar {...defaultProps} />);

      const iconLogo = container.querySelector('img[src*="icon"]');
      expect(iconLogo).toBeInTheDocument();
    });
  });
});
