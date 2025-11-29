import React from 'react';

export const ChevronLeftIcon = ({ className, size = 64, ...props }) => (
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
            d="M24.0892 32L47 8.66562L40.4554 2L11 32L40.4554 62L47 55.3344L24.0892 32Z"
            fill="currentColor"
        />
    </svg>
);
