import React from "react";
import Note from "./Note";
import Img from "./Img";
import Info from "./Info";

function Post(props: any) {
    const { content } = props;
    return (
        <div className="post my-16 border border-black">
            <Info />
            <div className="flex flex-nowrap justify-around items-center">
                <Img img={content.img} />
                {content && <Note note={content.note} username={content.user} />}
            </div>

        </div>
    );
}

export default Post;
