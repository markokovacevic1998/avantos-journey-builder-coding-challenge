import {
  API_BASE_URL,
  TENANT_ID,
  ACTION_BLUEPRINT_ID,
  BLUEPRINT_VERSION_ID,
} from "../constants";

export async function getRawGraphData() {
  const result = await fetch(
    `${API_BASE_URL}/api/v1/${TENANT_ID}/actions/blueprints/${ACTION_BLUEPRINT_ID}/${BLUEPRINT_VERSION_ID}/graph`
  ).then((response) => response.json());

  return result;
}
