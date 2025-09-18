export default function InputText({ title, name, formData, handleChange, required = false }: { title: any, name: any, formData: any, handleChange: any, required?: boolean }) {
    return (
        <label htmlFor={name} className='w-full'>
            <p className="flex items-center">
                <span className=" mb-2 flex items-center text-black font-semibold bg-btnColor px-3 py-1 rounded-[4px] text-[.9rem]">
                    {title}

                </span>
                {required && <span className="text-red-500 text-[1.875rem] shrink-0">*</span>}
            </p>
            <input
                id={name}
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full text-[.8rem] p-2 text-black  rounded-[4px] border  border-lightYellow/60 focus:border-lightYellow outline-none "
            />
        </label>
    )
}