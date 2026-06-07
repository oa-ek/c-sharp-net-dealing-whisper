import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import agent from "../../../api/agent";

const avatarCache = new Map<string, string>();

export const RemoteAvatar = ({ link, initial, className }: { link?: string, initial: string, className?: string }) => {
    const [blobUrl, setBlobUrl] = useState<string>("");

    useEffect(() => {
        if (!link) {
            setBlobUrl("");
            return;
        }

        const fileId = link.split("/").pop();
        if (!fileId) return;

        if (avatarCache.has(fileId)) {
            setBlobUrl(avatarCache.get(fileId)!);
            return;
        }

        let isSubscribed = true;
        let objectUrl = "";

        const fetchImage = async () => {
            try {
                const blob = await agent.Media.download(fileId);
                if (isSubscribed) {
                    objectUrl = URL.createObjectURL(blob);
                    avatarCache.set(fileId, objectUrl);
                    setBlobUrl(objectUrl);
                }
            } catch (err) {
                console.error("Avatar download error:", err);
            }
        };

        fetchImage();

        return () => {
            isSubscribed = false;
        };
    }, [link]); 

    return (
        <Avatar className={className}>
            {blobUrl && (
                <div className="absolute inset-0 z-10 bg-white rounded-full">
                    <img 
                        src={blobUrl} 
                        className="w-full h-full object-cover rounded-full" 
                    />
                </div>
            )}
            <AvatarFallback className="z-0 bg-gray-100 flex items-center justify-center w-full h-full text-[10px] text-gray-500 font-bold uppercase">
                {initial}
            </AvatarFallback>
        </Avatar>
    );
};