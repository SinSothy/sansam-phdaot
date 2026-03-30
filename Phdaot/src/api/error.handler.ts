import { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "./types";

// Dynamic import of messages based on locale (client-side helper)
const getLocalizedMessage = (key: string, locale: string = "en", params?: Record<string, any>) => {
  // Simple fallback mechanism for non-component files
  // In a real-world scenario, you might want to use a more robust singleton or provider
  try {
    const messages = require(`../../messages/${locale}.json`);
    let message = key.split('.').reduce((obj, i) => obj[i], messages);
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        message = message.replace(`{${k}}`, v);
      });
    }
    return message || key;
  } catch (e) {
    return key;
  }
};

/**
 * Centralized Error Handler
 * Parses API errors and displays professional localized toast notifications.
 */
export const handleApiError = (error: any) => {
  const locale = typeof document !== "undefined" ? document.documentElement.lang || "en" : "en";
  
  let messageKey = "Errors.unexpected";
  let status = 500;

  if (error instanceof AxiosError) {
    const apiResponse = error.response?.data as ApiResponse<any>;
    status = error.response?.status || 500;

    // 1. Extract message from backend's standard envelope if provided
    if (apiResponse?.message) {
      // If the backend already provides a message, we might use it or map it
      // For now, keep it as is, or you can map common backend messages to keys
      const message = apiResponse.message;
      toast.error(message, {
        description: status !== 500 ? getLocalizedMessage("Errors.errorCode", locale, { code: status }) : undefined,
      });
      return { message, status, originalError: error };
    } 
    
    // 2. Handle specific HTTP status codes
    if (status === 401) {
      messageKey = "Errors.sessionExpired";
    } else if (status === 403) {
      messageKey = "Errors.noPermission";
    } else if (status === 404) {
      messageKey = "Errors.notFound";
    } else if (error.code === "ERR_NETWORK") {
      messageKey = "Errors.network";
    }
  } else if (error instanceof Error) {
    // If it's a generic error, we just show the message
    toast.error(error.message);
    return { message: error.message, status, originalError: error };
  }

  const localizedMessage = getLocalizedMessage(messageKey, locale);

  // Display professional toast notification
  toast.error(localizedMessage, {
    description: status !== 500 ? getLocalizedMessage("Errors.errorCode", locale, { code: status }) : undefined,
  });

  // Log error for internal tracking
  console.error(`[API Error ${status}]:`, error);

  return {
    message: localizedMessage,
    status,
    originalError: error,
  };
};
