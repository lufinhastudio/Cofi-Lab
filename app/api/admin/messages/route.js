import { adminRoute } from "@/lib/server/admin";
import { listMessages } from "@/lib/server/collections";

export const GET = adminRoute(async () => ({ messages: await listMessages() }), { scope: "admin-messages" });
