"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginAction } from "../actions/login";
import { initialLoginState, type LoginInput, loginSchema } from "../schemas/login";

/**
 * Formulário de login: React Hook Form valida no cliente (mesmo schema Zod do servidor)
 * e a submissão vai para a Server Action, que decide. Sem JS, o formulário continua funcionando.
 */
export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialLoginState);
  const {
    register,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), mode: "onBlur" });

  const emailError = errors.email?.message ?? state.fieldErrors?.email;
  const passwordError = errors.password?.message ?? state.fieldErrors?.password;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.status === "error" && state.message ? (
        <Alert variant="destructive" role="alert">
          <AlertTitle>Não foi possível entrar</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "email-error" : undefined}
          {...register("email")}
        />
        {emailError ? (
          <p id="email-error" className="text-sm text-destructive">
            {emailError}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? "password-error" : undefined}
          {...register("password")}
        />
        {passwordError ? (
          <p id="password-error" className="text-sm text-destructive">
            {passwordError}
          </p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        <LogIn aria-hidden="true" />
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
