"use client";
import { createContext, useState } from "react";
import { Main } from "../app/pages/main";
import Image from "next/image";
import eg2 from "../public/eg2.jpg"
export const MainContext = createContext<any>(null)

export default function Home() {
    const [username, setUsername] = useState("njaal")
    const [show, setShow] = useState<boolean>(false)
    const [pw, setPW] = useState<string>("")
    const [showError, setShowError] = useState<boolean>(false)
    const msg = "WRONG WRONG WRONG"
    function checkPW(e: any) {
        let input = e.target.value
        if (input === "naess") {
            setShow(true)
            setShowError(false)
        } else {
            setShowError(true)
            setShow(false)
        }
    }
    return (
        <MainContext.Provider value={{ user: username }}>
            <main>
                {
                    show ?
                        <Main />
                        :
                        <div>
                            <div className="bgWrap">
                                <Image
                                    alt="cabin"
                                    src={eg2}
                                    quality={100}
                                    fill
                                    sizes="100vw"
                                    style={
                                        {
                                            objectFit: "cover"
                                        }
                                    }
                                />
                            </div>
                            <div className="bgInput">
                                <input type="password" autoFocus className="pwInput" onKeyDown={(e) => (e.key === "Enter") ? checkPW(e) : ""} />
                            </div>
                        </div>
                }
            </main>
        </MainContext.Provider>

    );
}
