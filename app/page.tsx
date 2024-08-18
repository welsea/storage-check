import Image from 'next/image';
import eg1 from '../public/eg1.jpg'
import '@/app/ui/global.css'
export default function Page() {
    return (
        <main className="">
            <main>
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
                        <input type="password" autoFocus className="pwInput" />
                    </div>
            </main>
        </main>
    );
}
