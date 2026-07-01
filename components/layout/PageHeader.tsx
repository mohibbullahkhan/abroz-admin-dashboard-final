import React from "react";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, children }: PageHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-sm text-text-muted">{subtitle}</p>
                )}
            </div>
            <div className="flex items-center gap-3">{children}</div>
        </div>
    );
};
