declare global {
  namespace Express {
    interface Request {
      user: {
        user_id: number;
        username: string;
        email: string;
      } | null;
    }
  }
}

export {};
