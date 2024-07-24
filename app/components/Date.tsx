import React from "react";

function Date(props: any) {
    const { date } = props;
    return <div className="w-2/12 my-7">{date}</div>;
}

export default Date;
