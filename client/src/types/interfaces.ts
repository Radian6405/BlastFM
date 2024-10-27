export interface song {
  id: number;
  name: string;
  playtime: number;
  artists: artist[];
  spotify_id?: string | null;
}

export interface artist {
  id: number;
  name: string;
  spotify_id?: string | null;
}

export interface album {
  id: number;
  name: string;
  description?: string | null;
  cover_image?: string | null;
  total_playtime: number;
  track_count: number;
  artist: artist;
}

export interface playlist {
  id: number;
  name: string;
  spotify_id?: string | null;
  description?: string | null;
  cover_image?: string | null;
  owner_id: number;
  total_playtime: number;
  track_count: number;
  is_private: boolean;
  owner_username?: string | null;
}
