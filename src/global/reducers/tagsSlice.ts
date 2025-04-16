import { createSlice } from "@reduxjs/toolkit";

export interface TagMedia {
  id: number;
  url: string;
}

export interface TagMatch {
  id: string;
  tagName: string;
  message: string;
  media: { url: string }[];
  date: string;
}

// interface TagsInitialState {
//   currentTag: string;
//   matches: TagMatch[];
// }

const initialState = {
  currentTag: "",
  matches: [],
};

const tagsSlice = createSlice({
  name: "tagsSlice",
  initialState,
  reducers: {
    // @ts-ignore
    setCurrentTag: (_state, { payload }: { payload: payload }) => {
      return payload;
    },
  },
});

export const { setCurrentTag } = tagsSlice.actions;

export default tagsSlice.reducer;
