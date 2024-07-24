import React from "react";
import Note from "./Note";
import Img from "./Img";
import Date from "./Date";

function Post(props: any) {
    const { content } = props;
    return (
        <div className="flex w-fit my-16">
            <Date date={content.date} />
            <Img img={content.img} />
            {content && <Note note={content.note} username={content.user} />}
        </div>
    );
}

export default Post;
