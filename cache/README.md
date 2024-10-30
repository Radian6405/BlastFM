# Structure

primarily consists of 2 hashes

- For user data
```
KEY: USERS
FIELD: (user_id)
VALUE: 
    {
        id: number;
        username: string;
        email: string;
        is_spotify_connected: boolean;
     }
```

- for user's liked songs
```
KEY: LIKED_SONGS
FIELD: (user_id)
VALUE:{
  id?: number;
  spotify_id?: string;
  name: string;
  cover_image?: string;
  playtime: number;
  artists: {
    id?: number;
    spotify_id?: string;
    name: string;
    }[];
}[]
```

- for playlist's songs
```
KEY : PLAYLIST_SONGS
FIELD: (playlist_id)
VALUE: <same as before>
```

- for album's songs
```
KEY : ALBUM_SONGS
FIELD: (album_id)
VALUE: <same as before>
```