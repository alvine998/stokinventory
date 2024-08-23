import React, { ButtonHTMLAttributes } from 'react'


type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: any,
    color?: 'primary' | 'danger' | 'info' | 'warning' | 'white' | 'tabs' | 'print',
    className?: any;
}

export default function Button(props: Props) {
    const {
        children,
        color = 'primary',
        className
    } = props
    return (
        <div className='my-2 w-full'>
            {
                color == 'primary' &&
                <button {...props} className={'w-full p-1 bg-green-700 hover:bg-green-500 duration-150 transition-all rounded-md text-white ' + className}>
                    {children}
                </button>
            }
            {
                color == 'danger' &&
                <button {...props} className={'w-full p-1 bg-red-700 hover:bg-red-500 duration-150 transition-all rounded-md text-white ' + className}>
                    {children}
                </button>
            }
            {
                color == 'warning' &&
                <button {...props} className={'w-full p-1 bg-orange-600 hover:bg-orange-500 duration-150 transition-all rounded-md text-white ' + className}>
                    {children}
                </button>
            }
            {
                color == 'info' &&
                <button {...props} className={'w-full p-1 bg-blue-700 hover:bg-blue-500 duration-150 transition-all rounded-md text-white ' + className}>
                    {children}
                </button>
            }
            {
                color == 'print' &&
                <button {...props} className={'w-full p-1 bg-violet-700 hover:bg-violet-500 duration-150 transition-all rounded-md text-white ' + className}>
                    {children}
                </button>
            }
            {
                color == 'white' &&
                <button {...props} className={'w-full p-1 bg-white duration-150 transition-all rounded-md text-black border border-gray-300 px-2 ' + className}>
                    {children}
                </button>
            }
             {
                color == 'tabs' &&
                <button {...props} className={'w-full p-1 duration-150 transition-all rounded-md text-white ' + className}>
                    {children}
                </button>
            }
        </div>
    )
}