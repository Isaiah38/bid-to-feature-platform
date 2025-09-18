import { PageLoaderWithSpinner } from ".";



export default function LoaderLayout({ children, isLoading }: { children: React.ReactNode, isLoading: any }) {

    return (
        <div className="min-h-screen bg-background">
            {isLoading ? <PageLoaderWithSpinner /> : children}
        </div>
    )
}