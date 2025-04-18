import { useLogout } from "@/api/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { removeToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "../custom/loading-spinner";

type LogoutModalProps = {
  open: boolean;
  handleToggle: (open: boolean) => void;
};

const LogoutModal = ({ open, handleToggle }: LogoutModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const Logout = async () => {
    setSubmitting(true);
    const response = await useLogout();
    if (response?.status >= 200 && response?.status < 300) {
      toast.success(response?.data?.message || "Logout successful!");
      removeToken();
      router.push("/login");
    } else {
      toast.error(response?.message || "Login failed.");
    }
    setSubmitting(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleToggle}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Are you sure you want to logout?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={Logout}>
            {submitting ? (
              <LoadingSpinner message="signing out..." />
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutModal;
