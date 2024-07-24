import React, { useEffect } from "react";
import Post from "./Post";

function List() {
    const post = {
        note: "You can also use variant modifiers to target media queries like responsive breakpoints, dark mode, prefers-reduced-motion, and more. For example, use md:not-italic to apply the not-italic utility at only medium screen sizes and above.",
        user: "font style",
        date: "2024-1-2",
        img: "/eg2.jpg",
        id: "0009",
    };
    const arrPost = Array(10).fill(post);

    return (
        <div className="w-5/6 m-[auto]">
            {arrPost.map((item,index) => {
                return <Post key={index} content={item} />;
            })}
        </div>
    );
}

export default List;
