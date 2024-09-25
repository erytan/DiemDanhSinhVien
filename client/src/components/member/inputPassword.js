import React from 'react';

const InputField = ({ value, setValue, nameKey, type, invalidFields, setInvalidFields }) => {
    return (
        <div className='w-full'>
            <input
                type="password"
                className="form-control form-control-user"
                style={{
                  fontSize: ".8rem",
                  borderRadius: "10rem",
                  padding: "1.5rem 1rem",
                }}
                placeholder="Password"
            />
        </div>
    );
};

export default InputField
