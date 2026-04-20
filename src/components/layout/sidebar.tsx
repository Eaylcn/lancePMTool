"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Library,
  Gamepad2,
  GitCompareArrows,
  TrendingUp,
  MessageSquare,
  ListTodo,
  BarChart3,
  ClipboardList,
  BookOpen,
  FileEdit,
  User,
  Settings,
  Sun,
  Moon,
  PanelLeftClose,
  LogOut,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

interface NavItem {
  href: string;
  icon: React.ElementType;
  labelKey: string;
}

const coreNav: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/library", icon: Library, labelKey: "library" },
  { href: "/analyze/new", icon: Gamepad2, labelKey: "analyze" },
  { href: "/compare", icon: GitCompareArrows, labelKey: "compare" },
];

const growthNav: NavItem[] = [
  { href: "/growth", icon: TrendingUp, labelKey: "growth" },
  { href: "/interview", icon: MessageSquare, labelKey: "interview" },
  { href: "/tasks", icon: ListTodo, labelKey: "tasks" },
];

const toolsNav: NavItem[] = [
  { href: "/gdd", icon: FileEdit, labelKey: "gdd" },
  { href: "/metrics", icon: BarChart3, labelKey: "metrics" },
  { href: "/surveys", icon: ClipboardList, labelKey: "surveys" },
];

const learnNav: NavItem[] = [
  { href: "/guide", icon: BookOpen, labelKey: "guide" },
];

const accountNav: NavItem[] = [
  { href: "/profile", icon: User, labelKey: "profile" },
  { href: "/settings", icon: Settings, labelKey: "settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const tTheme = useTranslations("theme");
  const tSettings = useTranslations("settings");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      window.location.assign(`/${locale}/login`);
    } catch {
      setSigningOut(false);
    }
  };

  const isActive = (href: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(tr|en)/, "");
    return pathWithoutLocale === href || pathWithoutLocale.startsWith(href + "/");
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);

    const link = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
          collapsed && "justify-center px-2",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
        {!collapsed && <span>{t(item.labelKey)}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger render={link} />
          <TooltipContent side="right" sideOffset={10}>
            {t(item.labelKey)}
          </TooltipContent>
        </Tooltip>
      );
    }

    return link;
  };

  const renderNavGroup = (items: NavItem[], label?: string) => (
    <div className="space-y-1">
      {label && !collapsed && (
        <p className="px-3 mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
          {label}
        </p>
      )}
      {items.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
    </div>
  );

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full border-r border-border bg-sidebar transition-all duration-300 ease-in-out overflow-hidden",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      {/* Logo + Collapse Toggle */}
      <div
        className={cn(
          "flex items-center h-14 px-4 border-b border-border",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted transition-colors"
          >
            <img src="/icon.svg" alt="Lance" className="h-5 w-5" />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <img src="/icon.svg" alt="Lance" className="h-6 w-6 shrink-0" />
              <span className="text-lg font-bold tracking-tight">Lance</span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-4">
        {renderNavGroup(coreNav, "Core")}
        <Separator className="mx-2" />
        {renderNavGroup(growthNav, "Growth")}
        <Separator className="mx-2" />
        {renderNavGroup(toolsNav, "Tools")}
        <Separator className="mx-2" />
        {renderNavGroup(learnNav, "Learn")}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border p-2 space-y-1">
        {renderNavGroup(accountNav)}

        <Separator className="my-2" />

        {/* Theme Toggle */}
        {mounted && (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 w-full",
                    collapsed && "justify-center px-2"
                  )}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 shrink-0" />
                  ) : (
                    <Moon className="h-4 w-4 shrink-0" />
                  )}
                  {!collapsed && (
                    <span>
                      {theme === "dark" ? tTheme("light") : tTheme("dark")}
                    </span>
                  )}
                </button>
              }
            />
            {collapsed && (
              <TooltipContent side="right" sideOffset={10}>
                {theme === "dark" ? tTheme("light") : tTheme("dark")}
              </TooltipContent>
            )}
          </Tooltip>
        )}

        {/* Quick Sign Out */}
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                onClick={() => setSignOutOpen(true)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 w-full",
                  collapsed && "justify-center px-2"
                )}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{tSettings("signOut")}</span>}
              </button>
            }
          />
          {collapsed && (
            <TooltipContent side="right" sideOffset={10}>
              {tSettings("signOut")}
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      <ConfirmDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        title={tSettings("signOutConfirmTitle")}
        description={tSettings("signOutConfirmDescription")}
        confirmLabel={tSettings("signOut")}
        onConfirm={handleSignOut}
        loading={signingOut}
        variant="destructive"
      />
    </aside>
  );
}
