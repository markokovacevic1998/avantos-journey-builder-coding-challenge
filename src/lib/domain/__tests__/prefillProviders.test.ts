import {
  directUpstreamProvider,
  transitiveUpstreamProvider,
  globalProvider,
  prefillProviders,
  PrefillSourceProvider,
} from "../prefillProviders";
import { ActionGraph, FormNode } from "../types";
import { GLOBAL_FORMS } from "../globalSources";

describe("prefillProviders", () => {
  function createTestGraph(): ActionGraph {
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
  }

  describe("globalProvider", () => {
    it("should return global forms regardless of formId", () => {
      const graph = createTestGraph();
      const result1 = globalProvider.getForms(graph, "form-a");
      const result2 = globalProvider.getForms(graph, "form-c");

      expect(result1).toEqual(GLOBAL_FORMS);
      expect(result2).toEqual(GLOBAL_FORMS);
    });

    it("should return fields from global forms", () => {
      const graph = createTestGraph();
      const forms = globalProvider.getForms(graph, "form-a");
      const fields = globalProvider.getFields!(forms![0]);

      expect(fields).toBeDefined();
      expect(fields!.length).toBeGreaterThan(0);
    });
  });

  describe("prefillProviders array", () => {
    it("should contain all three providers", () => {
      expect(prefillProviders).toHaveLength(3);
      expect(prefillProviders).toContain(directUpstreamProvider);
      expect(prefillProviders).toContain(transitiveUpstreamProvider);
      expect(prefillProviders).toContain(globalProvider);
    });

    it("should have providers with unique ids", () => {
      const ids = prefillProviders.map((p) => p.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have all providers with required interface properties", () => {
      prefillProviders.forEach((provider) => {
        expect(provider).toHaveProperty("id");
        expect(provider).toHaveProperty("label");
        expect(provider).toHaveProperty("getForms");
        expect(typeof provider.getForms).toBe("function");
      });
    });
  });

  describe("extensibility", () => {
    it("should allow adding new providers by implementing the interface", () => {
      const customProvider: PrefillSourceProvider = {
        id: "custom",
        label: "Custom Source",
        getForms: () => [
          {
            id: "custom-form",
            name: "Custom Form",
            fields: [{ id: "custom-field", label: "Custom Field" }],
          },
        ],
        getFields: (form) => form.fields,
      };

      expect(customProvider.getForms({ formsById: {} }, "any")).toHaveLength(1);
    });
  });
});
