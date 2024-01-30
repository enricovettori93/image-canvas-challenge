import {ImageMetadata, ToolboxSelection, UiSlice} from "./types.ts";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadFileIntoCanvas} from "../../../shared/helpers";

const initialState: UiSlice = {
    hasLoadedImage: false,
    error: null,
    imageMetadata: null,
    toolboxMode: ToolboxSelection.CIRCLE
}

export const loadImageFromURL = createAsyncThunk(
    'ui/loadImageFromUrl',
    async (file: File, { rejectWithValue }) => {
        try {
            return await loadFileIntoCanvas(file);
        } catch (e) {
            rejectWithValue(e);
        }
    }
)

export const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        changeToolboxMode: (state, { payload }: PayloadAction<ToolboxSelection>) => {
            state.toolboxMode = payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(loadImageFromURL.fulfilled, (state, { payload }) => {
            state.hasLoadedImage = true;
            state.imageMetadata = payload as ImageMetadata;
            state.error = null;
        })
        builder.addCase(loadImageFromURL.rejected, (state, { payload }) => {
            state.error = payload as string;
        })
    }
})

export const { changeToolboxMode } = uiSlice.actions;
export default uiSlice.reducer;
