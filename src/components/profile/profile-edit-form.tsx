"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Save, X, Loader2 } from "lucide-react";
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
    <Card className="p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("form.fullName")}</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>{t("form.title")}</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("form.titlePlaceholder")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("form.bio")}</Label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={t("form.bioPlaceholder")}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("form.username")}</Label>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
          placeholder={t("form.usernamePlaceholder")}
        />
        <p className="text-xs text-muted-foreground">
          {t("form.usernameHint", { username: username || "username" })}
        </p>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onClose}>
          <X className="h-3.5 w-3.5 mr-1.5" />
          {t("cancel")}
        </Button>
        <Button size="sm" onClick={handleSave} disabled={updateProfile.isPending}>
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
