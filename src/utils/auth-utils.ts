import type { ErrorContext } from "better-auth/react";
import { toast } from "react-toastify";

export const handleAuthError = (ctx: ErrorContext) => {
  const { error, request, response } = ctx;
  toast.error(
    error?.message || `Failed: ${error?.statusText || "Internal server error"}`
  );

  console.error("[Auth Error]", {
    url: request.url,
    status: error.status,
    statusText: error.statusText,
    message: error.message,
    error: error.error,
    request,
    response,
  });
};

export const handleAuthSuccess = (message: string) => {
  toast.success(message);
};
