import AuthForm from "../components/AuthForm";
import Loading3D from "../components/Loading3D";

function Login() {
    return(
        <div className="bg-custom-gradient animate-gradient flex flex-col justify-center items-center gap-2 h-screen">
            <div className="h-1/3 w-full"><Loading3D/></div>
            <AuthForm route="/api/token/" isRegistration={false}/>
        </div>
    )
}

export default Login;