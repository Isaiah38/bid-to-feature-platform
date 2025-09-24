import { useEffect } from "react";
import type { FC } from "react";
import { motion } from "framer-motion";
import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from "./icons";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface ToastProps extends Notification {
  onDismiss: (id: string) => void;
}

const typeClasses = {
  info: {
    bg: "bg-blue-50",
    icon: "text-blue-500",
    message: "text-blue-800",
    close: "text-blue-500 hover:bg-blue-100",
  },
  success: {
    bg: "bg-green-50",
    icon: "text-green-500",
    message: "text-green-800",
    close: "text-green-500 hover:bg-green-100",
  },
  warning: {
    bg: "bg-yellow-50",
    icon: "text-yellow-500",
    message: "text-yellow-800",
    close: "text-yellow-500 hover:bg-yellow-100",
  },
  error: {
    bg: "bg-red-50",
    icon: "text-red-500",
    message: "text-red-800",
    close: "text-red-500 hover:bg-red-100",
  },
};

const Icons: Record<NotificationType, FC<{ className?: string }>> = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

export const Toast: FC<ToastProps> = ({ id, type, message, duration = 5000, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const Icon = Icons[type];
  const classes = typeClasses[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`rounded-md ${classes.bg} p-4 shadow-lg`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${classes.icon}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${classes.message}`}>{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={() => onDismiss(id)}
              className={`inline-flex rounded-md p-1.5 ${classes.close} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50`}
            >
              <span className="sr-only">Dismiss</span>
              <CloseIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
