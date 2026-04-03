"use client";

import { use } from "react";
import { GDDWorkspace } from "@/components/gdd/gdd-workspace";

export default function GDDSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <GDDWorkspace sessionId={id} />
    </div>
  );
}
