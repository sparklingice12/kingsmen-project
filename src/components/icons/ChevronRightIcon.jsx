import React from 'react';

export const ChevronRightIcon = ({ className, size = 64, ...props }) => (
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
            d="M38.9108 32L16 8.66562L22.5446 2L52 32L22.5446 62L16 55.3344L38.9108 32Z"
            fill="currentColor"
        />
    </svg>
);
