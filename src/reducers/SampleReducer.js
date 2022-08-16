import { cardActionAreaClasses } from "@mui/material";

const SampleReducer = (state, action) => {
  switch (action.type) {
    case "ADD_SAMPLE":
      const index = state.findIndex((sample) => sample.name === action.name);
      if (index === -1) {
        return [...state, { name: action.name, file: action.file }];
      } else {
        return state;
      }
    case "REMOVE_SAMPLE":
      return state.filter((sample) => sample.name !== action.name);
    case "EDIT_SAMPLE":
      console.log(action);
      return state.map((sample) => {
        if (sample.name == action.name) {
          return {
            ...sample,
            ...action.updates,
          };
        } else {
          return sample;
        }
      });
    default:
      return state;
  }
};

export { SampleReducer as default };
