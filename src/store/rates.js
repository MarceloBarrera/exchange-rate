import { getExchangeRates } from "../api";

const initialState = {
  amount: "10.00",
  currencyCode: "CAD",
  currencyData: { USD: { displayLabel: "US Dollars", code: "USD", rate: 1.0 } },
  supportedCurrencies: ["USD", "EUR", "JPY", "CAD", "GBP", "MXN"],
};

export function ratesReducer(state = initialState, action) {
  switch (action.type) {
    case AMOUNT_CHANGED:
      return { ...state, amount: action.payload };
    case CURRENCY_CODE_CHANGED:
      return { ...state, currencyCode: action.payload };
    case "rates/ratesReceived": {
      const codes = Object.keys(action.payload);

      const currencyData = {};
      for (const code in action.payload) {
        currencyData[code] = { code, rate: action.payload[code] };
      }
      return {
        ...state,
        currencyData,
        supportedCurrencies: codes,
      };
    }
    case "rates/labelsReceived": {
      const { displayLabel, currencyCode } = action.payload;
      return {
        ...state,
        [currencyCode]: { ...state.currencyData[currencyCode], displayLabel },
        // currencyData: state.currencyData.map((data) => {
        //   if (currencyCode === data.code) {
        //     return { ...data, displayLabel };
        //   }
        //   return data;
        // }),
      };
    }
    default:
      return state;
  }
}

// selectors: "Public API to access data in your store"
export const getAmount = (state) => state.rates.amount;
export const getCurrencyCode = (state) => state.rates.currencyCode;
export const getCurrencyData = (state) => state.rates.currencyData;
export const getSupportedCurrencies = (state) =>
  state.rates.supportedCurrencies;

export const getDisplayLabel = (state, currencyCode) => {
  // const match = state.rates.currencyData.find(
  //   (data) => data.code === currencyCode
  // );
  const match = state.rates.currencyData[currencyCode];
  if (match) {
    return match.displayLabel;
  }
};
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
  return function changeCurrencyCodeThunk(dispatch, getState) {
    const state = getState();
    const supportedCurrencies = getSupportedCurrencies(state);
    dispatch({
      type: CURRENCY_CODE_CHANGED,
      payload: currencyCode,
    });
    getExchangeRates(currencyCode, supportedCurrencies).then((rates) => {
      console.log("rates", rates);
      dispatch({
        type: "rates/ratesReceived",
        payload: rates,
      });
    });
  };
}

// thunks
export function getInitialRates(dispatch, getState) {
  const state = getState();
  const currencyCode = getCurrencyCode(state);
  dispatch(changeCurrencyCode(currencyCode));
}
