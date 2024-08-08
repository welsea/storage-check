"use client"
import Link from 'next/link';
import Image from 'next/image';
import eg1 from '../public/eg1.jpg'
import { useState } from 'react';
import Lists from './ui/Lists';
import '@/app/ui/global.css'
export default function Page() {
  const [show, setShow] = useState<boolean>(false)

  function checkPW(e: any) {
    let input = e.target.value
    if (input === "naess") {
        setShow(true)
    } else {
        setShow(false)
    }
}
  return (
    <main className="flex min-h-screen flex-col p-6">
            <main>
                {
                    show ?
                        <Lists />
                        :
                        <div>
                            <div className="bgWrap">
                                <Image
                                    alt="cabin"
                                    src={eg1}
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
    </main>
  );
}
