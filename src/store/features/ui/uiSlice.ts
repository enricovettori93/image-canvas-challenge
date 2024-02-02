import {ImageMetadata, ToolboxSelection, UiSlice} from "./types.ts";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadFileIntoCanvas} from "../../../shared/helpers";

const initialState: UiSlice = {
    image: {
        loading: false,
        error: null,
        metadata: {
            width: 0,
            height: 0,
            src: ""
        },
    },
    debug: false,
    toolboxMode: ToolboxSelection.RECTANGLE
}

export const loadImageFromURL = createAsyncThunk(
    'ui/loadImageFromUrl',
    async (file: File, {rejectWithValue}) => {
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
        changeToolboxMode: (state, {payload}: PayloadAction<ToolboxSelection>) => {
            state.toolboxMode = payload;
        },
        setDebug: (state, {payload}: PayloadAction<boolean>) => {
            state.debug = payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(loadImageFromURL.pending, (state) => {
            state.image.loading = true;
            state.image.error = null;
        })
        builder.addCase(loadImageFromURL.rejected, (state, {payload}) => {
            state.image.loading = false;
            state.image.error = payload as string;
        })
        builder.addCase(loadImageFromURL.fulfilled, (state, {payload}) => {
            state.image.loading = false;
            state.image.metadata = payload as ImageMetadata;
            state.image.error = null;
        })
    }
})

export const {changeToolboxMode, setDebug} = uiSlice.actions;
export default uiSlice.reducer;
