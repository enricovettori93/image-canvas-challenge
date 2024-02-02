import {RootState} from "../../index.ts";

export const metadataSelector = (state: RootState) => state.ui.image.metadata;
