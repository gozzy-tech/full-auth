import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Profile from "@/components/settings/profile";
import Settings from "@/components/settings/settings";

const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="w-full max-w-[600px] space-y-2">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and account settings here. You can update your
          personal information, change your password, and enable two-factor
          authentication for added security.
        </p>
      </div>
      <Tabs defaultValue="profile" className="">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Profile className="w-full max-w-[600px]" />
        </TabsContent>
        <TabsContent value="security">
          <Settings className="w-full max-w-[600px]" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
