import { renderHook, act } from "@testing-library/react";
import { usePrefillConfig } from "../usePrefillConfig";
import { FieldPrefillConfig } from "../../domain/prefill";

describe("usePrefillConfig", () => {
  it("should initialize with empty config", () => {
    const { result } = renderHook(() => usePrefillConfig());

    expect(result.current.prefillConfig).toEqual({});
  });

  it("should initialize prefill for a form with null values", () => {
    const { result } = renderHook(() => usePrefillConfig());

    act(() => {
      result.current.initialPrefillUpdate("form-1", [
        { id: "field-1" },
        { id: "field-2" },
      ]);
    });

    expect(result.current.prefillConfig).toEqual({
      "form-1": {
        "field-1": null,
        "field-2": null,
      },
    });
  });

  it("should not overwrite existing form config", () => {
    const { result } = renderHook(() => usePrefillConfig());

    act(() => {
      result.current.initialPrefillUpdate("form-1", [{ id: "field-1" }]);
    });

    const initialConfig = result.current.prefillConfig;

    act(() => {
      result.current.initialPrefillUpdate("form-1", [{ id: "field-2" }]);
    });

    expect(result.current.prefillConfig).toEqual(initialConfig);
  });

  it("should set field source", () => {
    const { result } = renderHook(() => usePrefillConfig());

    act(() => {
      result.current.initialPrefillUpdate("form-1", [{ id: "field-1" }]);
    });

    const config: FieldPrefillConfig = {
      fieldId: "field-1",
      config: {
        source: "FORM_FIELD",
        fromFormId: "form-2",
        fromFieldId: "field-2",
        label: "Field 2 from Form 2",
      },
    };

    act(() => {
      result.current.setFieldSource("form-1", "field-1", config);
    });

    expect(result.current.prefillConfig["form-1"]["field-1"]).toEqual(config);
  });

  it("should clear field source", () => {
    const { result } = renderHook(() => usePrefillConfig());

    act(() => {
      result.current.initialPrefillUpdate("form-1", [{ id: "field-1" }]);
    });

    const config: FieldPrefillConfig = {
      fieldId: "field-1",
      config: {
        source: "FORM_FIELD",
        fromFormId: "form-2",
        fromFieldId: "field-2",
        label: "Field 2 from Form 2",
      },
    };

    act(() => {
      result.current.setFieldSource("form-1", "field-1", config);
    });

    act(() => {
      result.current.clearFieldSource("form-1", "field-1");
    });

    expect(result.current.prefillConfig["form-1"]["field-1"]).toBeNull();
  });

  it("should handle multiple forms independently", () => {
    const { result } = renderHook(() => usePrefillConfig());

    act(() => {
      result.current.initialPrefillUpdate("form-1", [{ id: "field-1" }]);
      result.current.initialPrefillUpdate("form-2", [{ id: "field-2" }]);
    });

    const config1: FieldPrefillConfig = {
      fieldId: "field-1",
      config: {
        source: "GLOBAL",
        globalId: "global-1",
        label: "Global Field",
      },
    };

    const config2: FieldPrefillConfig = {
      fieldId: "field-2",
      config: {
        source: "FORM_FIELD",
        fromFormId: "form-1",
        fromFieldId: "field-1",
        label: "Field 1 from Form 1",
      },
    };

    act(() => {
      result.current.setFieldSource("form-1", "field-1", config1);
      result.current.setFieldSource("form-2", "field-2", config2);
    });

    expect(result.current.prefillConfig["form-1"]["field-1"]).toEqual(config1);
    expect(result.current.prefillConfig["form-2"]["field-2"]).toEqual(config2);
  });

  it("should update existing field source", () => {
    const { result } = renderHook(() => usePrefillConfig());

    act(() => {
      result.current.initialPrefillUpdate("form-1", [{ id: "field-1" }]);
    });

    const config1: FieldPrefillConfig = {
      fieldId: "field-1",
      config: {
        source: "FORM_FIELD",
        fromFormId: "form-2",
        fromFieldId: "field-2",
        label: "Field 2 from Form 2",
      },
    };

    const config2: FieldPrefillConfig = {
      fieldId: "field-1",
      config: {
        source: "GLOBAL",
        globalId: "global-1",
        label: "Global Field",
      },
    };

    act(() => {
      result.current.setFieldSource("form-1", "field-1", config1);
    });

    act(() => {
      result.current.setFieldSource("form-1", "field-1", config2);
    });

    expect(result.current.prefillConfig["form-1"]["field-1"]).toEqual(config2);
  });
});

