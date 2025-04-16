import { configureStore } from "@reduxjs/toolkit";
import tagsSlice from "./reducers/tagsSlice";
import homePageSeriesSlice from "./reducers/homePageSeriesSlice";

export const store = configureStore({
  reducer: {
    tagsReducer: tagsSlice,
    homePageSeries: homePageSeriesSlice,
  },
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
