import React from 'react';


interface ButtonProps {
    label:string;
    outline?:boolean;
    small?:boolean;
}

const ListContainer: React.FC<ButtonProps> = ({
    label,
    outline,
    small
}) => {
    return (
        <section
          className={`
            relative
            disabled:opacity-70
            disabled:cursor-not-allowed
            border-slate-200
            bg-slate-200
            rounded-lg
            hover:opacity-80
            transition
            w-full
            ${outline ? 'bg-slate-200' : ''}
            ${outline ? 'border-slate-200' : 'border-rose-500'}
            ${outline ? 'text-black' : 'text-white'}
            ${small ? 'text-sm' : 'text-md'}          
            ${small ? 'py-1' : 'py-3'}          
            ${small ? 'font-lignt' : 'font-semibold'}          
            ${small ? 'border-[1px]' : 'border-2'}          
          `}
        >
            <div className='float-left'>
                {label}
            </div>
        </section>
    )
}

export default ListContainer;
