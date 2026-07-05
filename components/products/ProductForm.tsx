"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import Link from "next/link";
import { useGetCategoriesQuery } from "@/store/services/categoriesApi";
import { useCreateProductMutation, useUpdateProductMutation } from "@/store/services/productsApi";
import { alerts } from "@/lib/sweetalert";
import { Product, Category } from "@/types";

interface ProductFormProps {
    initialData?: Product;
}

const CONDITIONS = ["new", "used"];

export const ProductForm = ({ initialData }: ProductFormProps) => {
    const router = useRouter();

    const { data: categoriesResponse } = useGetCategoriesQuery();
    const categories = categoriesResponse?.data || [];

    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    const isSubmitting = isCreating || isUpdating;

    // Form State
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [features, setFeatures] = useState<string[]>(
        initialData?.features?.length ? initialData.features : [""],
    );

    // Initial category parsing
    let initialCategoryId = "";
    if (initialData?.categoryId) {
        if (typeof initialData.categoryId === 'string') {
            initialCategoryId = initialData.categoryId;
        } else {
            initialCategoryId = (initialData.categoryId as Category)._id;
        }
    }

    const [quantity, setQuantity] = useState<number>(
        initialData?.quantity || 0,
    );

    const [categoryId, setCategoryId] = useState<string>(initialCategoryId);
    const [condition, setCondition] = useState<string>(initialData?.condition || "");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleAddFeature = () => setFeatures([...features, ""]);
    const handleFeatureChange = (index: number, val: string) => {
        const updated = [...features];
        updated[index] = val;
        setFeatures(updated);
    };
    const handleRemoveFeature = (index: number) => {
        if (features.length > 1) {
            setFeatures(features.filter((_, i) => i !== index));
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        // Approximation for files. If we have imageFiles, we try to remove the corresponding file
        // If image is an existing URL (from initialData), it won't have a corresponding File in imageFiles
        // But since we just append files to the end of existing images, the math works if we track it carefully.
        // For simplicity, if we remove an image that is a File, we should remove it from imageFiles.
        
        // Let's just track the state of which ones are existing vs new.
        // If we remove one, it's safer to just let the backend handle the update and we re-upload everything if needed?
        // Actually, the API might not support partial image deletion easily via FormData without a specific parameter.
        // We will just pass `images` strings (the ones left) back? Wait, FormData file upload usually overwrites or appends.
        // Let's just pass the remaining files.
        if (index >= (initialData?.images?.length || 0)) {
            const fileIndex = index - (initialData?.images?.length || 0);
            const newFiles = [...imageFiles];
            newFiles.splice(fileIndex, 1);
            setImageFiles(newFiles);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        const maxSize = 5 * 1024 * 1024; // 5MB
        const validFiles = files.filter(file => {
            if (file.size > maxSize) {
                alerts.error("File Too Large", `Image "${file.name}" exceeds the maximum limit of 5MB.`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0 && files.length > 0) {
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        if (images.length + validFiles.length > 5) {
            alerts.error("Max images reached", "You can only upload up to 5 images.");
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const base64Promises = validFiles.map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
        });

        try {
            const base64Files = await Promise.all(base64Promises);
            setImages((prev) => [...prev, ...base64Files]);
            setImageFiles((prev) => [...prev, ...validFiles]);
        } catch (error) {
            alerts.error("Error", "Failed to read image files.");
        }
        
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent | React.MouseEvent, isDraft: boolean = false) => {
        e.preventDefault();
        if (!formRef.current) return;
        const formData = new FormData(formRef.current);
        
        // Build JSON object
        const payload: any = {};
        formData.forEach((value, key) => {
            if (key === 'images' || key === 'features[]' || key === 'features') return;
            payload[key] = value;
        });

        payload.features = features.filter(f => f.trim() !== "");
        payload.status = isDraft ? 'draft' : 'active';
        payload.quantity = Number(quantity);
        payload.images = images; // Array of base64 strings
        payload.categoryId = categoryId;
        payload.condition = condition;


        try {
            if (initialData) {
                await updateProduct({ _id: initialData._id, body: payload }).unwrap();
                alerts.toastSuccess("Product updated successfully");
            } else {
                await createProduct(payload).unwrap();
                alerts.toastSuccess("Product created successfully");
            }
            router.push("/products");
        } catch (err: any) {
            alerts.error("Failed to save product", err?.data?.message || err?.message);
        }
    };

    return (
        <>
            <form ref={formRef} onSubmit={(e) => handleSubmit(e, false)} className="pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* LEFT COLUMN (60% -> 3/5 cols) */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* SECTION 1 — Basic Information */}
                        <Card>
                            <CardHeader>
                                <h3 className="font-bold text-lg text-text-primary">
                                    Basic Information
                                </h3>
                            </CardHeader>
                            <CardBody className="space-y-6">
                                <Input
                                    label="Product Name"
                                    name="name"
                                    required
                                    defaultValue={initialData?.name}
                                    placeholder="e.g. Komatsu PC200 Arm Pin"
                                />
                                <Input
                                    label="Origin"
                                    name="origin"
                                    required
                                    defaultValue={initialData?.origin}
                                    placeholder="e.g. Japan"
                                />
                                <Input
                                    label="Part Number"
                                    name="partNumber"
                                    required
                                    defaultValue={initialData?.partNumber}
                                    placeholder="e.g. KOM-SA6D102-001"
                                />
                                <Input
                                    label="Brand Name"
                                    name="brandName"
                                    required
                                    defaultValue={initialData?.brandName}
                                    placeholder="e.g. Komatsu, Caterpillar, OEM"
                                />
                            </CardBody>
                        </Card>

                        {/* SECTION 2 — Classification */}
                        <Card>
                            <CardHeader>
                                <h3 className="font-bold text-lg text-text-primary">
                                    Classification
                                </h3>
                            </CardHeader>
                            <CardBody className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-muted">
                                        Category{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        name="categoryId"
                                        required
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="w-full bg-white/5 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-primary"
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {categories.map((cat) => (
                                            <option
                                                key={cat._id}
                                                value={cat._id}
                                                className="bg-[var(--background)] text-[var(--foreground)]"
                                            >
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-muted">
                                        Condition{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        name="condition"
                                        required
                                        value={condition}
                                        onChange={(e) => setCondition(e.target.value)}
                                        className="w-full bg-white/5 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-primary"
                                    >
                                        <option value="" disabled>Select Condition</option>
                                        {CONDITIONS.map((cond) => (
                                            <option
                                                key={cond}
                                                value={cond}
                                                className="bg-[var(--background)] text-[var(--foreground)]"
                                            >
                                                {cond.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Input
                                    label="Compatibility"
                                    name="compatibility"
                                    defaultValue={initialData?.compatibility}
                                    placeholder="e.g. PC200-8, PC210LC-8"
                                />
                            </CardBody>
                        </Card>

                        {/* SECTION 3 — Description */}
                        <Card>
                            <CardHeader>
                                <h3 className="font-bold text-lg text-text-primary">
                                    Description
                                </h3>
                            </CardHeader>
                            <CardBody className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-muted">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        className="w-full bg-white/5 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-text-primary"
                                        placeholder="Full product description..."
                                        defaultValue={initialData?.description}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-muted">
                                        Features
                                    </label>
                                    <div className="space-y-2">
                                        {features.map((feature, idx) => (
                                            <div
                                                key={idx}
                                                className="flex gap-2 items-center"
                                            >
                                                <Input
                                                    placeholder="e.g. High durability material"
                                                    value={feature}
                                                    onChange={(e: any) =>
                                                        handleFeatureChange(
                                                            idx,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="bg-white/5 border-border text-text-primary"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleRemoveFeature(idx)
                                                    }
                                                    className="text-text-muted hover:text-danger hover:bg-danger/10 shrink-0 border border-border bg-white/5 h-11 w-11 rounded-lg"
                                                >
                                                    <X size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleAddFeature}
                                            className="w-full mt-2 border-dashed border-border text-text-muted hover:text-primary hover:border-primary hover:bg-primary/10 transition-colors"
                                        >
                                            <Plus size={16} className="mr-2" />{" "}
                                            Add Another Feature
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-muted">
                                        Shipping Info
                                    </label>
                                    <textarea
                                        name="shippingInfo"
                                        rows={3}
                                        className="w-full bg-white/5 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-text-primary"
                                        placeholder="Delivery and pickup details..."
                                        defaultValue={initialData?.shippingInfo}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-muted">
                                        Condition Notes
                                    </label>
                                    <textarea
                                        name="conditionNotes"
                                        rows={3}
                                        className="w-full bg-white/5 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-text-primary"
                                        placeholder="Inspection and condition details..."
                                        defaultValue={
                                            initialData?.conditionNotes
                                        }
                                    />
                                </div>
                            </CardBody>
                        </Card>

                        {/* SECTION 4 — Images */}
                        <Card>
                            <CardHeader className="flex items-center justify-between">
                                <h3 className="font-bold text-lg text-text-primary">
                                    Images
                                </h3>
                                <span className="text-xs text-text-muted">
                                    {images.length}/5 Images
                                </span>
                            </CardHeader>
                            <CardBody className="space-y-6">
                                <div className="space-y-3">
                                    {images.map((img, i) => (
                                        <div
                                            key={i}
                                            className="flex gap-3 items-center relative"
                                        >
                                            <div className="w-16 h-16 rounded bg-black/5 dark:bg-white/5 border border-border overflow-hidden shrink-0 flex items-center justify-center relative group">
                                                {img ? (
                                                    <img
                                                        src={img}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                        onError={(e) =>
                                                            (e.currentTarget.style.display =
                                                                "none")
                                                        }
                                                        onLoad={(e) =>
                                                            (e.currentTarget.style.display =
                                                                "block")
                                                        }
                                                    />
                                                ) : (
                                                    <span className="text-[10px] text-text-muted">
                                                        No IMG
                                                    </span>
                                                )}
                                                {i === 0 && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-[9px] text-center font-bold text-black py-0.5 uppercase tracking-wider backdrop-blur-sm">
                                                        Featured
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 bg-black/5 dark:bg-white/5 border border-border rounded-lg px-4 py-3 text-sm text-[var(--foreground)] flex items-center">
                                                <span className="truncate max-w-[200px]">
                                                    {img.startsWith("data:image")
                                                        ? `Local file attached (Image ${i + 1})`
                                                        : img}
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveImage(i)
                                                }
                                                className="shrink-0 text-text-muted hover:text-danger hover:bg-danger/10"
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                    {images.length < 5 && (
                                        <label className="flex items-center justify-center gap-2 text-sm border-dashed text-text-muted w-full hover:bg-black/5 dark:hover:bg-white/5 border border-border rounded-lg py-4 cursor-pointer transition-colors mt-2">
                                            <Plus size={16} /> Add Images from
                                            Computer
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    )}
                                    <p className="text-xs text-text-muted mt-2">
                                        The first image will be used as the featured image. Maximum 5 images. Highest 5MB per image.
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN (40% -> 2/5 cols) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* SECTION — Inventory */}
                        <Card className="sticky top-24">
                            <CardHeader>
                                <h3 className="font-bold text-lg text-text-primary">
                                    Inventory & Status
                                </h3>
                            </CardHeader>
                            <CardBody className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-muted">
                                        Available Quantity
                                    </label>
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 15"
                                        value={quantity}
                                        onChange={(e: any) =>
                                            setQuantity(Number(e.target.value))
                                        }
                                        className="bg-white/5 border-border text-text-primary"
                                    />
                                    <p className="text-xs text-text-muted mt-2 leading-relaxed">
                                        Set the stock quantity. If 0, item will be marked "Out of Stock".
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* BOTTOM ACTION BAR */}
                <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-border p-4 z-40 lg:pl-64 transition-all">
                    <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
                        <Link
                            href="/products"
                            className="text-text-muted hover:text-white font-medium text-sm transition-colors"
                        >
                            Cancel
                        </Link>
                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={isSubmitting}
                                className="text-sm bg-white text-black hover:bg-gray-100 border-none font-semibold px-6"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                                Save as Draft
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                                className="text-sm font-bold px-8 shadow-[0_4px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.4)]"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                                Save & Publish
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};
