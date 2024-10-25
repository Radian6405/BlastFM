CREATE TABLE
    users (
        id SERIAL NOT NULL PRIMARY KEY,
        username VARCHAR(16) UNIQUE NOT NULL,
        email VARCHAR(254) UNIQUE NOT NULL,
        password VARCHAR(60) NOT NULL,
        spotify_refresh_token VARCHAR(1024)
    );

CREATE TABLE
    playlists (
        id SERIAL NOT NULL PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        description VARCHAR(256),
        cover_image VARCHAR(256),
        owner_id INTEGER REFERENCES users (id) ON DELETE CASCADE NOT NULL,
        total_playtime INTEGER NOT NULL DEFAULT 0,
        track_count INTEGER NOT NULL DEFAULT 0,
        is_private BOOLEAN NOT NULL DEFAULT FALSE
    );

CREATE TABLE
    songs (
        id SERIAL NOT NULL PRIMARY KEY,
        spotify_id VARCHAR(24) UNIQUE,
        name VARCHAR(256) NOT NULL,
        playtime INTEGER NOT NULL
    );

CREATE TABLE
    artists (
        id SERIAL NOT NULL PRIMARY KEY,
        spotify_id VARCHAR(24) UNIQUE,
        name VARCHAR(256) NOT NULL
    );

CREATE TABLE
    albums (
        id SERIAL NOT NULL PRIMARY KEY,
        spotify_id VARCHAR(24) UNIQUE,
        name VARCHAR(256) NOT NULL,
        description VARCHAR(256),
        cover_image VARCHAR(256),
        total_playtime INTEGER NOT NULL DEFAULT 0,
        track_count INTEGER NOT NULL DEFAULT 0,
        artist_id INTEGER REFERENCES artists (id) ON DELETE CASCADE NOT NULL
    );

CREATE TABLE
    playlists_songs (
        playlist_id INTEGER REFERENCES playlists (id) ON DELETE CASCADE NOT NULL,
        song_id INTEGER REFERENCES songs (id) ON DELETE CASCADE NOT NULL,
        CONSTRAINT playlists_songs_pk PRIMARY KEY (playlist_id, song_id)
    );

CREATE TABLE
    albums_songs (
        album_id INTEGER REFERENCES albums (id) ON DELETE CASCADE NOT NULL,
        song_id INTEGER REFERENCES songs (id) ON DELETE CASCADE NOT NULL,
        CONSTRAINT albums_songs_pk PRIMARY KEY (album_id, song_id)
    );

CREATE TABLE
    artists_songs (
        artist_id INTEGER REFERENCES artists (id) ON DELETE CASCADE NOT NULL,
        song_id INTEGER REFERENCES songs (id) ON DELETE CASCADE NOT NULL,
        CONSTRAINT artists_songs_pk PRIMARY KEY (artist_id, song_id)
    );

CREATE TABLE
    liked_songs (
        user_id INTEGER REFERENCES users (id) ON DELETE CASCADE NOT NULL,
        song_id INTEGER REFERENCES songs (id) ON DELETE CASCADE NOT NULL,
        CONSTRAINT users_songs_pk PRIMARY KEY (user_id, song_id)
    );

CREATE TABLE
    starred_albums (
        user_id INTEGER REFERENCES users (id) ON DELETE CASCADE NOT NULL,
        album_id INTEGER REFERENCES albums (id) ON DELETE CASCADE NOT NULL,
        CONSTRAINT starred_albums_pk PRIMARY KEY (user_id, album_id)
    );