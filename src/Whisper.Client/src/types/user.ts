export interface UserDto {
  id: string;
  username: string;
  displayName: string | null;
  pfpLink: string | null;
  bio: string | null;
  lastSeen: Date;
  activeDeviceId: any[];
}

export interface UpdateUserDto {
  displayName: string,
  bio: string,
  pfpLink: string,
}