export const getChatDisplayName = (
  chat: any,
  currentUserId: string | null
) => {
  if (!chat.participants) return chat.name;

  const otherUser = chat.participants.find(
    (p: any) => p.id !== currentUserId
  );

  return otherUser?.username || "Unknown";
};

export const getChatOtherUser = (
  chat: any,
  currentUserId: string | null
) => {
  if (!chat.participants) return null;

  return chat.participants.find(
    (p: any) => p.id !== currentUserId
  );
};