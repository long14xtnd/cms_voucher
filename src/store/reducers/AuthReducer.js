import ActionKeys from "../actions/ActionKeys";

const userInfo = {
  detail: {
    token: "",
    username: "",
  },
};
export const authReducer = (state = userInfo, action) => {
  switch (action.type) {
    case ActionKeys.AUTH.CUSTOMERINFO:
      return {
        ...state,
        detail: action.data,
      };

    default:
      return state;
  }
};
