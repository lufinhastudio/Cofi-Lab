import { adminRoute, readBody } from "@/lib/server/admin";
import { deleteMessage, setMessageRead } from "@/lib/server/collections";

export const PATCH = adminRoute(
  async ({ request, params }) => {
    const { read } = await readBody(request, 1024);
    return { message: await setMessageRead(params.id, Boolean(read)) };
  },
  { scope: "admin-message" }
);

export const DELETE = adminRoute(
  async ({ params }) => {
    await deleteMessage(params.id);
    return { ok: true };
  },
  { scope: "admin-message" }
);
