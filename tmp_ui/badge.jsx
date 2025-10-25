import React from "react";

export function Badge({ variant = "default", className = "", ...props }) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-gray-200 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border text-gray-800",
  };
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border-transparent";
  const styles = variants[variant] ?? variants.default;
  return <span className={`${base} ${styles} ${className}`} {...props} />;
}
export default { Badge };
