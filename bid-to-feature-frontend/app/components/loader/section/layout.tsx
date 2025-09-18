import { SectionLoaderWithSpinner } from ".";



export default function SectionLoaderLayout({ children, isLoading }: { children: React.ReactNode, isLoading: any }) {

    return (
        <div className="">
            {isLoading ? <SectionLoaderWithSpinner /> : children}
        </div>
    )
}