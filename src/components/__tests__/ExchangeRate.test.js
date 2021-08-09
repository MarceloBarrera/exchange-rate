import { render, screen } from "@testing-library/react";
import { ExchangeRate } from "../ExchangeRate";
import { Provider } from "react-redux";
import { store } from "../../store/store";
test("renders title", () => {
  render(
    <Provider store={store}>
      <ExchangeRate />
    </Provider>
  );
  const linkElement = screen.getByText(/exchange rates/i);
  expect(linkElement).toBeInTheDocument();
});
