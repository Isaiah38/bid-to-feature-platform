export function SectionLoaderWithSpinner() {
    return (
        <div className="py-[2rem]">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative size-10" role="status" aria-label="Loading">
                    <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-200 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    )
}