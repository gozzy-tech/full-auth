import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DialogModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode; // Customizable content for the dialog body
  showFooter?: boolean; // Whether to show the footer
  onSave?: () => void; // Save button action
  closeOnOverlayClick?: boolean; // Whether the dialog closes when the overlay is clicked
};

export function DialogModal({
  open,
  setOpen,
  title,
  description,
  children,
  showFooter = true,
  onSave,
  closeOnOverlayClick = true,
}: DialogModalProps) {
  return (
    <Dialog open={open} onOpenChange={closeOnOverlayClick ? setOpen : () => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="pt-4 text-center">{title}</DialogTitle>
          {description && <DialogDescription className="text-center">{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4 py-3">{children}</div>
        {showFooter && (
          <DialogFooter>
            <Button type="button" onClick={onSave}>
              Save changes
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
