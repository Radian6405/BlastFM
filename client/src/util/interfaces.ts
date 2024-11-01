export interface user {
  id: Number;
  username: string;
  email: string;
  is_spotify_connected: boolean;
}

export interface artist {
  id?: number;
  spotify_id?: string | null;
  name: string;
}

export interface song {
  id?: number;
  spotify_id?: string | null;
  name: string;
  cover_image?: string;
  playtime: number;
  artists: artist[];
  is_liked: boolean;
}

export interface album {
  id?: number;
  spotify_id?: string | null;
  name: string;
  description?: string | null;
  track_count: number;
  cover_image?: string | null;
  artist: artist;
  total_playtime?: number;
  is_starred: boolean;
}

export interface playlist {
  id: number;
  spotify_id?: string | null;
  name: string;
  description?: string | null;
  track_count: number;
  is_private: boolean;
  total_playtime: number;
  cover_image?: string | null;
  owner_id: number;
  owner_username?: string | null;
}

export interface playlistCard {
  name: string;
  id: number;
}
