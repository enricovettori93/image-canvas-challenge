import './App.css'
import Canvas from "./components/Canvas";
import EditorToolbox from "./components/EditorToolbox";
import {useDispatch} from "react-redux";
import {loadImageFromURL} from "./store/features/ui/uiSlice.ts";

function App() {
    const dispatch = useDispatch();

    const handleLoadImage = async (e: any) => {
        const file: File = e.target.files[0];
        // todo: fix eslint
        // eslint-disable-next-line
        // @ts-ignore
        await dispatch(loadImageFromURL(file));
    }

    return (
        <>
            <div>
                <label htmlFor="img-loader">Load an image</label>
                <input id="img-loader" type="file" accept="image/png, image/jpeg" onClick={(event: any) => {
                    event.target.value = null
                }} onChange={handleLoadImage}/>
            </div>
            <div className="flex flex-row gap-3 mt-5">
                <div className="overflow-auto w-[80%]">
                    <Canvas />
                </div>
                <div className="w-[20%]">
                    <EditorToolbox />
                </div>
            </div>
        </>
    )
}

export default App
