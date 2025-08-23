import { ComponentProps } from "react";

export const LogoSvg = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="338"
      height="86"
      viewBox="0 0 338 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="2" y="2" width="334" height="82" rx="8" fill="#1D1D1D" />
      <rect
        x="2"
        y="2"
        width="334"
        height="82"
        rx="8"
        stroke="url(#paint0_linear_2004_3)"
        stroke-width="4"
      />
      <path
        d="M59.571 20.2H79.283L87.923 33.064V59.688L82.803 65H59.571V20.2ZM64.691 24.808V60.392H80.691L82.739 58.28V33.704L76.787 24.808H64.691ZM102.426 20.2H120.602L125.658 27.88V59.688L120.602 65H102.426L97.242 57.32V25.512L102.426 20.2ZM102.362 56.68L104.858 60.392H118.554L120.474 58.28V28.52L118.042 24.808H104.346L102.362 26.92V56.68ZM141.889 20.2H159.873L164.097 26.6L160.833 30.056L157.441 24.808H143.809L141.825 26.92V56.68L144.321 60.392H157.825L161.665 56.552L164.225 60.392L159.873 65H141.825L136.705 57.32V25.512L141.889 20.2ZM197.864 20.2H204.584L187.048 37.992L205.544 65H200.04L183.784 41.384L175.976 49.576V65H170.856V20.2H175.976V42.92L197.864 20.2ZM235.599 20.2H240.783V65H235.599V61.864L230.479 65H217.551L212.367 57.32V20.2H217.487V56.68L219.983 60.392H233.551L235.599 58.28V20.2ZM250.806 20.2H273.974L279.094 27.88V38.248L273.974 43.432H255.926V65H250.806V20.2ZM255.99 24.808V41.896L261.174 38.888H271.99L273.974 36.84V28.584L271.478 24.808H255.99Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2004_3"
          x1="2"
          y1="43"
          x2="336"
          y2="43"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#6B51FF" />
          <stop offset="0.519231" stop-color="#E12AFB" />
          <stop offset="1" stop-color="#FD9A00" />
        </linearGradient>
      </defs>
    </svg>
  );
};
