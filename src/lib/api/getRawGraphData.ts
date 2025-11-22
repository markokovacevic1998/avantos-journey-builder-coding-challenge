export async function getRawGraphData() {
  // TODO put those hardcoded values in constants.js
  const tenant_id = "123";
  const action_blueprint_id = "bp_456";
  const blueprint_version_id = "bpv_123";

  const result = await fetch(
    `http://localhost:3333/api/v1/${tenant_id}/actions/blueprints/${action_blueprint_id}/${blueprint_version_id}/graph`
  ).then((response) => response.json());

  return result;
}
