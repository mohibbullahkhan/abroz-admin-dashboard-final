'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  User as UserIcon, 
  Key, 
  Camera, 
  Save, 
  Eye,
  Loader2
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useGetMeQuery } from '@/store/services/authApi';
import { useUpdateUserProfileMutation } from '@/store/services/profileApi';
import { alerts } from '@/lib/sweetalert';

export default function ProfilePage() {
  const { data: userResponse, isLoading: isUserLoading } = useGetMeQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  
  const user = userResponse?.data;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPreviewImage(user.image || 'https://picsum.photos/400/400?random=101');
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      if (name) formData.append('name', name);
      if (profileImage) formData.append('image', profileImage);
      
      await updateProfile(formData).unwrap();
      alerts.toastSuccess("Profile updated successfully");
    } catch (err: any) {
      alerts.error("Failed to update profile", err?.data?.message || err?.message);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Admin Profile" 
        subtitle="Manage your personal information and account security."
      />

      <div className="max-w-3xl space-y-6">
          <Card className="border border-border shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Camera size={18} className="text-primary" />
                Profile Picture
              </h3>
            </CardHeader>
            <CardBody className="pt-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border border-border bg-[#f2f2f2]">
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary text-sm mb-1">Upload a new profile picture</h4>
                  <p className="text-sm text-text-muted mb-4">JPG, PNG or GIF. Max 2MB recommended.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-[#f8f9fa] border-border text-black font-semibold"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Picture
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border border-border shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <UserIcon size={18} className="text-primary" />
                Personal Information
              </h3>
            </CardHeader>
            <CardBody className="space-y-6 pt-6">
              <div className="space-y-6">
                <Input 
                  label="Full Name" 
                  value={name} 
                  onChange={(e: any) => setName(e.target.value)}
                  className="bg-[#f2f2f2] border-none text-black h-11" 
                />
                <Input 
                  label="Email Address" 
                  value={email} 
                  disabled
                  className="bg-[#f2f2f2] border-none text-black h-11 opacity-70" 
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button 
                  variant="primary" 
                  className="gap-2 px-6 font-bold shadow-sm"
                  onClick={handleSaveProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />} 
                  Save Changes
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="border border-border shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Key size={18} className="text-primary" />
                Security Settings
              </h3>
            </CardHeader>
            <CardBody className="space-y-6 pt-6">
              <div className="space-y-6">
                <Input label="Current Password" type="password" placeholder="Enter current password" suffix={<Eye size={16} />} className="bg-[#f2f2f2] border-none text-black h-11" />
                <Input label="New Password" type="password" placeholder="Enter new password" suffix={<Eye size={16} />} className="bg-[#f2f2f2] border-none text-black h-11" />
                <Input label="Confirm New Password" type="password" placeholder="Confirm new password" suffix={<Eye size={16} />} className="bg-[#f2f2f2] border-none text-black h-11" />
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="primary" className="gap-2 px-6 font-bold shadow-sm">
                  <Save size={16} /> Update Password
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
  );
}
