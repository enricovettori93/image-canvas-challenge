export enum ToolboxSelection {
    "CIRCLE" = "CIRCLE",
    "RECTANGLE" = "RECTANGLE",
    "SELECTION" = "SELECTION",
    "NONE" = "NONE"
}

export interface ImageMetadata {
    src: string
    height: number
    width: number
}

export interface UiSlice {
    hasLoadedImage: boolean
    error: null | string
    imageMetadata: ImageMetadata | null
    toolboxMode: ToolboxSelection
}
