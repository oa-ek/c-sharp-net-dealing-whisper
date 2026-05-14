import { useEffect, useState } from "react";
import agent from "../../../api/agent";
import { Button } from "../../../components/ui/button";
import type { EmojiDto } from "../../../types/emoji";
import { ScrollArea } from "radix-ui";
import { Input } from "../../../components/ui/input";
import { Ghost } from "lucide-react";


export const EmojiModal = ({isOpen, onSelect}: {isOpen: boolean, onSelect: (emoji: string) => void}) => {
    const [emojis, setEmojis] = useState<Record<string, EmojiDto[]>>({});
    const [searchQuery, setSearchQuery] = useState<string>("");

    const fetchAllEmojis = async () => updateEmojis(await agent.Emojis.getAll());
    const fetchEmojisBySearch = async () => updateEmojis(await agent.Emojis.getBySearch(searchQuery));

    const updateEmojis = (emojisArr: EmojiDto[]) => {
        let groupedEmojis: Record<string, EmojiDto[]> = {};
        emojisArr.forEach((emoji) => {
            const groupName: string = emoji.group;
            if (!groupedEmojis[groupName])
                groupedEmojis[groupName] = [];
            groupedEmojis[groupName].push(emoji);
        })
        setEmojis(groupedEmojis)
    } 
    
    const updateEmojiDisplay = () => {
        if(searchQuery.trim().length === 0)
            fetchAllEmojis();
        else
            fetchEmojisBySearch();
    }

    useEffect(() => {
        updateEmojiDisplay();
    }, [])
    
    if (!isOpen) return null;

    return (
        <div className="flex w-[524px] flex-wrap bg-white/85 border-2 border-[#338B97]/80 rounded-xl p-1">
            { 
                Object.keys(emojis).length == 0 ? 
                <div className="w-full mx-2 my-3">
                    <h3 className="text-left text-xl font-bold text-black mb-1">Service offline</h3>
                    <p className=" text-left text-xs text-gray-400">Дані від emoji-api недоступні. Перевірте з'єднання або спробуйте пізніше.</p>
                </div>
                :
                <div className="w-full">
                    <div className="mb-1 flex">
                        <Input 
                            value={searchQuery} 
                            onChange={(e) => {setSearchQuery(e.target.value)}} 
                            onKeyDown={(e) => {
                                if (e.key == "Enter")
                                updateEmojiDisplay();
                            }
                            } 
                            placeholder="Search..." 
                            className="border-[#338B97] m-[2px] mr-1"
                            />
                            <Button variant="ghost" className="w-8 text-black" onClick={() => {onSelect("")}}>✕</Button>
                    </div>
                    <ScrollArea.Root>
                        <ScrollArea.Viewport className="h-80 w-[100%]" >
                            <div className="flex flex-wrap w-full">
                                {
                                Object.entries(emojis).map(([groupName, emojiList]) => {
                                    return (
                                        <div key={groupName} className="mb-2 h-auto w-full">
                                            <h3 className="text-left text-lg">{groupName.charAt(0).toUpperCase() + groupName.slice(1).replace("-", " ")}</h3>
                                            <hr className="border-1 border-[#338B97]"/>
                                            <div className="flex flex-wrap">
                                            {emojiList.map((emoj) => {
                                                return (
                                                <Button type="button" onClick={() => onSelect(emoj.character)} className='max-w-[32px] min-h-[20px] max-h-[32px] min-h-[20px] justify-center items-center bg-transparent'>
                                                    <p className="text-lg">{emoj.character}</p>
                                                </Button>
                                            );
                                            })
                                            }
                                            </div>
                                        </div>
                                    );
                                    })
                                }
                            </div>
                        </ScrollArea.Viewport>
                        <ScrollArea.Scrollbar
                            className="ScrollAreaScrollbar"
                            orientation="vertical">
                            <ScrollArea.Thumb />
                        </ScrollArea.Scrollbar>
                    </ScrollArea.Root>
                </div>
            }
        </div>
    );
}