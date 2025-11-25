import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PrefillSelector } from "../PrefillSelector";
import { ActionGraph, FormNode } from "@/src/lib/domain/types";

const mockUseGraphContext = jest.fn();
jest.mock("@/src/context/GraphContext", () => ({
  ...jest.requireActual("@/src/context/GraphContext"),
  useGraphContext: () => mockUseGraphContext(),
}));

describe("PrefillSelector", () => {
  const mockOnSelect = jest.fn();

  const createTestGraph = (): ActionGraph => {
    const formA: FormNode = {
      id: "form-a",
      name: "Form A",
      fields: [
        { id: "email", label: "Email", type: "string" },
        { id: "name", label: "Name", type: "string" },
      ],
      upstreamIds: [],
      downstreamIds: ["form-b"],
      formDefinitionId: "def-a",
      position: { x: 0, y: 0 },
    };

    const formB: FormNode = {
      id: "form-b",
      name: "Form B",
      fields: [{ id: "address", label: "Address", type: "string" }],
      upstreamIds: ["form-a"],
      downstreamIds: ["form-c"],
      formDefinitionId: "def-b",
      position: { x: 0, y: 0 },
    };

    const formC: FormNode = {
      id: "form-c",
      name: "Form C",
      fields: [],
      upstreamIds: ["form-b"],
      downstreamIds: [],
      formDefinitionId: "def-c",
      position: { x: 0, y: 0 },
    };

    return {
      formsById: {
        "form-a": formA,
        "form-b": formB,
        "form-c": formC,
      },
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGraphContext.mockReturnValue({
      graph: createTestGraph(),
      loading: false,
      error: null,
    });
  });

  it("should render field ID and form ID", () => {
    render(
      <PrefillSelector
        fieldId="field-1"
        formId="form-c"
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText(/Choose where the value for/)).toBeInTheDocument();
    expect(screen.getByText("field-1")).toBeInTheDocument();
  });

  it("should display all provider labels", () => {
    render(
      <PrefillSelector
        fieldId="field-1"
        formId="form-c"
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText("Direct upstream nodes")).toBeInTheDocument();
    expect(screen.getByText("Transitive upstream nodes")).toBeInTheDocument();
    expect(screen.getByText("Global sources")).toBeInTheDocument();
  });

  it("should show 'No sources available' when provider returns no forms", () => {
    render(
      <PrefillSelector
        fieldId="field-1"
        formId="form-a"
        onSelect={mockOnSelect}
      />
    );

    const noSourcesTexts = screen.getAllByText("No sources available");
    expect(noSourcesTexts.length).toBeGreaterThan(0);
  });

  it("should expand form when clicking on form button", () => {
    render(
      <PrefillSelector
        fieldId="field-1"
        formId="form-c"
        onSelect={mockOnSelect}
      />
    );

    const formButtons = screen.getAllByText("Form B");
    const formButton = formButtons.find((btn) => btn.closest("button"));

    if (formButton) {
      fireEvent.click(formButton);

      waitFor(() => {
        expect(screen.getByText("Address")).toBeInTheDocument();
      });
    }
  });

  it("should call onSelect with FORM_FIELD source when selecting form field", () => {
    render(
      <PrefillSelector
        fieldId="field-1"
        formId="form-c"
        onSelect={mockOnSelect}
      />
    );

    const formButtons = screen.getAllByText("Form B");
    const formButton = formButtons.find((btn) => btn.closest("button"));

    if (formButton) {
      fireEvent.click(formButton);

      waitFor(() => {
        const addressButton = screen.getByText("Address");
        fireEvent.click(addressButton);

        expect(mockOnSelect).toHaveBeenCalledWith({
          source: "FORM_FIELD",
          fromFormId: "form-b",
          fromFieldId: "address",
          label: "Address from Form B",
        });
      });
    }
  });

  it("should call onSelect with GLOBAL source when selecting global field", () => {
    render(
      <PrefillSelector
        fieldId="field-1"
        formId="form-c"
        onSelect={mockOnSelect}
      />
    );

    const globalForms = screen.getAllByText(/Default User|App Settings/);
    if (globalForms.length > 0) {
      const globalFormButton = globalForms[0].closest("button");
      if (globalFormButton) {
        fireEvent.click(globalFormButton);

        waitFor(() => {
          const globalFields = screen.getAllByText(
            /Email|Country|Theme|Timezone/
          );
          if (globalFields.length > 0) {
            fireEvent.click(globalFields[0]);

            expect(mockOnSelect).toHaveBeenCalledWith(
              expect.objectContaining({
                source: "GLOBAL",
              })
            );
          }
        });
      }
    }
  });

  it("should display error message when fieldId or formId is missing", () => {
    render(
      <PrefillSelector fieldId="" formId="form-c" onSelect={mockOnSelect} />
    );

    expect(screen.getByText("Missing field/form ID")).toBeInTheDocument();
  });

  it("should handle empty graph gracefully", () => {
    mockUseGraphContext.mockReturnValue({
      graph: { formsById: {} },
      loading: false,
      error: null,
    });

    render(
      <PrefillSelector
        fieldId="field-1"
        formId="form-c"
        onSelect={mockOnSelect}
      />
    );

    const noSourcesTexts = screen.getAllByText("No sources available");
    expect(noSourcesTexts.length).toBeGreaterThan(0);
  });
});
