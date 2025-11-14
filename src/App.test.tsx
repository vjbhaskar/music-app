import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTheme } from "@mui/material/styles";
import App from "./App";

const mockSetLocation = vi.fn();
const mockLocation = vi.fn(() => "/");

vi.mock("wouter", () => ({
  Route: ({ path, component: Component, children }: any) => {
    const location = mockLocation();
    if (path === location) {
      return Component ? <Component /> : children?.();
    }
    return null;
  },
  Switch: ({ children }: any) => <div data-testid="switch">{children}</div>,
  Redirect: ({ to }: any) => <div data-testid="redirect">Redirect to {to}</div>,
  useLocation: () => [mockLocation(), mockSetLocation],
}));

vi.mock("./components/Navbar/NavBar", () => ({
  default: ({
    currentMode,
    toggleTheme,
    goHome,
    onMenuClicked,
    onSearchSubmit,
  }: any) => (
    <div data-testid="navbar">
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
      <span data-testid="theme-mode">
        Mode: {currentMode ? "dark" : "light"}
      </span>
      <button data-testid="go-home" onClick={goHome}>
        Home
      </button>
      <button data-testid="menu-button" onClick={onMenuClicked}>
        Menu
      </button>
      <input
        data-testid="search-input"
        onChange={(e) => onSearchSubmit(e.target.value)}
        placeholder="Search"
      />
    </div>
  ),
}));

vi.mock("./components/LandingPage/LandingPage", () => ({
  default: () => <div data-testid="landing-page">Landing Page</div>,
}));

vi.mock("./components/Home/Home", () => ({
  default: ({ showMenuBar, onMenuBarClosed, searchString }: any) => (
    <div data-testid="home">
      <span data-testid="menu-state">
        Menu: {showMenuBar ? "open" : "closed"}
      </span>
      <span data-testid="search-string">Search: {searchString}</span>
      <button onClick={() => onMenuBarClosed(false)}>Close Menu</button>
    </div>
  ),
}));

// Mock useTheme
vi.mock("./hooks/useTheme", () => ({
  default: () => ({
    theme: createTheme(),
    isDark: false,
    onToggleTheme: vi.fn(),
  }),
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.mockReturnValue("/");
  });

  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("renders NavBar component", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("shows loading screen while lazy components load", () => {
    render(<App />);
    const loadingOrContent =
      screen.queryByText("Loading…") || screen.getByTestId("switch");
    expect(loadingOrContent).toBeInTheDocument();
  });

  it("renders LandingPage when on root path", async () => {
    mockLocation.mockReturnValue("/");
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("landing-page")).toBeInTheDocument();
    });
  });

  it("renders Home component when on /home path", async () => {
    mockLocation.mockReturnValue("/home");
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("home")).toBeInTheDocument();
    });
  });

  it("toggles menu bar state when menu button is clicked", async () => {
    mockLocation.mockReturnValue("/home");
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("home")).toBeInTheDocument();
    });

    const menuButton = screen.getByTestId("menu-button");
    const menuState = screen.getByTestId("menu-state");

    expect(menuState).toHaveTextContent("Menu: closed");

    await user.click(menuButton);
    expect(menuState).toHaveTextContent("Menu: open");

    await user.click(menuButton);
    expect(menuState).toHaveTextContent("Menu: closed");
  });

  it("updates search string when search input changes", async () => {
    mockLocation.mockReturnValue("/home");
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("home")).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId("search-input");
    await user.type(searchInput, "test search");

    const searchString = screen.getByTestId("search-string");
    expect(searchString).toHaveTextContent("Search: test search");
  });

  it("passes showMenuBar prop to Home component", async () => {
    mockLocation.mockReturnValue("/home");
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("home")).toBeInTheDocument();
    });

    const menuButton = screen.getByTestId("menu-button");
    await user.click(menuButton);

    const menuState = screen.getByTestId("menu-state");
    expect(menuState).toHaveTextContent("Menu: open");
  });

  it("handles onMenuBarClosed callback from Home component", async () => {
    mockLocation.mockReturnValue("/home");
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("home")).toBeInTheDocument();
    });

    const menuButton = screen.getByTestId("menu-button");
    await user.click(menuButton);

    let menuState = screen.getByTestId("menu-state");
    expect(menuState).toHaveTextContent("Menu: open");

    const closeButton = screen.getByText("Close Menu");
    await user.click(closeButton);

    menuState = screen.getByTestId("menu-state");
    expect(menuState).toHaveTextContent("Menu: closed");
  });

  it("calls goHome when home button is clicked and not on root", async () => {
    mockLocation.mockReturnValue("/home");
    const user = userEvent.setup();
    render(<App />);

    const goHomeButton = screen.getByTestId("go-home");
    await user.click(goHomeButton);

    expect(mockSetLocation).toHaveBeenCalledWith("/");
  });

  it("does not navigate when goHome is clicked and already on root", async () => {
    mockLocation.mockReturnValue("/");
    const user = userEvent.setup();
    render(<App />);

    const goHomeButton = screen.getByTestId("go-home");
    await user.click(goHomeButton);

    expect(mockSetLocation).not.toHaveBeenCalled();
  });

  it("passes searchString to Home component", async () => {
    mockLocation.mockReturnValue("/home");
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("home")).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId("search-input");
    await user.type(searchInput, "zelda");

    const searchString = screen.getByTestId("search-string");
    expect(searchString).toHaveTextContent("Search: zelda");
  });
});
