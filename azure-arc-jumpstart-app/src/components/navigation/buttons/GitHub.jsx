import React from "react";
import './GitHub.css';

const GitHub = () => {
    return (
        <a
            className="git-hub-button"
            style={{
                cursor: 'pointer',
                color: 'white',
                textDecoration: 'none'
            }}
            tabIndex={6}
            href='https://github.com/Azure/arc_jumpstart_docs'
            target="_blank"
        >
            GitHub
            <svg
                className="git-hub-frame"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clipPath="url(#clip0_3943_6634)">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.5 0.175049C4.08 0.175049 0.5 3.75505 0.5 8.17505C0.5 11.715 2.79 14.705 5.97 15.765C6.37 15.835 6.52 15.595 6.52 15.385C6.52 15.195 6.51 14.565 6.51 13.895C4.5 14.265 3.98 13.405 3.82 12.955C3.73 12.725 3.34 12.015 3 11.825C2.72 11.675 2.32 11.305 2.99 11.295C3.62 11.285 4.07 11.875 4.22 12.115C4.94 13.325 6.09 12.985 6.55 12.775C6.62 12.255 6.83 11.905 7.06 11.705C5.28 11.505 3.42 10.815 3.42 7.75505C3.42 6.88505 3.73 6.16505 4.24 5.60505C4.16 5.40505 3.88 4.58505 4.32 3.48505C4.32 3.48505 4.99 3.27505 6.52 4.30505C7.16 4.12505 7.84 4.03505 8.52 4.03505C9.2 4.03505 9.88 4.12505 10.52 4.30505C12.05 3.26505 12.72 3.48505 12.72 3.48505C13.16 4.58505 12.88 5.40505 12.8 5.60505C13.31 6.16505 13.62 6.87505 13.62 7.75505C13.62 10.825 11.75 11.505 9.97 11.705C10.26 11.955 10.51 12.435 10.51 13.185C10.51 14.255 10.5 15.115 10.5 15.385C10.5 15.595 10.65 15.845 11.05 15.765C14.21 14.705 16.5 11.705 16.5 8.17505C16.5 3.75505 12.92 0.175049 8.5 0.175049Z"
                        fill="white"
                    />
                </g>
                <defs>
                    <clipPath id="clip0_3943_6634">
                        <rect
                            width="16"
                            height="16"
                            fill="white"
                            transform="translate(0.5 0.175049)"
                        />
                    </clipPath>
                </defs>
            </svg>
        </a>
    )
}

export default GitHub;
