import { Verify2FAForm } from "@/components/auth/verify-2FA";
import { GalleryVerticalEnd } from "lucide-react";
import React from "react";

const Verify2FACodePage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 ">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Full Auth
        </a>
        <Verify2FAForm />
      </div>
    </div>
  );
};

export default Verify2FACodePage;
