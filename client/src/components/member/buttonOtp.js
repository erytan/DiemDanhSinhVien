import React, { memo } from 'react';

const ButtonOTP = ({ name, handleOnClick, className, iconsBefore, iconAfter, fullWidth }) => {
    return (
        <button
            type='button'
            // `btn ${className}`
            className={`btn btn-primary`} // Sử dụng 'btn' là class cơ bản của nút và thêm className tùy chỉnh
            onClick={handleOnClick}
             style={{
                display: "block",
                width: "40%",
                fontSize: ".8rem",
                borderRadius: "10rem",
                padding: ".75rem 1rem",
                 marginLeft: '10px',
                marginBottom:'1rem',
              }} // Đặt chiều rộng của nút dựa trên fullWidth
        >
            {iconsBefore && <span className="mr-2">{iconsBefore}</span>} {/* Icon trước nút (nếu có) */}
            <span>{name}</span> {/* Tên của nút */}
            {iconAfter && <span className="ml-2">{iconAfter}</span>} {/* Icon sau nút (nếu có) */}
        </button>
    )
}

export default memo(ButtonOTP);
