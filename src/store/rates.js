const initialState = {
  amount: "19.99",
  currencyCode: "CAD",
};

export function ratesReducer(state = initialState, action) {
  switch (action.type) {
    case "rates/amountChanged":
      return { ...state, amount: action.payload };
    case "rates/currencyCodeChanged":
      return { ...state, currencyCode: action.payload };
    default:
      return state;
  }
}
