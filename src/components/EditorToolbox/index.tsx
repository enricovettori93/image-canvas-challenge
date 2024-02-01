import {ToolboxSelection} from "../../store/features/ui/types.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {changeToolboxMode, setDebug} from "../../store/features/ui/uiSlice.ts";
import {reset, selectAnnotation} from "../../store/features/annotations/annotationSlice.ts";

const EditorToolbox = () => {
    const dispatch = useDispatch();
    const toolboxSelectedMode = useSelector((state: RootState) => state.ui.toolboxMode);
    const debug = useSelector((state: RootState) => state.ui.debug);

    const handleChangeToolboxMode = (value: ToolboxSelection) => {
        dispatch(changeToolboxMode(value));
        dispatch(selectAnnotation(null));
    }

    const handleClearAnnotation = () => {
        dispatch(reset());
    }

    const handleDebugChange = () => {
        dispatch(setDebug(!debug));
    }

    return (
        <form action="#" className="flex flex-col">
            <div>
                <input id="debug" type="checkbox" checked={debug} onChange={handleDebugChange}/>
                <label htmlFor="debug">Debug</label>
            </div>
            {
                [ToolboxSelection.CIRCLE, ToolboxSelection.RECTANGLE, ToolboxSelection.SELECTION].map(item => (
                    <div className="flex flex-row gap-3" key={item}>
                        <input
                            onChange={e => handleChangeToolboxMode(e.target.value as ToolboxSelection)}
                            type="radio"
                            name="toolbox" id={item} value={item} checked={toolboxSelectedMode === item}
                        />
                        <label htmlFor={item}>{item}</label>
                    </div>
                ))
            }
            <button
                className="bg-red-400 rounded-2xl mt-5 p-2 hover:bg-red-500 transition shadow-2xl"
                type="button"
                onClick={handleClearAnnotation}>Remove annotations
            </button>
        </form>
    );
};

export default EditorToolbox;
