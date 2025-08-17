function buildRowId(
  prefix: "thr" | "msg",
  thread: { platform: string; service: string },
  external_id: string,
) {
  const p = thread.platform;
  if (!p) throw new Error("Missing platform");
  const s = thread.service;
  if (!s) throw new Error("Missing service");
  if (!external_id) throw new Error("Missing external_id");
  return `${prefix}:${p}:${s}:${external_id}`;
}

export function buildThreadRowId(thread: {
  platform: string;
  service: string;
  external_id: string;
}) {
  return buildRowId("thr", thread, thread.external_id);
}

export function buildMessageRowId(
  thread: { platform: string; service: string },
  message: { external_id: string },
) {
  return buildRowId("msg", thread, message.external_id);
}
