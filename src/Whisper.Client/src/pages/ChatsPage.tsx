import { useState } from "react";
import { ChatSidebar } from "../features/auth/chats/components/ChatSidebar";
import { ChatWindow } from "../features/auth/chats/components/ChatWindow";
import { UserInfoSidebar } from "../features/auth/chats/components/UserInfoSidebar";

const ChatsPage = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black selection:bg-emerald-500/30">
      <ChatSidebar />
      <ChatWindow 
        activeChatId="1" 
        onShowInfo={() => setShowInfo(!showInfo)} 
      />
      {showInfo && <UserInfoSidebar onClose={() => setShowInfo(false)} />}
    </div>
  );
};

export default ChatsPage;