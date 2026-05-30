export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-full">
                <img src="/logo.jpg" alt="RSKMC Logo" className="size-8 object-cover" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">RSKMC Suite</span>
            </div>
        </>
    );
}
