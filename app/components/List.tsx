import React, { useEffect } from "react";
import Post from "./Post";

function List() {
    const todo=[
        "sugar",
        "tomato",
        "sausage"

    ]

    return (
        <div className="w-8/12 m-[auto]">
            {todo.map((item,index)=>{
              return (
                <div key={index}>
                    {item}
                </div>
              )  
            })}
        </div>
    );
}

export default List;
