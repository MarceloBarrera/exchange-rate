const initialState = {
  fullName: "Marcelo Barrera",
  loggedIn: false,
};

export function userReducer(state = initialState, action) {
  return state;
}

// selectors: "Public API to access data in your store"
export const getName = (state) => state.user.fullName.split(" ")[0];
