/**
 * @jest-environment jsdom
 */
import React, { useReducer } from "react";
import ControlPage from "../../components/ControlPage";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom";
import NegativeControlContext from "../../context/NegativeControlContext";
import NegativeControlReducer from "../../reducers/NegativeControlReducer";

const [negativeControl, dispatch] = useReducer(NegativeControlReducer, []);

test("should render help page correctly", () => {
  render(
    <MemoryRouter>
      <NegativeControlContext.Provider value={{ negativeControl, dispatch }}>
        <ControlPage />
      </NegativeControlContext.Provider>
    </MemoryRouter>
  );
  expect(screen.getByTestId(`Control-page`)).toMatchSnapshot();
});
