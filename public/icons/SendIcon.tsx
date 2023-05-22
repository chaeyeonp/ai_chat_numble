import {IconProps} from "../../types";

const SendIcon = (props?: IconProps) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            fillRule="evenodd"
            fill="currentColor"
            d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"
        />
    </svg>
);
export default SendIcon;
