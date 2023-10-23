import "./MenuItemDisabled.css";

const MenuItemDisabled = ({ ...props }) => {
  return (
    <div className="menu-item-disabled">
      <div className="menu-item-disabled-start-content">
        {showIcon && (
          <>
            <svg
              className="menu-item-disabled-regular-icon"
              width="16"
              height="21"
              viewBox="0 0 16 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 16C10.7614 16 13 13.7614 13 11C13 8.23858 10.7614 6 8 6C5.23858 6 3 8.23858 3 11C3 13.7614 5.23858 16 8 16ZM14 11C14 14.3137 11.3137 17 8 17C4.68629 17 2 14.3137 2 11C2 7.68629 4.68629 5 8 5C11.3137 5 14 7.68629 14 11ZM7.35355 8.14645L9.85355 10.6464C10.0488 10.8417 10.0488 11.1583 9.85355 11.3536L7.35355 13.8536C7.15829 14.0488 6.84171 14.0488 6.64645 13.8536C6.45118 13.6583 6.45118 13.3417 6.64645 13.1464L8.79289 11L6.64645 8.85355C6.45118 8.65829 6.45118 8.34171 6.64645 8.14645C6.84171 7.95118 7.15829 7.95118 7.35355 8.14645Z"
                fill="#9E9E9E"
              />
            </svg>
          </>
        )}
        <div className="menu-item-disabled-content-frame">
          <div className="menu-item-disabled-list-item-text">Action </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDisabled;

