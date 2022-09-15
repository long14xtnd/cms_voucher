import ActionKeys from "./ActionKeys";

export const saveCustomerInfo = (value) => {
  return {
    type: ActionKeys.AUTH.CUSTOMERINFO,
    data: value, 
  };
};
