import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionHeading } from "@/components/design-system/section-heading";

describe("SectionHeading", () => {
  it("renderiza eyebrow, título com nível semântico e descrição", () => {
    render(
      <SectionHeading
        as="h1"
        eyebrow="Carreiras"
        title="Áreas para começar"
        description="Escolha uma."
      />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: /Áreas para começar/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("Carreiras")).toBeInTheDocument();
    expect(screen.getByText("Escolha uma.")).toBeInTheDocument();
  });

  it("usa h2 por padrão e mantém o rabisco decorativo oculto de leitores de tela", () => {
    const { container } = render(<SectionHeading title="Roadmaps" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Roadmaps");
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
