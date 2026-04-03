"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateGDDSession } from "@/hooks/use-gdd";

export function GDDNewDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [idea, setIdea] = useState("");
  const t = useTranslations("gdd");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const createSession = useCreateGDDSession();

  const handleCreate = () => {
    createSession.mutate({
      title: title.trim() || undefined,
      initialIdea: idea.trim() || undefined,
    }, {
      onSuccess: (session) => {
        setOpen(false);
        setTitle("");
        setIdea("");
        router.push(`/gdd/${session.id}`);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("newGdd")}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("newGddTitle")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>{t("projectName")}</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("projectNamePlaceholder")}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <p className="text-xs text-muted-foreground">{t("projectNameHint")}</p>
          </div>
          <div className="space-y-2">
            <Label>{t("initialIdea")} <span className="text-muted-foreground font-normal">({tCommon("optional")})</span></Label>
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={t("initialIdeaPlaceholder")}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">{t("initialIdeaHint")}</p>
          </div>
          <Button
            onClick={handleCreate}
            disabled={createSession.isPending}
            className="w-full"
          >
            {createSession.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {t("startDesigning")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
