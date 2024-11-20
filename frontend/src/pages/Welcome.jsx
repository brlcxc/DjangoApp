import Loading3D from "../components/Loading3D";

function Welcome() {
    const userName = localStorage.getItem('DISPLAY_NAME')

    return(
        <div className="w-full h-full flex flex-col justify-center items-center bg-custom-gradient animate-gradient min-h-screen p-4">
            <div className="h-1/3 w-full"><Loading3D/></div>
            <h1 className="text-4xl md:text-6xl lg:text-8xl text-center mt-4">Welcome, {userName}!</h1>
        </div>
    )
}

export default Welcome;