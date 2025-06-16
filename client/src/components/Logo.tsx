import React from "react";

export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="20" height="20" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="4" y="4" width="16" height="4" fill="currentColor" />
      <rect x="4" y="10" width="16" height="2" fill="currentColor" />
      <rect x="4" y="14" width="10" height="1" fill="currentColor" />
      <rect x="4" y="16" width="10" height="1" fill="currentColor" />
      <rect x="4" y="18" width="10" height="1" fill="currentColor" />
    </svg>
  );
}