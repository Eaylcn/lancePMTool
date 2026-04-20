"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Save, X, Loader2, Pencil, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useUpdateProfile } from "@/hooks/use-profile";

interface ProfileEditFormProps {
  profile: {
    fullName: string;
    username: string;
    title: string;
    bio: string;
  };
  onClose: () => void;
}

const BIO_MAX = 280;

export function ProfileEditForm({ profile, onClose }: ProfileEditFormProps) {
  const t = useTranslations("profile");
  const updateProfile = useUpdateProfile();

  const [fullName, setFullName] = useState(profile.fullName);
  const [title, setTitle] = useState(profile.title);
  const [bio, setBio] = useState(profile.bio);
  const [username, setUsername] = useState(profile.username);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    try {
      await updateProfile.mutateAsync({ fullName, title, bio, username });
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error";
      if (message.includes("already taken")) {
        setError(t("form.usernameTaken"));
      } else {
        setError(message);
      }
    }
  };

  return (
    <Card className="p-5 space-y-5 border-primary/30 ring-1 ring-primary/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Pencil className="h-3.5 w-3.5 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">{t("editProfile")}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium">{t("form.fullName")}</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("form.fullNamePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium">{t("form.title")}</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("form.titlePlaceholder")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">{t("form.bio")}</Label>
          <span
            className={`text-[11px] tabular-nums ${
              bio.length > BIO_MAX
                ? "text-red-500"
                : "text-muted-foreground"
            }`}
          >
            {bio.length}/{BIO_MAX}
          </span>
        </div>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={t("form.bioPlaceholder")}
          rows={3}
          maxLength={BIO_MAX}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">{t("form.username")}</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            @
          </span>
          <Input
            value={username}
            onChange={(e) =>
              setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
            }
            placeholder={t("form.usernamePlaceholder")}
            className="pl-7"
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          {t("form.usernameHint", { username: username || "username" })}
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="text-xs">{error}</p>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-2 border-t border-border/60">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={updateProfile.isPending}
        >
          <X className="h-3.5 w-3.5 mr-1.5" />
          {t("cancel")}
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={updateProfile.isPending || bio.length > BIO_MAX}
        >
          {updateProfile.isPending ? (
            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5 mr-1.5" />
          )}
          {t("saveProfile")}
        </Button>
      </div>
    </Card>
  );
}
