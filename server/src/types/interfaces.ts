export interface artist {
  id?: number;
  spotify_id?: string;
  name: string;
}

export interface song {
  id?: number;
  spotify_id?: string;
  name: string;
  cover_image?: string;
  playtime: number;
  artists: artist[];
}

export interface album {
  id?: number;
  spotify_id?: string;
  name: string;
  description?: string;
  track_count: number;
  cover_image?: string;
  artist: artist;
  total_playtime: number;
  songs?: song[];
}

export interface playlist {
  id?: number;
  spotify_id?: string;
  name: string;
  description?: string;
  track_count: number;
  is_private: boolean;
  total_playtime: number;
  cover_image?: string;
  owner_id?: number;
  songs?: song[];
}
