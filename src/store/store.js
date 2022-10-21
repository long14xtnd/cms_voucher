import { createStore } from "redux";
// applyMiddleware, compose,
import { persistStore } from "redux-persist";
import rootReducer from "./reducers";

const store = createStore(rootReducer);

const persistor = persistStore(store);
// console.log("Default:", store);

export { store, persistor };
