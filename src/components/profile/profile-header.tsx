"use client";

import { useTranslations } from "next-intl";
import { Pencil, Share2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PmLevelBadge } from "@/components/growth/pm-level-badge";

interface ProfileHeaderProps {
  profile: {
    fullName: string;
    username: string;
    avatarUrl: string;
    title: string;
    bio: string;
    createdAt: string;
  };
  pmLevel: string;
  onEdit: () => void;
  onShare: () => void;
  readOnly?: boolean;
}

export function ProfileHeader({ profile, pmLevel, onEdit, onShare, readOnly = false }: ProfileHeaderProps) {
  const t = useTranslations("profile");

  const initials = profile.fullName
    ? profile.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "PM";

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4">
      <Avatar className="h-20 w-20 border-2 border-border">
        <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
        <AvatarFallback className="text-lg font-bold">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl font-bold">{profile.fullName || "PM Adayı"}</h2>
          <PmLevelBadge level={pmLevel} size="sm" />
        </div>

        {profile.title && (
          <p className="text-sm text-muted-foreground">{profile.title}</p>
        )}

        {profile.bio && (
          <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>
        )}

        {profile.username && (
          <p className="text-xs text-muted-foreground">@{profile.username}</p>
        )}

        {profile.createdAt && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Calendar className="h-3 w-3" />
            {t("memberSince")}: {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {!readOnly && (
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            {t("editProfile")}
          </Button>
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="h-3.5 w-3.5 mr-1.5" />
            {t("sharePortfolio")}
          </Button>
        </div>
      )}
    </div>
  );
}
