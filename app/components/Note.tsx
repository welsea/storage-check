import React from "react";
function Note(props: any) {
    const { note, username } = props;
    return (
        <div className="italic p-3 w-4/12">
            <div className="text-left">{note}</div>
        </div>
    );
}

export default Note;
