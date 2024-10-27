import LoginForm from "../components/LoginForm";

function Login() {
    return(
        <div className="bg-custom-gradient animate-gradient flex flex-col justify-center items-center gap-2 h-screen">
            <img className="h-1/3 w-auto" src="/Holofund.png"></img>
            <LoginForm/>
        </div>
    )
}

export default Login;