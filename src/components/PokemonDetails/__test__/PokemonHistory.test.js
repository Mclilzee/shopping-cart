import React from "react";
import { act, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import "@testing-library/jest-dom";
import PokemonHistory from "../PokemonHistory";
import { BrowserRouter } from "react-router-dom";

const pokemonHistory = {
  evolves_from_species: {
    name: "ivysaur",
    url: "ivysaur.com"
  },
  flavor_text_entries: [
    {
      flavor_text: "The plant blooms."
    }
  ],
  habitat: {
    name: "grassland"
  }
};

function MockHistory() {
  return (
    <BrowserRouter>
      <PokemonHistory/>
    </BrowserRouter>
  );
}

beforeEach(() => {
  jest.spyOn(global, "fetch").mockImplementation(() => {
    return Promise.resolve({
      json: () => Promise.resolve(pokemonHistory)
    });
  });
});

describe("Basic rendering", () => {
  test("Renders", async () => {
    await act(async() => {
      render(<MockHistory/>);
    });
  });

  test("Flavor text to be in document", async () => {
    await act(async() => {
      render(<MockHistory/>);
    });

    const flavorText = await screen.findByText("The plant blooms.");
    expect(flavorText).toBeInTheDocument();
  });

  test("Habitat text to be in document", async () => {
    await act(async() => {
      render(<MockHistory/>);
    });

    const habitatText = await screen.findByText(/grassland/i);
    expect(habitatText).toBeInTheDocument();
  });

  test("Evolution link to be in document", async () => {
    await act(async() => {
      render(<MockHistory/>);
    });

    const evolutionLink = await screen.findByRole("link", {name: /ivysaur/i});
    expect(evolutionLink).toBeInTheDocument();
  });

  test("Evolution link to have correct href", async () => {
    await act(async() => {
      render(<MockHistory/>);
    });

    const evolutionLink = await screen.findByRole("link", {name: /ivysaur/i});
    expect(evolutionLink).toHaveAttribute("href", "/pokemon/ivysaur");
  });

  test("There is no link if no evolution happened", async () => {
    const alteredHistory = {...pokemonHistory, evolves_from_species: null};
    jest.spyOn(global, "fetch").mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve(alteredHistory)
      });
    });

    await act(async() => {
      render(<MockHistory/>);
    });

    const linkElement = screen.queryByRole("link");
    expect(linkElement).not.toBeInTheDocument();
  });

  test("Show none if there was no evolution", async () => {
    const alteredHistory = {...pokemonHistory, evolves_from_species: null};
    jest.spyOn(global, "fetch").mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve(alteredHistory)
      });
    });

    await act(async() => {
      render(<MockHistory/>);
    });

    const linkElement = await screen.findByTestId("evolution-test");
    expect(linkElement.textContent).toMatch(/none/i);
  });
});

describe("Loading handling", () => {
  test("Loading message to show while fetching data", () => {
    act(() => {
      render(<MockHistory/>);
    });

    const loadingMessage = screen.getByText("Loading...");
    expect(loadingMessage).toBeInTheDocument();
    waitForElementToBeRemoved(() => screen.getByText("Loading..."));
  });

  test("Loading message to be removed after fetching data", () => {
    act(() => {
      render(<MockHistory/>);
    });

    waitForElementToBeRemoved(() => screen.getByText("Loading..."));
  });
});

describe("Error handling", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation(() => {
      return Promise.reject();
    });
  });

  test("Error message shown on promise reject", async () => {
    await act(async () => {
      render(<MockHistory/>);
    });

    const errorElement = await screen.findByTestId("error-message");
    expect(errorElement).toBeInTheDocument();
  });

  test("Flavor text not to be in document", async () => {
    await act(async () => {
      render(<MockHistory/>);
    });

    const flavorText = screen.queryByText("The plant blooms.");
    expect(flavorText).not.toBeInTheDocument();
  });

  test("Habitat text not to be in document", async () => {
    await act(async () => {
      render(<MockHistory/>);
    });

    const habitatText = screen.queryByText(/grassland/i);
    expect(habitatText).not.toBeInTheDocument();
  });

  test("Evolution link not to be in document", async () => {
    await act(async () => {
      render(<MockHistory/>);
    });

    const evolutionLink = screen.queryByRole("link", {name: /ivysaur/i});
    expect(evolutionLink).not.toBeInTheDocument();
  });
});
