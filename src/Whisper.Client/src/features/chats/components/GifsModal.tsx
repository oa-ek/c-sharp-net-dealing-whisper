import { useEffect, useState } from "react"
import type { GifDto, GifResponseDto } from "../../../types/gif"
import agent from "../../../api/agent";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "radix-ui";


export const GifsModal = ({isOpen, onSelect}: {isOpen: boolean, onSelect: (gifLink: string) => void}) => {
    const [gifs, setGifs] = useState<GifDto[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const fetchGifsTrending = async () => { updateGifs(await agent.Gifs.getTrending()); }
    const fetchGifsBySearch = async () => { updateGifs(await agent.Gifs.getBySearch(searchQuery)); }

    const updateGifs = (data: GifResponseDto) => {
        // may change quality my changing code. From lower: xs, sm, md, hd
        const quality = "md"
        if (data.result)
            setGifs(data.data.data.map((data => data.file[quality].gif)));  
    }

    const updateGifsDisplay = () => {
        if (searchQuery.trim().length === 0)
            fetchGifsTrending();
        else
            fetchGifsBySearch();
    }

    useEffect(() => {
        updateGifsDisplay();
    }, [])

    if (!isOpen) return null;

    return (
        <div className="flex w-[524px] flex-wrap bg-white/85 border-2 border-[#338B97]/80 rounded-xl p-1">
            {
            gifs.length === 0 ? 
            <div className="w-full mx-2 my-3">
                <h3 className="text-left text-xl font-bold text-black mb-1">Service offline</h3>
                <p className=" text-left text-xs text-gray-400">Дані від api.klipy.com  недоступні. Перевірте з'єднання або спробуйте пізніше.</p>
            </div>
            :
            <div className="w-full">
                <div className="mb-1 flex">
                    <Input 
                        value={searchQuery} 
                        onChange={(e) => {setSearchQuery(e.target.value)}} 
                        onKeyDown={(e) => {
                            if (e.key == "Enter")
                            updateGifsDisplay();
                        }
                        } 
                        placeholder="Search..." 
                        className="border-[#338B97] m-[2px] mr-1"
                        />
                        <Button variant="ghost" className="w-8 text-black" onClick={() => {onSelect("")}}>✕</Button>
                </div>
                <ScrollArea.Root>
                    <ScrollArea.Viewport className="h-80 w-[100%]" >
                        <div className="flex w-full justify-between">
                            <div className="w-[49%]">
                                {
                                    gifs.filter((gif, i) => { i % 2 === 0; }).map((gif) => {
                                        return (
                                            <img src={gif.url} className="w-full cursor-pointer mb-1 border-2 border-[#338B97]/80 rounded" onClick={() => onSelect(gif.url)}/>
                                        );
                                    })
                                }
                            </div>
                            <div className="w-[49%]">
                                {
                                    gifs.filter((gif, i) => { i % 2 === 1; }).map((gif) => {
                                        return (
                                            <img src={gif.url} className="w-full cursor-pointer mb-1 border-2 border-[#338B97]/80 rounded" onClick={() => onSelect(gif.url)}/>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </ScrollArea.Viewport>
                </ScrollArea.Root>
            </div>
            }
        </div>
    );
}