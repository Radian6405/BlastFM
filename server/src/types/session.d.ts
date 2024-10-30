declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        username: string;
        email: string;
        is_spotify_connected: boolean;
      } | null;
    }
  }
}

export {};
