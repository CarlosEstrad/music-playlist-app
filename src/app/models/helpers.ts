export interface Reply<T> {
  ok: boolean;
  message: string;
  data: T;
}

export interface LoginData {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface Register {
  Username: string;
  Email: string;
  Password: string;
}

export interface UserUpdateDto {
  Username: string;
  Password: string;
}
