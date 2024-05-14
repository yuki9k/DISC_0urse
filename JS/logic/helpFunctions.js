export function get_instance_dom_id(parent_id, id) {
  return document.getElementById(`${parent_id}_instance_${id}`);
}

export async function fetcher(request) {
  const success = {};
  const response = await fetch(request);
  success.ok = response.ok;
  success.status = response.status;
  if (!success.ok) {
    return success;
  }
  const resource = await response.json();

  return {
    resource: resource,
    success: success,
  };
}
