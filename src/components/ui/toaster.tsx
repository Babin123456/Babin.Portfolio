import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const titleStr = typeof title === "string" ? title.toLowerCase() : "";
        const isSuccess =
          variant !== "destructive" &&
          (titleStr.includes("sent") ||
            titleStr.includes("copied") ||
            titleStr.includes("success"));
        const isError =
          variant === "destructive" ||
          titleStr.includes("failed") ||
          titleStr.includes("error");

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3 w-full">
              {isSuccess && (
                <div className="mt-0.5 shrink-0 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5 animate-in zoom-in-50 duration-300" />
                </div>
              )}
              {isError && (
                <div className="mt-0.5 shrink-0 text-red-400">
                  <AlertCircle className="h-5 w-5 animate-in zoom-in-50 duration-300" />
                </div>
              )}
              {!isSuccess && !isError && (
                <div className="mt-0.5 shrink-0 text-cyan-400">
                  <Info className="h-5 w-5 animate-in zoom-in-50 duration-300" />
                </div>
              )}
              <div className="grid gap-0.5 flex-1 min-w-0">
                {title && <ToastTitle className="text-sm font-semibold truncate sm:whitespace-normal">{title}</ToastTitle>}
                {description && <ToastDescription className="text-xs text-muted-foreground leading-relaxed break-words">{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
