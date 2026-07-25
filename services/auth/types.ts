export type AuthUser = {
  id: number;
  login: string;
  name: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type LoginInput = {
  login: string;
  senha: string;
};

export type RegisterInput = LoginInput & {
  name?: string;
};

export type LoginResult = {
  token_type: string;
  access_token: string;
  expires_in: number;
  user: AuthUser;
};

export type RegisterResult = {
  user: AuthUser;
};
