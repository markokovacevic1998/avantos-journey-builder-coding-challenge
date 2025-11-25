import { cleanGraphData } from "../cleanGraphData";
import { ActionBlueprintGraphDescription } from "../types";

describe("cleanGraphData", () => {
  it("should transform raw graph data into internal structure", () => {
    const rawData: ActionBlueprintGraphDescription = {
      $schema: "",
      id: "test-id",
      tenant_id: "1",
      name: "Test Graph",
      description: "Test",
      category: "Test",
      nodes: [
        {
          id: "form-1",
          type: "form",
          position: { x: 100, y: 200 },
          data: {
            id: "bp-1",
            component_key: "form-1",
            component_type: "form",
            component_id: "form-def-1",
            name: "Form 1",
            prerequisites: [],
            permitted_roles: [],
            input_mapping: {},
            sla_duration: { number: 0, unit: "minutes" },
            approval_required: false,
            approval_roles: [],
          },
        },
        {
          id: "form-2",
          type: "form",
          position: { x: 300, y: 400 },
          data: {
            id: "bp-2",
            component_key: "form-2",
            component_type: "form",
            component_id: "form-def-2",
            name: "Form 2",
            prerequisites: ["form-1"],
            permitted_roles: [],
            input_mapping: {},
            sla_duration: { number: 0, unit: "minutes" },
            approval_required: false,
            approval_roles: [],
          },
        },
      ],
      edges: [
        { source: "form-1", target: "form-2" },
      ],
      forms: [
        {
          id: "form-def-1",
          name: "Form Definition 1",
          description: "Test",
          is_reusable: false,
          field_schema: {
            type: "object",
            properties: {
              email: {
                avantos_type: "short-text",
                title: "Email",
                type: "string",
              },
              name: {
                avantos_type: "short-text",
                title: "Name",
                type: "string",
              },
            },
            required: ["email"],
          },
          ui_schema: {
            type: "VerticalLayout",
            elements: [],
          },
          dynamic_field_config: {},
        },
        {
          id: "form-def-2",
          name: "Form Definition 2",
          description: "Test",
          is_reusable: false,
          field_schema: {
            type: "object",
            properties: {
              address: {
                avantos_type: "short-text",
                title: "Address",
                type: "string",
              },
            },
            required: [],
          },
          ui_schema: {
            type: "VerticalLayout",
            elements: [],
          },
          dynamic_field_config: {},
        },
      ],
      branches: [],
      triggers: [],
    };

    const result = cleanGraphData(rawData);

    expect(result.formsById).toHaveProperty("form-1");
    expect(result.formsById).toHaveProperty("form-2");

    const form1 = result.formsById["form-1"];
    expect(form1.name).toBe("Form 1");
    expect(form1.upstreamIds).toEqual([]);
    expect(form1.downstreamIds).toEqual(["form-2"]);
    expect(form1.fields).toHaveLength(2);
    expect(form1.fields[0]).toEqual({
      id: "email",
      label: "Email",
      type: "short-text",
    });

    const form2 = result.formsById["form-2"];
    expect(form2.name).toBe("Form 2");
    expect(form2.upstreamIds).toEqual(["form-1"]);
    expect(form2.downstreamIds).toEqual([]);
    expect(form2.fields).toHaveLength(1);
    expect(form2.fields[0]).toEqual({
      id: "address",
      label: "Address",
      type: "short-text",
    });
  });

  it("should handle forms with no fields", () => {
    const rawData: ActionBlueprintGraphDescription = {
      $schema: "",
      id: "test-id",
      tenant_id: "1",
      name: "Test Graph",
      description: "Test",
      category: "Test",
      nodes: [
        {
          id: "form-1",
          type: "form",
          position: { x: 0, y: 0 },
          data: {
            id: "bp-1",
            component_key: "form-1",
            component_type: "form",
            component_id: "form-def-1",
            name: "Form 1",
            prerequisites: [],
            permitted_roles: [],
            input_mapping: {},
            sla_duration: { number: 0, unit: "minutes" },
            approval_required: false,
            approval_roles: [],
          },
        },
      ],
      edges: [],
      forms: [
        {
          id: "form-def-1",
          name: "Form Definition 1",
          description: "Test",
          is_reusable: false,
          field_schema: {
            type: "object",
            properties: {},
            required: [],
          },
          ui_schema: {
            type: "VerticalLayout",
            elements: [],
          },
          dynamic_field_config: {},
        },
      ],
      branches: [],
      triggers: [],
    };

    const result = cleanGraphData(rawData);

    expect(result.formsById["form-1"].fields).toHaveLength(0);
  });

  it("should handle fields without title", () => {
    const rawData: ActionBlueprintGraphDescription = {
      $schema: "",
      id: "test-id",
      tenant_id: "1",
      name: "Test Graph",
      description: "Test",
      category: "Test",
      nodes: [
        {
          id: "form-1",
          type: "form",
          position: { x: 0, y: 0 },
          data: {
            id: "bp-1",
            component_key: "form-1",
            component_type: "form",
            component_id: "form-def-1",
            name: "Form 1",
            prerequisites: [],
            permitted_roles: [],
            input_mapping: {},
            sla_duration: { number: 0, unit: "minutes" },
            approval_required: false,
            approval_roles: [],
          },
        },
      ],
      edges: [],
      forms: [
        {
          id: "form-def-1",
          name: "Form Definition 1",
          description: "Test",
          is_reusable: false,
          field_schema: {
            type: "object",
            properties: {
              fieldWithoutTitle: {
                avantos_type: "short-text",
                type: "string",
              },
            },
            required: [],
          },
          ui_schema: {
            type: "VerticalLayout",
            elements: [],
          },
          dynamic_field_config: {},
        },
      ],
      branches: [],
      triggers: [],
    };

    const result = cleanGraphData(rawData);

    expect(result.formsById["form-1"].fields[0].label).toBe("");
  });

  it("should correctly set downstreamIds from edges", () => {
    const rawData: ActionBlueprintGraphDescription = {
      $schema: "",
      id: "test-id",
      tenant_id: "1",
      name: "Test Graph",
      description: "Test",
      category: "Test",
      nodes: [
        {
          id: "form-a",
          type: "form",
          position: { x: 0, y: 0 },
          data: {
            id: "bp-a",
            component_key: "form-a",
            component_type: "form",
            component_id: "form-def-a",
            name: "Form A",
            prerequisites: [],
            permitted_roles: [],
            input_mapping: {},
            sla_duration: { number: 0, unit: "minutes" },
            approval_required: false,
            approval_roles: [],
          },
        },
        {
          id: "form-b",
          type: "form",
          position: { x: 0, y: 0 },
          data: {
            id: "bp-b",
            component_key: "form-b",
            component_type: "form",
            component_id: "form-def-b",
            name: "Form B",
            prerequisites: ["form-a"],
            permitted_roles: [],
            input_mapping: {},
            sla_duration: { number: 0, unit: "minutes" },
            approval_required: false,
            approval_roles: [],
          },
        },
        {
          id: "form-c",
          type: "form",
          position: { x: 0, y: 0 },
          data: {
            id: "bp-c",
            component_key: "form-c",
            component_type: "form",
            component_id: "form-def-c",
            name: "Form C",
            prerequisites: ["form-a"],
            permitted_roles: [],
            input_mapping: {},
            sla_duration: { number: 0, unit: "minutes" },
            approval_required: false,
            approval_roles: [],
          },
        },
      ],
      edges: [
        { source: "form-a", target: "form-b" },
        { source: "form-a", target: "form-c" },
      ],
      forms: [
        {
          id: "form-def-a",
          name: "Form Definition A",
          description: "Test",
          is_reusable: false,
          field_schema: {
            type: "object",
            properties: {},
            required: [],
          },
          ui_schema: {
            type: "VerticalLayout",
            elements: [],
          },
          dynamic_field_config: {},
        },
        {
          id: "form-def-b",
          name: "Form Definition B",
          description: "Test",
          is_reusable: false,
          field_schema: {
            type: "object",
            properties: {},
            required: [],
          },
          ui_schema: {
            type: "VerticalLayout",
            elements: [],
          },
          dynamic_field_config: {},
        },
        {
          id: "form-def-c",
          name: "Form Definition C",
          description: "Test",
          is_reusable: false,
          field_schema: {
            type: "object",
            properties: {},
            required: [],
          },
          ui_schema: {
            type: "VerticalLayout",
            elements: [],
          },
          dynamic_field_config: {},
        },
      ],
      branches: [],
      triggers: [],
    };

    const result = cleanGraphData(rawData);

    expect(result.formsById["form-a"].downstreamIds).toHaveLength(2);
    expect(result.formsById["form-a"].downstreamIds).toContain("form-b");
    expect(result.formsById["form-a"].downstreamIds).toContain("form-c");
  });
});

