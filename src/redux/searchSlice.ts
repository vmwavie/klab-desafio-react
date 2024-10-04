import { SearchData } from '@/types/historic';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface SearchState {
  searchData: SearchData | null;
}

const initialState: SearchState = {
  searchData: null,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchData: (state, action: PayloadAction<SearchData>) => {
      state.searchData = action.payload;
    },
    clearSearchData: (state) => {
      state.searchData = null;
    },
  },
});

export const { setSearchData, clearSearchData } = searchSlice.actions;

export default searchSlice.reducer;
