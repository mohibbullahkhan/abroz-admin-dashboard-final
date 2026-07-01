"use client";

import React, { useState, useEffect } from "react";
import {
    Settings,
    Globe,
    Save,
    Loader2,
    RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { alerts } from "@/lib/sweetalert";
import {
    useGetAdminInfoQuery,
    useUpdateAdminProfileMutation,
} from "@/store/services/adminApi";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("General");

    // ── API hooks ──────────────────────────────────────────────────────────
    const { data: response, isLoading, isFetching, refetch } = useGetAdminInfoQuery();
    const [updateAdminProfile, { isLoading: isSaving }] = useUpdateAdminProfileMutation();

    const adminInfo = response?.data;

    // ── Form state ─────────────────────────────────────────────────────────
    const [businessName, setBusinessName] = useState("");
    const [businessDescription, setBusinessDescription] = useState("");
    const [businessAddress, setBusinessAddress] = useState("");
    const [shippingInfo, setShippingInfo] = useState("");

    // Social fields
    const [facebookPage1, setFacebookPage1] = useState("");
    const [facebookPage2, setFacebookPage2] = useState("");
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [messengerId, setMessengerId] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [websiteLink, setWebsiteLink] = useState("");

    // ── Populate form when data arrives ────────────────────────────────────
    useEffect(() => {
        if (adminInfo) {
            setBusinessName(adminInfo.businessName || "");
            setBusinessDescription(adminInfo.businessDescription || "");
            setBusinessAddress(adminInfo.businessAddress || "");
            setShippingInfo(adminInfo.shippingInfo || "");
            setFacebookPage1(adminInfo.social?.facebookPage1 || "");
            setFacebookPage2(adminInfo.social?.facebookPage2 || "");
            setWhatsappNumber(adminInfo.social?.whatsappNumber || "");
            setMessengerId(adminInfo.social?.messengerId || "");
            setEmailAddress(adminInfo.social?.emailAddress || "");
            setWebsiteLink(adminInfo.social?.websiteLink || "");
        }
    }, [adminInfo]);

    // ── Reset form to API values ───────────────────────────────────────────
    const handleReset = () => {
        if (adminInfo) {
            setBusinessName(adminInfo.businessName || "");
            setBusinessDescription(adminInfo.businessDescription || "");
            setBusinessAddress(adminInfo.businessAddress || "");
            setShippingInfo(adminInfo.shippingInfo || "");
            setFacebookPage1(adminInfo.social?.facebookPage1 || "");
            setFacebookPage2(adminInfo.social?.facebookPage2 || "");
            setWhatsappNumber(adminInfo.social?.whatsappNumber || "");
            setMessengerId(adminInfo.social?.messengerId || "");
            setEmailAddress(adminInfo.social?.emailAddress || "");
            setWebsiteLink(adminInfo.social?.websiteLink || "");
        }
        alerts.toastInfo("Form reset to saved values");
    };

    // ── Save handler ───────────────────────────────────────────────────────
    const handleSave = async () => {
        try {
            await updateAdminProfile({
                businessDescription: businessDescription.trim(),
                businessAddress: businessAddress.trim(),
                shippingInfo: shippingInfo.trim(),
                social: {
                    facebookPage1: facebookPage1.trim(),
                    facebookPage2: facebookPage2.trim(),
                    messengerId: messengerId.trim(),
                    whatsappNumber: whatsappNumber.trim(),
                    emailAddress: emailAddress.trim(),
                    websiteLink: websiteLink.trim(),
                },
            }).unwrap();
            alerts.toastSuccess("Settings saved successfully");
        } catch (err: any) {
            alerts.error(
                "Failed to save settings",
                err?.data?.message || err?.message || "Something went wrong"
            );
        }
    };

    const tabs = [
        { name: "General", icon: Settings },
        { name: "Contact", icon: Globe },
    ];

    // ── Loading skeleton ───────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <PageHeader
                    title="App Settings"
                    subtitle="Configure your global application preferences, contact info, and legal policies."
                />
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-primary w-8 h-8" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PageHeader
                title="App Settings"
                subtitle="Configure your global application preferences, contact info, and legal policies."
            >
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-text-muted hover:text-black hidden md:flex items-center gap-1.5 font-medium"
                    onClick={() => refetch()}
                    disabled={isFetching}
                >
                    <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} /> Refresh
                </Button>
            </PageHeader>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full lg:w-64 shrink-0 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                                activeTab === tab.name
                                    ? "bg-primary text-black shadow-lg"
                                    : "text-text-muted hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5",
                            )}
                        >
                            <tab.icon size={18} />
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-6">
                    {activeTab === "General" && (
                        <Card className="animate-in slide-in-from-right-4 duration-500 border border-border shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <h3 className="font-bold text-lg">
                                    General Settings
                                </h3>
                            </CardHeader>
                            <CardBody className="space-y-6 pt-6">
                                <Input
                                    label="Business Name"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    className="bg-[#f2f2f2] border-none text-black h-11"
                                    disabled
                                />
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-muted">
                                        Business Description
                                    </label>
                                    <textarea
                                        className="w-full min-h-[80px] bg-[#f2f2f2] border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-black resize-none"
                                        value={businessDescription}
                                        onChange={(e) => setBusinessDescription(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-muted">
                                        Business Address
                                    </label>
                                    <textarea
                                        className="w-full min-h-[80px] bg-[#f2f2f2] border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-black resize-none"
                                        value={businessAddress}
                                        onChange={(e) => setBusinessAddress(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-muted">
                                        Shipping Information
                                    </label>
                                    <textarea
                                        className="w-full min-h-[80px] bg-[#f2f2f2] border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-black resize-none"
                                        value={shippingInfo}
                                        onChange={(e) => setShippingInfo(e.target.value)}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    {activeTab === "Contact" && (
                        <Card className="animate-in slide-in-from-right-4 duration-500 border border-border shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <h3 className="font-bold text-lg">
                                    Contact Information
                                </h3>
                            </CardHeader>
                            <CardBody className="space-y-6 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <Input
                                        label="Facebook Page 1"
                                        value={facebookPage1}
                                        onChange={(e) => setFacebookPage1(e.target.value)}
                                        className="bg-[#f2f2f2] border-none text-black h-11"
                                    />
                                    <Input
                                        label="Facebook Page 2"
                                        value={facebookPage2}
                                        onChange={(e) => setFacebookPage2(e.target.value)}
                                        className="bg-[#f2f2f2] border-none text-black h-11"
                                    />
                                    <Input
                                        label="WhatsApp Number"
                                        value={whatsappNumber}
                                        onChange={(e) => setWhatsappNumber(e.target.value)}
                                        className="bg-[#f2f2f2] border-none text-black h-11"
                                    />
                                    <Input
                                        label="Messenger ID"
                                        value={messengerId}
                                        onChange={(e) => setMessengerId(e.target.value)}
                                        className="bg-[#f2f2f2] border-none text-black h-11"
                                    />
                                    <Input
                                        label="Email Address"
                                        value={emailAddress}
                                        onChange={(e) => setEmailAddress(e.target.value)}
                                        className="bg-[#f2f2f2] border-none text-black h-11"
                                    />
                                    <Input
                                        label="Website Link"
                                        value={websiteLink}
                                        onChange={(e) => setWebsiteLink(e.target.value)}
                                        className="bg-[#f2f2f2] border-none text-black h-11"
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Button
                            variant="ghost"
                            className="font-semibold text-text-primary hover:text-black"
                            onClick={handleReset}
                            disabled={isSaving}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="primary"
                            className="px-6 font-bold shadow-sm flex items-center gap-2"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
