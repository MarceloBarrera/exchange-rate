import { getExchangeRates } from "../api";

export const supportedCurrencies = ["USD", "EUR", "JPY", "CAD", "GBP", "MXN"];

const initialState = {
  amount: "19.99",
  currencyCode: "CAD",
  currencyData: { USD: 1.0 },
};

export function ratesReducer(state = initialState, action) {
  switch (action.type) {
    case AMOUNT_CHANGED:
      return { ...state, amount: action.payload };
    case CURRENCY_CODE_CHANGED:
      return { ...state, currencyCode: action.payload };
    case "rates/ratesReceived":
      return { ...state, currencyData: action.payload };
    default:
      return state;
  }
}

// selectors: "Public API to access data in your store"
export const getAmount = (state) => state.rates.amount;
export const getCurrencyCode = (state) => state.rates.currencyCode;
export const getCurrencyData = (state) => state.rates.currencyData;
// action types

export const AMOUNT_CHANGED = "rates/amountChanged";
export const CURRENCY_CODE_CHANGED = "rates/currencyCodeChanged";

// action creators "are the API to modify the data in the store"
export const changeAmount = (amount) => ({
  type: AMOUNT_CHANGED,
  payload: amount,
});

// More about redux thunk here: https://github.com/reduxjs/redux-thunk
// A thunk in this context is a function that can be dispatched to perform async
// activity and can dispatch actions and read state.
// This is an action creator that returns a thunk:
export function changeCurrencyCode(currencyCode) {
  // We can invert control here by returning a function - the "thunk".
  // When this function is passed to `dispatch`, the thunk middleware will intercept it,
  // and call it with `dispatch` and `getState` as arguments.
  // This gives the thunk function the ability to run some logic, and still interact with the store.
  return function changeCurrencyCodeThunk(dispatch) {
    dispatch({
      type: CURRENCY_CODE_CHANGED,
      payload: currencyCode,
    });
    getExchangeRates(currencyCode, supportedCurrencies).then((rates) => {
      dispatch({
        type: "rates/ratesReceived",
        payload: rates,
      });
    });
  };
}
