import { IconProps } from "../../types";

const PlusIcon = (props?: IconProps) => {
  return (
    <svg
      // width="20"
      // height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <line
        x1="4"
        y1="10"
        x2="16"
        y2="10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="10"
        y1="16"
        x2="10"
        y2="4"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
};

export default PlusIcon;
