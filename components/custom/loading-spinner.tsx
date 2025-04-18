"use client";

import { CgSpinner } from "react-icons/cg";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  message = "Processing...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <span className={`flex items-center justify-center gap-2 ${className}`}>
      <CgSpinner className="animate-spin" />
      {message}
    </span>
  );
}
