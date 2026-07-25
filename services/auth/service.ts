import { apiRequest } from "@/services/api/client";
import type {
  LoginInput,
  LoginResult,
  RegisterInput,
  RegisterResult,
} from "./types";

export function login(input: LoginInput) {
  return apiRequest<LoginResult>("/auth/login", {
    method: "POST",
    body: toAuthBody(input),
  });
}

export function register(input: RegisterInput) {
  return apiRequest<RegisterResult>("/auth/register", {
    method: "POST",
    body: {
      ...toAuthBody(input),
      name: input.name?.trim() || undefined,
    },
  });
}

function toAuthBody(input: LoginInput) {
  return {
    login: input.login.trim(),
    password: input.senha,
  };
}
