import React from "react";

export function Card({ className = "", ...props }) {
  return <div className={`rounded-2xl border shadow-sm bg-white ${className}`} {...props} />;
}
export function CardHeader({ className = "", ...props }) {
  return <div className={`p-4 border-b ${className}`} {...props} />;
}
export function CardTitle({ className = "", ...props }) {
  return <h3 className={`text-lg font-semibold ${className}`} {...props} />;
}
export function CardDescription({ className = "", ...props }) {
  return <p className={`text-sm text-gray-500 ${className}`} {...props} />;
}
export function CardContent({ className = "", ...props }) {
  return <div className={`p-4 ${className}`} {...props} />;
}
export function CardFooter({ className = "", ...props }) {
  return <div className={`p-4 border-t ${className}`} {...props} />;
}
export default { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
