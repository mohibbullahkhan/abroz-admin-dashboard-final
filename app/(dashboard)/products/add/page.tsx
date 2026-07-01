import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductForm } from "@/components/products/ProductForm";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4">
                <Link href="/products">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full border border-border"
                    >
                        <ArrowLeft size={18} />
                    </Button>
                </Link>
                <PageHeader
                    title="Add New Product"
                    subtitle="List a new heavy machinery part in the Abroz Parts+ inventory."
                />
            </div>

            <ProductForm />
        </div>
    );
}
