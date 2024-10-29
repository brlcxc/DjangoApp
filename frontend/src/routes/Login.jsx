import AuthForm from "../components/AuthForm";

function Login() {
    return(
        <div className="bg-custom-gradient animate-gradient flex flex-col justify-center items-center gap-2 h-screen">
            <img className="h-1/3 w-auto" src="/Holofund.png"></img>
            <AuthForm route="/api/token/" isRegistration={false}/>
        </div>
    )
}

export default Login;