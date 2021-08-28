import React from 'react';

export const renderField = ({meta: {touched, error}, label, input, type, placeholder}) => {
    return (
        <div>
            <label>{label}</label>
            <input {...input} type={type} placeholder={placeholder} />
            {touched && error && <div>{error}</div>}
        </div>
    );
};