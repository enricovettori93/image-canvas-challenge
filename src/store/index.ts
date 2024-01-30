import { configureStore } from "@reduxjs/toolkit";
import annotationReducer from "./features/annotations/annotationSlice.ts";
import uiReducer from "./features/ui/uiSlice.ts";

export const store = configureStore({
  reducer: {
      annotations: annotationReducer,
      ui: uiReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
