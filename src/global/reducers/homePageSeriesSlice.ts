import { Match } from "@/@types";
import { createSlice } from "@reduxjs/toolkit";

interface HomePageSeriesState {
  currentSeries: string;
  matches: Match[];
}

const initialState: HomePageSeriesState = {
  currentSeries: "",
  matches: [],
};

const homePageSeriesSlice = createSlice({
  initialState,
  name: "homePageSeries",
  reducers: {
    setHomePageSeries: (state, { payload }: { payload: HomePageSeriesState }) => {
      return payload;
    },
  },
});

export const { setHomePageSeries } = homePageSeriesSlice.actions;

export default homePageSeriesSlice.reducer;
