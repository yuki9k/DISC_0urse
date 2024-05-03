"use strict";
export { createJsonRequest };

function createJsonRequest(url, data, method) {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    ...data,
  });

  return new Request(url, { headers, body, method });
}
