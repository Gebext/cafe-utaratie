export function CaffeLogo() {
  return (
    <div className="relative">
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        {/* Fish body (Baratie reference) */}
        <ellipse
          cx="40"
          cy="35"
          rx="25"
          ry="15"
          fill="#1e6091"
          className="opacity-90"
        />

        {/* Fish tail */}
        <path d="M15 35 L5 25 L5 45 Z" fill="#1e6091" className="opacity-90" />

        {/* Fish eye */}
        <circle cx="50" cy="30" r="3" fill="white" />
        <circle cx="51" cy="29" r="1.5" fill="#1e6091" />

        {/* Coffee cup on top of fish */}
        <rect
          x="35"
          y="20"
          width="10"
          height="8"
          rx="1"
          fill="#8B4513"
          stroke="#654321"
          strokeWidth="0.5"
        />

        {/* Coffee cup handle */}
        <path
          d="M45 22 Q48 22 48 25 Q48 28 45 28"
          stroke="#654321"
          strokeWidth="1"
          fill="none"
        />

        {/* Steam from coffee */}
        <path
          d="M37 18 Q38 15 37 12"
          stroke="#1e6091"
          strokeWidth="1"
          fill="none"
          className="opacity-60"
        />
        <path
          d="M40 18 Q41 15 40 12"
          stroke="#1e6091"
          strokeWidth="1"
          fill="none"
          className="opacity-60"
        />
        <path
          d="M43 18 Q42 15 43 12"
          stroke="#1e6091"
          strokeWidth="1"
          fill="none"
          className="opacity-60"
        />

        {/* Anchor at bottom */}
        <g transform="translate(35, 50)">
          <rect x="4" y="0" width="2" height="15" fill="#1e6091" />
          <circle
            cx="5"
            cy="3"
            r="2"
            stroke="#1e6091"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M0 12 L5 15 L10 12"
            stroke="#1e6091"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M2 15 Q0 17 2 19"
            stroke="#1e6091"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M8 15 Q10 17 8 19"
            stroke="#1e6091"
            strokeWidth="1.5"
            fill="none"
          />
        </g>

        {/* Decorative waves */}
        <path
          d="M10 65 Q15 62 20 65 Q25 68 30 65 Q35 62 40 65 Q45 68 50 65 Q55 62 60 65 Q65 68 70 65"
          stroke="#1e6091"
          strokeWidth="1.5"
          fill="none"
          className="opacity-40"
        />
      </svg>
    </div>
  );
}
