export enum ToolboxSelection {
    "CIRCLE" = "CIRCLE",
    "RECTANGLE" = "RECTANGLE",
    "SELECTION" = "SELECTION"
}

export interface ImageMetadata {
    src: string
    height: number
    width: number
}

export interface UiSlice {
    image: {
        loading: boolean
        error: null | string
        metadata: ImageMetadata | null
    }
    debug: boolean
    toolboxMode: ToolboxSelection
}
