import { Button } from "../../../components/ui/button";


export const EmojiModal = ({isOpen, onSelect}: {isOpen: boolean, onSelect: (emoji: string) => void}) => {
    const emojis = ['👀', '👍','👎','🎉','❤️','🔥','😁','🧱','✅','❌','✍️','🎶'];
    
    if (!isOpen) return null;

    return (
        <div className="flex w-[268px] flex-wrap bg-white border-2 border-[#338B97]/50 rounded-xl p-1">
            {emojis.map((emoji) => {
                return (
                    <Button onClick={() => onSelect(emoji)} className='max-w-[32px] min-h-[20px] max-h-[32px] min-h-[20px] justify-center items-center bg-transparent'>
                        <p className="text-lg">{emoji}</p>
                    </Button>
                );
            })}
        </div>
    );
}