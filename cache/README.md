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