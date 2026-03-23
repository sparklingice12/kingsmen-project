import { useGameTranslation } from '@/hooks/useGameTranslation';

export function TimerCurvedText({ text }) {
  const { currentLang } = useGameTranslation();

  // Create a unique path ID for this instance
  const pathId = `timer-curve-${Math.random().toString(36).substr(2, 9)}`;

  // The background SVG (end-session.svg) has:
  // viewport: 0 0 469 459
  // outer circle: cx=349, cy=339, r=279
  // inner circle: cx=349, cy=339, r=200
  // Radius 235 centers it better in the cream ring.
  const radius = 225;
  const cx = 349;
  const cy = 339;

  // Adjust font size for Kazakh
  const fontSize = currentLang === 'kk' ? "42" : "48";

  return (
    <svg
      width="469"
      height="459"
      viewBox="0 0 469 459"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* A much longer arc to prevent clipping. 
            Starts at 90 deg (bottom) and goes CW to 0 deg (right) via left and top.
            This covers 270 degrees, giving plenty of room for long translations.
        */}
        <path
          id={pathId}
          d={`M ${cx}, ${cy + radius} A ${radius}, ${radius} 0 1, 1 ${cx + radius}, ${cy}`}
          fill="transparent"
        />
      </defs>

      {/* Curved text */}
      <text
        fontSize={fontSize}
        fontWeight="400"
        fill="#F9C015"
        letterSpacing="0.01em"
        style={{
          textTransform: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        <textPath
          href={`#${pathId}`}
          startOffset="50%"
          textAnchor="middle"
        >
          {text}
        </textPath>
      </text>
    </svg>
  );
}
