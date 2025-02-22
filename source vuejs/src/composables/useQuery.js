import { useAuthStore } from "@/stores/auth";
import { useGlobalStore } from "@/stores/global";
export async function fetchQuery(
  obj,
  method,
  path,
  body = null,
  callback = null
) {
  const authStore = useAuthStore();
  const globalStore = useGlobalStore();

  const headers =
    body instanceof FormData
      ? {
          Authorization: `Bearer ${authStore.token}`,
        }
      : {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        };

  // console.log(body.FormData );
  // console.log(typeof body);
  const options = {
    method: method,
    headers,
    ...(method.toLowerCase() !== "get" && body
      ? { body: body instanceof FormData ? body : JSON.stringify(body) }
      : {}),
  };

  try {
    const resp = await fetch(`${globalStore.serviceUrl}${path}`, options);

    if (resp.status === 403) {
      authStore.logout();
      return;
      // throw new Error("Access Forbidden: 403");
    }

    let total = resp.headers.get("content-length");
    let reader = await resp.body.getReader();
    const decoder = new TextDecoder();
    let bytesReceived = 0;
    const chunks = [];
    let res = await reader.read().then(function processResult(result) {
      if (result.done) {
        try {
          return JSON.parse(chunks.join(""));
        } catch (error) {
          console.error(error);
          return {
            success: false,
            errorMsg: "Invalid Response Format Error.",
          };
        }
      }
      bytesReceived += result.value.length;
      const chunk = decoder.decode(result.value, { stream: true });
      chunks.push(chunk);

      if (
        obj.call &&
        obj[obj.call] &&
        obj[obj.call].loading_percent !== undefined
      ) {
        obj[obj.call].loading_percent =
          (parseFloat(bytesReceived) / parseFloat(total)) * 100;
      }

      return reader.read().then(processResult);
    });

    return callback ? callback({ ...res }) : res;
  } catch (err) {
    return callback
      ? callback({
          success: false,
          errorMsg: err,
        })
      : { success: false, errorMsg: err };
  }
}

export function buildPath(obj, path) {
  let queryParams = null;
  if (obj) {
    queryParams = new URLSearchParams();
    if (obj.debug) queryParams.set("debug", encodeURIComponent(obj.debug));
    if (obj.page) queryParams.set("page", obj.page);
    if (obj.row) queryParams.set("rows", obj.row);

    if (obj.getTotal) queryParams.set("total", obj.getTotal);
    if (obj.current) queryParams.set("current", obj.current);
    if (obj.search)
      obj.search.forEach((v) =>
        v.value ? queryParams.set(v.id, encodeURIComponent(v.value)) : ""
      );
    if (obj.q) queryParams.set("q", encodeURIComponent(obj.q));
    if (obj.findObject)
      queryParams.set("findObject", encodeURIComponent(obj.findObject));
    if (obj.department)
      queryParams.set("department", encodeURIComponent(obj.department));
  }

  return `${path}${queryParams ? "?" + queryParams.toString() : ""}`;
}
