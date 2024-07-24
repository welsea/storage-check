import React from "react";
function Note(props: any) {
    const { note, username } = props;
    return (
        <div className="italic p-3 w-5/12">
            <div className="text-left">{note}</div>
            <div className="text-right my-3">@{username}</div>
        </div>
    );
}

export default Note;
