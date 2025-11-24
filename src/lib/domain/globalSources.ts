import { PrefillFormNode } from "./types";

export const GLOBAL_FORMS: PrefillFormNode[] = [
  {
    id: "defaultUser",
    name: "Default User",
    fields: [
      { id: "email", label: "Email" },
      { id: "country", label: "Country" },
    ],
  },
  {
    id: "appSettings",
    name: "App Settings",
    fields: [
      { id: "theme", label: "Theme" },
      { id: "timezone", label: "Timezone" },
    ],
  },
];
