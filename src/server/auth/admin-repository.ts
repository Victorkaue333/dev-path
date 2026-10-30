import "server-only";

import { getPrismaClient } from "@/server/db/client";

import type { AdminRecord } from "./authenticate";

/** Acesso a administradores. Só é chamado quando o banco está configurado. */
export async function findAdminByEmail(email: string): Promise<AdminRecord | null> {
  const admin = await getPrismaClient().adminUser.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, role: true, passwordHash: true, isActive: true },
  });
  return admin;
}

export async function touchLastLogin(adminId: string): Promise<void> {
  await getPrismaClient().adminUser.update({
    where: { id: adminId },
    data: { lastLoginAt: new Date() },
  });
}
