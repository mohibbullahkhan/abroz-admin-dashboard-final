import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Sidebar />

            {/* Main Content Area */}
            <div className="lg:pl-65 transition-all duration-300">
                <Topbar />
                <main className="p-4 md:p-6 lg:p-8 max-w-400 mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
