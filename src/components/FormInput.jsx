import React from 'react'

const FormInput = ({ name, value, onChange, onBlur, touched, error, placeholder, type = "text" }) => {
    return (
        <div className='flex flex-col mb-5' >
            <label>{name}:</label>
            <input name={name.replace(/\s/g, '').toLowerCase()} value={value} onChange={onChange} onBlur={onBlur} className={`w-full py-3 rounded-xl mt-2 outline-blue-600 ${type === 'file' ? 'text-white' : ' text-black px-5'}`} type={type} accept=".pdf" placeholder={placeholder} required />
            {touched && <span className='first-letter:uppercase text-sm text-red-500 pl-1 mt-1' >{error}</span>}
        </div>
    )
}

export default FormInput