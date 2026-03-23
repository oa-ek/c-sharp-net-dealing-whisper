import { useState } from 'react';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatWindow } from '../components/ChatWindow';
// import { UserInfoPanel } from '../components/UserInfoPanel';
import { MainHeader } from '../../../../layout/MainHeader';

const ChatsPage = () => {
  const [isInfoOpen, setIsInfoOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-white font-[Geist]">
      {/* 1. Header */}
      <MainHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Left: History & Search */}
        <ChatSidebar />

        {/* 3. Center: Messages */}
        <ChatWindow onToggleInfo={() => setIsInfoOpen(!isInfoOpen)} />

        {/* 4. Right: User Info (Hidden by toggle) */}
        {/* {isInfoOpen && <UserInfoPanel />} */}
      </div>
    </div>
  );
};

export default ChatsPage;