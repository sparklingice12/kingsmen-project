export const DoubleChevronRightIcon = ({ className, size = 96, ...props }) => (
    <svg
        width={size}
        height={size * (64 / 96)}
        viewBox="0 0 96 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
    >
        <g transform="translate(96, 0) scale(-1, 1)">
            <path
                d="M24.0892 32L47 8.66562L40.4554 2L11 32L40.4554 62L47 55.3344L24.0892 32Z"
                fill="currentColor"
            />
            <path
                d="M56.0892 32L79 8.66562L72.4554 2L43 32L72.4554 62L79 55.3344L56.0892 32Z"
                fill="currentColor"
            />
        </g>
    </svg>
);
