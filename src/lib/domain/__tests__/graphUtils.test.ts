import {
  getDirectUpstream,
  getDirectDownstream,
  getAllUpstream,
  getAllDownstream,
  getTransitiveUpstream,
  toFieldSummary,
} from "../graphUtils";
import { ActionGraph, FormNode } from "../types";

describe("graphUtils", () => {
  function createTestGraph(): ActionGraph {
    const formA: FormNode = {
      id: "form-a",
      name: "Form A",
      fields: [
        { id: "field-a1", label: "Field A1", type: "string" },
        { id: "field-a2", label: "Field A2", type: "string" },
      ],
      upstreamIds: [],
      downstreamIds: ["form-b", "form-c"],
      formDefinitionId: "def-a",
      position: { x: 0, y: 0 },
    };

    const formB: FormNode = {
      id: "form-b",
      name: "Form B",
      fields: [{ id: "field-b1", label: "Field B1", type: "string" }],
      upstreamIds: ["form-a"],
      downstreamIds: ["form-d"],
      formDefinitionId: "def-b",
      position: { x: 0, y: 0 },
    };

    const formC: FormNode = {
      id: "form-c",
      name: "Form C",
      fields: [{ id: "field-c1", label: "Field C1", type: "string" }],
      upstreamIds: ["form-a"],
      downstreamIds: ["form-e"],
      formDefinitionId: "def-c",
      position: { x: 0, y: 0 },
    };

    const formD: FormNode = {
      id: "form-d",
      name: "Form D",
      fields: [{ id: "field-d1", label: "Field D1", type: "string" }],
      upstreamIds: ["form-b"],
      downstreamIds: ["form-f"],
      formDefinitionId: "def-d",
      position: { x: 0, y: 0 },
    };

    const formE: FormNode = {
      id: "form-e",
      name: "Form E",
      fields: [],
      upstreamIds: ["form-c"],
      downstreamIds: ["form-f"],
      formDefinitionId: "def-e",
      position: { x: 0, y: 0 },
    };

    const formF: FormNode = {
      id: "form-f",
      name: "Form F",
      fields: [],
      upstreamIds: ["form-d", "form-e"],
      downstreamIds: [],
      formDefinitionId: "def-f",
      position: { x: 0, y: 0 },
    };

    return {
      formsById: {
        "form-a": formA,
        "form-b": formB,
        "form-c": formC,
        "form-d": formD,
        "form-e": formE,
        "form-f": formF,
      },
    };
  }

  describe("getDirectUpstream", () => {
    it("should return direct upstream forms", () => {
      const graph = createTestGraph();
      const result = getDirectUpstream(graph, "form-d");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("form-b");
    });

    it("should return empty array for forms with no upstream", () => {
      const graph = createTestGraph();
      const result = getDirectUpstream(graph, "form-a");

      expect(result).toHaveLength(0);
    });

    it("should return empty array for non-existent form", () => {
      const graph = createTestGraph();
      const result = getDirectUpstream(graph, "non-existent");

      expect(result).toHaveLength(0);
    });
  });

  describe("getDirectDownstream", () => {
    it("should return direct downstream forms", () => {
      const graph = createTestGraph();
      const result = getDirectDownstream(graph, "form-a");

      expect(result).toHaveLength(2);
      expect(result.map((f) => f.id)).toContain("form-b");
      expect(result.map((f) => f.id)).toContain("form-c");
    });

    it("should return empty array for forms with no downstream", () => {
      const graph = createTestGraph();
      const result = getDirectDownstream(graph, "form-f");

      expect(result).toHaveLength(0);
    });

    it("should return empty array for non-existent form", () => {
      const graph = createTestGraph();
      const result = getDirectDownstream(graph, "non-existent");

      expect(result).toHaveLength(0);
    });
  });

  describe("getAllUpstream", () => {
    it("should return all upstream forms recursively", () => {
      const graph = createTestGraph();
      const result = getAllUpstream(graph, "form-f");

      expect(result).toHaveLength(5);
      const ids = result.map((f) => f.id);
      expect(ids).toContain("form-d");
      expect(ids).toContain("form-e");
      expect(ids).toContain("form-b");
      expect(ids).toContain("form-c");
      expect(ids).toContain("form-a");
    });

    it("should return empty array for forms with no upstream", () => {
      const graph = createTestGraph();
      const result = getAllUpstream(graph, "form-a");

      expect(result).toHaveLength(0);
    });

    it("should handle forms with single upstream", () => {
      const graph = createTestGraph();
      const result = getAllUpstream(graph, "form-b");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("form-a");
    });
  });

  describe("getAllDownstream", () => {
    it("should return all downstream forms recursively", () => {
      const graph = createTestGraph();
      const result = getAllDownstream(graph, "form-a");

      expect(result).toHaveLength(5);
      const ids = result.map((f) => f.id);
      expect(ids).toContain("form-b");
      expect(ids).toContain("form-c");
      expect(ids).toContain("form-d");
      expect(ids).toContain("form-e");
      expect(ids).toContain("form-f");
    });

    it("should return empty array for forms with no downstream", () => {
      const graph = createTestGraph();
      const result = getAllDownstream(graph, "form-f");

      expect(result).toHaveLength(0);
    });
  });

  describe("getTransitiveUpstream", () => {
    it("should return only transitive upstream", () => {
      const graph = createTestGraph();
      const result = getTransitiveUpstream(graph, "form-f");

      expect(result).toHaveLength(3);
      const ids = result?.map((f) => f.id);
      expect(ids).not.toContain("form-d");
      expect(ids).not.toContain("form-e");
      expect(ids).toContain("form-b");
      expect(ids).toContain("form-c");
      expect(ids).toContain("form-a");
    });

    it("should return empty array when there are no transitive upstream forms", () => {
      const graph = createTestGraph();
      const result = getTransitiveUpstream(graph, "form-b");

      expect(result).toHaveLength(0);
    });

    it("should return empty array for non-existent form", () => {
      const graph = createTestGraph();
      const result = getTransitiveUpstream(graph, "non-existent");

      expect(result).toHaveLength(0);
    });
  });

  describe("toFieldSummary", () => {
    it("should convert form fields to field summaries", () => {
      const form: FormNode = {
        id: "form-1",
        name: "Test Form",
        fields: [
          { id: "field-1", label: "Field 1", type: "string" },
          { id: "field-2", label: "Field 2", type: "number" },
        ],
        upstreamIds: [],
        downstreamIds: [],
        formDefinitionId: "def-1",
        position: { x: 0, y: 0 },
      };

      const result = toFieldSummary(form);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: "field-1", label: "Field 1" });
      expect(result[1]).toEqual({ id: "field-2", label: "Field 2" });
    });

    it("should use field id as label when label is empty string", () => {
      const form: FormNode = {
        id: "form-1",
        name: "Test Form",
        fields: [{ id: "field-1", label: "", type: "string" }],
        upstreamIds: [],
        downstreamIds: [],
        formDefinitionId: "def-1",
        position: { x: 0, y: 0 },
      };

      const result = toFieldSummary(form);

      expect(result[0].label).toBe("");
      expect(result[0].id).toBe("field-1");
    });
  });
});
