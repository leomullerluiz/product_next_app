"use client";

import { CheckCircle2, LoaderCircle, LogIn, UserPlus } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/facades/auth";
import {
  getErrorMessage,
  getFieldErrors,
  isUnauthorized,
} from "@/services/api/errors";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/utils/cn";

type AuthTab = "login" | "register";

type FieldErrors = Record<string, string>;
type MessageVariant = "success" | "error" | "info";

type LoginForm = {
  login: string;
  senha: string;
};

type RegisterForm = LoginForm & {
  name: string;
};

type SessionSummary = {
  login: string;
  name: string | null;
  tokenType: string;
  expiresIn: number;
};

const initialLoginForm: LoginForm = {
  login: "",
  senha: "",
};

const initialRegisterForm: RegisterForm = {
  name: "",
  login: "",
  senha: "",
};

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [loginForm, setLoginForm] = useState<LoginForm>(initialLoginForm);
  const [registerForm, setRegisterForm] =
    useState<RegisterForm>(initialRegisterForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState<MessageVariant>("info");
  const [session, setSession] = useState<SessionSummary | null>(null);

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const isLogin = activeTab === "login";
  const isSubmitting = isLogin
    ? loginMutation.isPending
    : registerMutation.isPending;

  function selectTab(tab: AuthTab) {
    setActiveTab(tab);
    setFieldErrors({});
    setMessage("");
    setMessageVariant("info");
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setMessage("");
    setMessageVariant("info");
    setSession(null);

    try {
      const result = await loginMutation.mutateAsync(loginForm);
      setSession({
        login: result.user.login,
        name: result.user.name,
        tokenType: result.token_type,
        expiresIn: result.expires_in,
      });
      setLoginForm((current) => ({ ...current, senha: "" }));
      setMessage("Login realizado com sucesso.");
      setMessageVariant("success");
    } catch (error) {
      setFieldErrors(getFieldErrors(error));
      setMessage(
        isUnauthorized(error)
          ? "Login ou senha invalidos."
          : getAuthErrorMessage(error),
      );
      setMessageVariant("error");
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setMessage("");
    setMessageVariant("info");
    setSession(null);

    try {
      const result = await registerMutation.mutateAsync(registerForm);
      setLoginForm({
        login: result.user.login,
        senha: "",
      });
      setRegisterForm(initialRegisterForm);
      setActiveTab("login");
      setMessage("Cadastro criado. Entre com seu login e senha.");
      setMessageVariant("success");
    } catch (error) {
      setFieldErrors(getFieldErrors(error));
      setMessage(getAuthErrorMessage(error));
      setMessageVariant("error");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Product App
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-zinc-950">
            Acesse sua conta
          </h1>
        </div>

        <div
          role="tablist"
          aria-label="Autenticacao"
          className="mb-5 grid grid-cols-2 rounded-lg bg-zinc-100 p-1"
        >
          <TabButton
            active={isLogin}
            icon={<LogIn size={16} />}
            label="Login"
            onClick={() => selectTab("login")}
          />
          <TabButton
            active={!isLogin}
            icon={<UserPlus size={16} />}
            label="Cadastro"
            onClick={() => selectTab("register")}
          />
        </div>

        {isLogin ? (
          <form className="grid gap-4" onSubmit={handleLogin}>
            <Input
              label="Login"
              name="login"
              autoComplete="username"
              value={loginForm.login}
              error={fieldErrors.login}
              onChange={(event) =>
                setLoginForm((current) => ({
                  ...current,
                  login: event.target.value,
                }))
              }
              required
            />
            <Input
              label="Senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              value={loginForm.senha}
              error={fieldErrors.senha ?? fieldErrors.password}
              onChange={(event) =>
                setLoginForm((current) => ({
                  ...current,
                  senha: event.target.value,
                }))
              }
              required
            />
            <SubmitButton
              icon={<LogIn size={16} />}
              pending={isSubmitting}
              label="Entrar"
              pendingLabel="Entrando"
            />
          </form>
        ) : (
          <form className="grid gap-4" onSubmit={handleRegister}>
            <Input
              label="Nome"
              name="name"
              autoComplete="name"
              value={registerForm.name}
              error={fieldErrors.name}
              onChange={(event) =>
                setRegisterForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
            <Input
              label="Login"
              name="login"
              autoComplete="username"
              value={registerForm.login}
              error={fieldErrors.login}
              onChange={(event) =>
                setRegisterForm((current) => ({
                  ...current,
                  login: event.target.value,
                }))
              }
              required
            />
            <Input
              label="Senha"
              name="senha"
              type="password"
              autoComplete="new-password"
              value={registerForm.senha}
              error={fieldErrors.senha ?? fieldErrors.password}
              minLength={8}
              onChange={(event) =>
                setRegisterForm((current) => ({
                  ...current,
                  senha: event.target.value,
                }))
              }
              required
            />
            <SubmitButton
              icon={<UserPlus size={16} />}
              pending={isSubmitting}
              label="Criar conta"
              pendingLabel="Criando"
            />
          </form>
        )}

        {message ? (
          <p
            aria-live="polite"
            className={cn(
              "mt-4 rounded-lg border px-3 py-2 text-sm",
              messageVariant === "success" &&
              "border-emerald-200 bg-emerald-50 text-emerald-900",
              messageVariant === "error" &&
              "border-red-200 bg-red-50 text-red-900",
              messageVariant === "info" &&
              "border-zinc-200 bg-zinc-50 text-zinc-700",
            )}
          >
            {message}
          </p>
        ) : null}


      </section>
    </main>
  );
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md text-sm font-medium transition",
        active
          ? "bg-white text-zinc-950 shadow-sm"
          : "text-zinc-500 hover:text-zinc-950",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function SubmitButton({
  icon,
  pending,
  label,
  pendingLabel,
}: {
  icon: ReactNode;
  pending: boolean;
  label: string;
  pendingLabel: string;
}) {
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <LoaderCircle className="animate-spin" size={16} /> : icon}
      {pending ? pendingLabel : label}
    </Button>
  );
}

function getAuthErrorMessage(error: unknown) {
  return getErrorMessage(error, "Nao foi possivel concluir a solicitacao.");
}
