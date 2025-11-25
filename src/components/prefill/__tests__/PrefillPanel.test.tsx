import { render, screen, fireEvent } from "@testing-library/react";
import { PrefillPanel } from "../PrefillPanel";
import { FormNode } from "@/src/lib/domain/types";
import { FieldPrefillConfig } from "@/src/lib/domain/prefill";
import "@testing-library/jest-dom/extend-expect";

describe("PrefillPanel", () => {
  const mockNode: FormNode = {
    id: "form-1",
    name: "Test Form",
    fields: [
      { id: "field-1", label: "Field 1", type: "string" },
      { id: "field-2", label: "Field 2", type: "string" },
      { id: "field-3", label: "Field 3", type: "string" },
    ],
    upstreamIds: [],
    downstreamIds: [],
    formDefinitionId: "def-1",
    position: { x: 0, y: 0 },
  };

  const mockOnFormFieldClick = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render form name and fields", () => {
    render(
      <PrefillPanel
        node={mockNode}
        prefill={{}}
        onFormFieldClick={mockOnFormFieldClick}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText("Prefill for Test Form")).toBeInTheDocument();
    expect(screen.getByText("Field 1")).toBeInTheDocument();
    expect(screen.getByText("Field 2")).toBeInTheDocument();
    expect(screen.getByText("Field 3")).toBeInTheDocument();
  });

  it("should display 'No prefill set' for fields without config", () => {
    render(
      <PrefillPanel
        node={mockNode}
        prefill={{}}
        onFormFieldClick={mockOnFormFieldClick}
        onClear={mockOnClear}
      />
    );

    const noPrefillTexts = screen.getAllByText("No prefill set");
    expect(noPrefillTexts).toHaveLength(3);
  });

  it("should display prefill config label when config exists", () => {
    const prefill: Record<string, FieldPrefillConfig | null> = {
      "field-1": {
        fieldId: "field-1",
        config: {
          source: "FORM_FIELD",
          fromFormId: "form-2",
          fromFieldId: "field-2",
          label: "Field 2 from Form 2",
        },
      },
    };

    render(
      <PrefillPanel
        node={mockNode}
        prefill={prefill}
        onFormFieldClick={mockOnFormFieldClick}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText("Field 2 from Form 2")).toBeInTheDocument();
  });

  it("should call onFormFieldClick when clicking field without config", () => {
    render(
      <PrefillPanel
        node={mockNode}
        prefill={{}}
        onFormFieldClick={mockOnFormFieldClick}
        onClear={mockOnClear}
      />
    );

    const field1 = screen.getByText("Field 1").closest("div");
    fireEvent.click(field1!);

    expect(mockOnFormFieldClick).toHaveBeenCalledWith("field-1");
    expect(mockOnFormFieldClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onFormFieldClick when clicking field with config", () => {
    const prefill: Record<string, FieldPrefillConfig | null> = {
      "field-1": {
        fieldId: "field-1",
        config: {
          source: "FORM_FIELD",
          fromFormId: "form-2",
          fromFieldId: "field-2",
          label: "Field 2 from Form 2",
        },
      },
    };

    render(
      <PrefillPanel
        node={mockNode}
        prefill={prefill}
        onFormFieldClick={mockOnFormFieldClick}
        onClear={mockOnClear}
      />
    );

    const field1 = screen.getByText("Field 1").closest("div");
    fireEvent.click(field1!);

    expect(mockOnFormFieldClick).not.toHaveBeenCalled();
  });

  it("should call onClear when clicking clear button", () => {
    const prefill: Record<string, FieldPrefillConfig | null> = {
      "field-1": {
        fieldId: "field-1",
        config: {
          source: "FORM_FIELD",
          fromFormId: "form-2",
          fromFieldId: "field-2",
          label: "Field 2 from Form 2",
        },
      },
    };

    render(
      <PrefillPanel
        node={mockNode}
        prefill={prefill}
        onFormFieldClick={mockOnFormFieldClick}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByText("✕");
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalledWith("field-1");
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it("should not render clear button for fields without config", () => {
    render(
      <PrefillPanel
        node={mockNode}
        prefill={{}}
        onFormFieldClick={mockOnFormFieldClick}
        onClear={mockOnClear}
      />
    );

    expect(screen.queryByText("✕")).not.toBeInTheDocument();
  });

  it("should handle fields without label", () => {
    const nodeWithoutLabels: FormNode = {
      ...mockNode,
      fields: [{ id: "field-no-label", label: "", type: "string" }],
    };

    render(
      <PrefillPanel
        node={nodeWithoutLabels}
        prefill={{}}
        onFormFieldClick={mockOnFormFieldClick}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText("field-no-label")).toBeInTheDocument();
  });

  it("should return null when node is not provided", () => {
    const { container } = render(
      <PrefillPanel
        node={null as any}
        prefill={{}}
        onFormFieldClick={mockOnFormFieldClick}
        onClear={mockOnClear}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
