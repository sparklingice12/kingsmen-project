import React from 'react';

export const CloseIcon = ({ className, size = 64, ...props }) => (
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
            d="M53.8631 2.00001L61.432 9.26617L10.5689 62.2486L3 54.9824L53.8631 2.00001Z"
            fill="currentColor"
        />
        <path
            d="M10.893 2.00001L3.3241 9.26617L54.1872 62.2486L61.7561 54.9824L10.893 2.00001Z"
            fill="currentColor"
        />
    </svg>
);
