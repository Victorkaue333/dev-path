import { Database, FileText, Shield } from "lucide-react";

import { StatusBadge } from "@/components/feedback/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isAuthConfigured, isDatabaseConfigured } from "@/config/env";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { PlannedSection } from "@/features/admin/components/planned-section";
import { getContentSource } from "@/server/services/content-service";

/**
 * Visão geral do painel. Mostra apenas estado de configuração real; métricas chegam
 * quando a agregação de analytics existir (nunca números inventados).
 */
export default function AdminDashboardPage() {
  const source = getContentSource();

  return (
    <>
      <AdminPageHeader
        title="Visão geral"
        description="Estado do ambiente e das áreas do painel."
        status="implementado"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4" aria-hidden="true" />
              Fonte de conteúdo
            </CardTitle>
            <CardDescription>De onde o site público lê o conteúdo.</CardDescription>
          </CardHeader>
          <CardContent className="font-mono text-sm">
            {source === "demo" ? "demo (arquivos locais)" : "database (PostgreSQL)"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="size-4" aria-hidden="true" />
              Banco de dados
            </CardTitle>
            <CardDescription>DATABASE_URL definida neste ambiente?</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusBadge status={isDatabaseConfigured ? "implementado" : "pendente"} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-4" aria-hidden="true" />
              Autenticação
            </CardTitle>
            <CardDescription>AUTH_SECRET definido neste ambiente?</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusBadge status={isAuthConfigured ? "implementado" : "pendente"} />
          </CardContent>
        </Card>
      </div>

      <section className="mt-8" aria-labelledby="metricas">
        <h2 id="metricas" className="mb-3 text-lg font-semibold">
          Métricas de navegação
        </h2>
        <PlannedSection
          feature="Agregação de eventos"
          reference="docs/INTEGRATION.md (Analytics)"
        />
      </section>
    </>
  );
}
