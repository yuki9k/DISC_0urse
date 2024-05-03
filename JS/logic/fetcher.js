"use strict";
export { fetcher };

async function fetcher(req) {
  const res = await fetch(req);
  const resJson = await res.json();

  if (!res.ok) {
    throw new Error(`${res.status} ${resJson.error}`);
  }

  return resJson;
}
