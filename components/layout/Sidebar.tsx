"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutGrid,
    Box,
    Tag,
    BarChart3,
    FileText,
    Bell,
    Image as ImageIcon,
    Clock,
    Settings,
    User,
    ChevronLeft,
    ChevronRight,
    Package,
    Menu,
    X,
    MessageSquare,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "../ui/Avatar";
import { useGetMeQuery } from "@/store/services/authApi";

const MENU_ITEMS = [
    {
        group: "MAIN",
        items: [
            { label: "Dashboard", icon: LayoutGrid, href: "/" },
            { label: "Products", icon: Box, href: "/products" },
            { label: "Categories", icon: Tag, href: "/categories" },
        ],
    },
    /* hidden for now
  { group: 'INSIGHTS', items: [
    { label: 'Analytics', icon: BarChart3, href: '/analytics' },
    { label: 'Reports', icon: FileText, href: '/reports' },
  ]},
  */
    {
        group: "MANAGEMENT",
        items: [
            { label: "SMS Broadcast", icon: MessageSquare, href: "/sms-broadcast" },
            { label: "Settings", icon: Settings, href: "/settings" },
        ],
    },
    {
        group: "ACCOUNT",
        items: [{ label: "Profile", icon: User, href: "/profile" }],
    },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const { data: userResponse } = useGetMeQuery();
    const user = userResponse?.data;

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    const handleLogout = () => {
        document.cookie = "auth=; path=/; max-age=0";
        router.push("/login");
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleMobile}
                className="fixed top-4 left-4 z-50 p-2 bg-white text-black rounded-lg border border-border lg:hidden shadow-sm"
            >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Backdrop for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={toggleMobile}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-full bg-white border-r border-border transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-[72px]" : "w-[260px]",
                    isMobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0",
                )}
            >
                {/* Logo Section */}
                <div className="flex items-center h-16 px-4 border-b border-border">
                    <div className="flex items-center gap-3 overflow-hidden">
                        {!isCollapsed ? (
                            <Image
                                src="/Logo.png"
                                alt="Abroz Parts+ Logo"
                                width={160}
                                height={40}
                                className="w-auto h-8 object-contain"
                            />
                        ) : (
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black">
                                <Package size={20} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex flex-col h-[calc(100%-144px)] overflow-y-auto py-4 scrollbar-hide">
                    {MENU_ITEMS.map((section, idx) => (
                        <div
                            key={section.group}
                            className={cn("mb-6", idx === 0 && "mt-2")}
                        >
                            {!isCollapsed && (
                                <h3 className="px-6 mb-2 text-xs font-semibold text-text-muted tracking-wider uppercase">
                                    {section.group}
                                </h3>
                            )}
                            <div className="space-y-1 px-3">
                                {section.items?.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative overflow-hidden",
                                                isActive
                                                    ? "bg-primary/10 text-primary amber-glow"
                                                    : "text-text-muted hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5",
                                            )}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                            )}
                                            <item.icon
                                                size={20}
                                                className={cn(
                                                    "flex-shrink-0 transition-transform",
                                                    isActive && "scale-110",
                                                )}
                                            />
                                            {!isCollapsed && (
                                                <span className="text-sm font-medium transition-opacity duration-300">
                                                    {item.label}
                                                </span>
                                            )}
                                            {isCollapsed && (
                                                <div className="absolute left-full ml-6 px-2 py-1 bg-card border border-border rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                                    {item.label}
                                                </div>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Admin Section */}
                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-border bg-white">
                    <div
                        className={cn(
                            "flex items-center gap-3",
                            isCollapsed ? "justify-center" : "px-2",
                        )}
                    >
                        {user?.image ? (
                            <img 
                                src={user.image} 
                                alt={user.name || "User"} 
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 p-0.5"
                            />
                        ) : (
                            <Avatar
                                name={user?.name || "Loading..."}
                                size="sm"
                                className="ring-2 ring-primary/20"
                            />
                        )}
                        {!isCollapsed && (
                            <>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate text-text-primary">
                                        {user?.name || "Loading..."}
                                    </p>
                                    <p className="text-xs text-text-muted truncate">
                                        {user?.email || "..."}
                                    </p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors flex-shrink-0"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Collapse Toggle Button (Desktop Only) */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors hidden lg:flex"
                >
                    {isCollapsed ? (
                        <ChevronRight size={14} />
                    ) : (
                        <ChevronLeft size={14} />
                    )}
                </button>
            </aside>
        </>
    );
};
