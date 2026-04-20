"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { UpgradeDialog } from "./premium-gate";
import { onPremiumRequired } from "@/lib/auth/premium-error";

export function PremiumListener() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("premium");

  useEffect(() => {
    return onPremiumRequired(() => setOpen(true));
  }, []);

  return <UpgradeDialog open={open} onOpenChange={setOpen} t={t} />;
}
