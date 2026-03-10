import React from "react";

interface LogoProps {
  size?: number;
  color?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 64,
  color = "#1a1a1a",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      width={size}
      height={size}
    >
      <path
        d="M4 2h20c1.1 0 2 .9 2 2v26l-12-8-12 8V4c0-1.1.9-2 2-2z"
        fill={color}
      />
      <path d="M20 2h6l-6 6V2z" fill="#f5f5f0" opacity="0.3" />
      <path d="M15 6l-5 10h4l-1 10 7-12h-4.5L15 6z" fill="#f5f5f0" />
    </svg>
  );
};
