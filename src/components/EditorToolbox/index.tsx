import React from "react";
import {ToolboxSelection} from "../../store/features/ui/types.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {changeToolboxMode} from "../../store/features/ui/uiSlice.ts";
import {selectAnnotation} from "../../store/features/annotations/annotationSlice.ts";

const EditorToolbox = () => {
    const dispatch = useDispatch();
    const toolboxSelectedMode = useSelector((state: RootState) => state.ui.toolboxMode);

    const handleChangeToolboxMode = (value: ToolboxSelection) => {
        dispatch(changeToolboxMode(value));
        dispatch(selectAnnotation(null));
    }
    return (
        <form action="#" className="flex flex-col">
            {
                ["NONE", "CIRCLE", "RECTANGLE", "SELECTION"].map(item => (
                    <React.Fragment key={item}>
                        <input onChange={e => handleChangeToolboxMode(e.target.value as ToolboxSelection)} type="radio"
                               name="toolbox" id={item} value={item} checked={toolboxSelectedMode === item}/>
                        <label htmlFor={item}>{item}</label>
                    </React.Fragment>
                ))
            }
        </form>
    );
};

export default EditorToolbox;
