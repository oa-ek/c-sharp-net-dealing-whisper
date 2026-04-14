export interface UserDto {
  userId: string;
  username: string;
  displayName: string;
  pfpLink: string;
  bio: string;
  lastSeen: Date;
}

export interface UpdateUserDto {
  displayName: string,
  bio: string,
  pfpLink: string,
}