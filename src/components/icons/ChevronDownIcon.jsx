import React from 'react';

export const ChevronDownIcon = ({ className, size = 64, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
    >
        <path
            d="M32 40.9108L8.66562 18L2 24.5446L32 54L62 24.5446L55.3344 18L32 40.9108Z"
            fill="currentColor"
        />
    </svg>
);
