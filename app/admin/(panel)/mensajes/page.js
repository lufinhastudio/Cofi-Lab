import { requireAdminPage } from "@/lib/server/admin";
import { MessagesInbox } from "@/components/admin/MessagesInbox";
import { listMessages } from "@/lib/server/collections";

export const metadata = { title: { absolute: "Mensajes · Panel CoFi" } };

export default async function AdminMessagesPage() {
  await requireAdminPage();
  return <MessagesInbox initialMessages={await listMessages()} />;
}
