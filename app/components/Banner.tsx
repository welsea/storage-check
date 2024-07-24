import React from "react";
import Image from "next/image";
import eg1 from "../../public/eg1.jpg";

function Banner() {
    return (
        <div style={{ width: "100%", height: "350px", overflow: "hidden" }}>
            <Image
                src={eg1}
                alt={"banner"}
                objectFit="cover" // Cover the container, maintaining aspect ratio
                objectPosition="center" // Center the image vertically and horizontally
                style={{
                    objectFit: "cover", // cover, contain, none
                }}
            />
        </div>
    );
}

export default Banner;
