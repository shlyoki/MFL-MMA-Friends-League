// src/components/ui/button.jsx
import React from "react";

// tiny cx helper (no deps)
function cx(...a) { return a.flat().filter(Boolean).join(" "); }

const variants = {
  default: "bg-black text-white hover:opacity-90",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  outline: "border border-gray-300 text-gray-900 hover:bg-gray-50",
  ghost: "bg-transparent hover:bg-gray-100",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export const Button = React.forwardRef(function Button(
  { className = "", variant = "default", size = "md", asChild = false, ...props },
  ref
) {
  const Comp = asChild ? "span" : "button";
  return (
    <Comp
      ref={ref}
      className={cx(
        "inline-flex items-center justify-center rounded-xl transition-colors disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",
        variants[variant] || variants.default,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    />
  );
});

export default { Button };
