import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { PlannedSection } from "@/features/admin/components/planned-section";

export default function AdminRoadmapsPage() {
  return (
    <>
      <AdminPageHeader
        title="Roadmaps"
        description="Etapas, tópicos e ordem de cada roadmap."
        status="planejado"
      />
      <PlannedSection feature="Gestão de roadmaps" reference="docs/milestones/MILESTONES.md" />
    </>
  );
}
