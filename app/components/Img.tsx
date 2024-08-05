import React from "react";
import Image from "next/image";
import eg2 from "../../public/eg2.jpg";

function Img(props: any) {
    const { img } = props;
    return (
        <div className="m-2 w-8/12">
            <Image
                src={eg2}
                alt="logo"
                objectFit="cover" // Cover the container, maintaining aspect ratio
                objectPosition="center" // Center the image vertically and horizontally
                style={{
                    objectFit: "cover", // cover, contain, none
                }}
            />
        </div>
    );
}

export default Img;
