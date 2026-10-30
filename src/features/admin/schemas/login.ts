import { z } from "zod";

/** Validação do formulário de login (cliente e servidor usam o mesmo schema). */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe o e-mail.")
    .max(254, "E-mail muito longo.")
    .email("E-mail inválido.")
    .transform((v) => v.toLowerCase()),
  password: z
    .string()
    .min(8, "A senha precisa ter pelo menos 8 caracteres.")
    .max(128, "Senha muito longa."),
});

export type LoginInput = z.infer<typeof loginSchema>;

/** Estado devolvido pela Server Action para o formulário. */
export interface LoginFormState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof LoginInput, string>>;
}

export const initialLoginState: LoginFormState = { status: "idle" };
