import React from 'react';


interface listItemProps {
    label:string;
    onClick?:( e:React.MouseEvent) => void;
    disabled?:boolean;
    outline?:boolean;
    small?:boolean;
}

const Button: React.FC<listItemProps> = ({
    label,
    onClick,
    disabled,
    outline,
    small
}) => {
    return (
        <div
          disabled={disabled}
          onClick={onClick}
          className={`
            flex-col
            disabled:opacity-70
            disabled:cursor-not-allowed
            rounded-lg
            hover:opacity-80
            transition
            w-full
            ${outline ? 'bg-white' : 'bg-indigo-500'}
            ${outline ? 'border-black' : 'border-rose-500'}
            ${outline ? 'text-black' : 'text-white'}
            ${small ? 'text-sm' : 'text-md'}          
            ${small ? 'py-1' : 'py-3'}          
            ${small ? 'font-lignt' : 'font-semibold'}          
            ${small ? 'border-[1px]' : 'border-2'}          
          `}
        >
            <div 
              className={`
                float-start
                border-slate-200
                bg-slate-200
              `}
              >
                {label}
            </div>
           
        </div>
    )
}

export default Button;
