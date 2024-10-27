import LoginForm from "../components/LoginForm";

function Login() {
    return(
        <div className="grid h-screen w-full">
            <div className="bg-custom-gradient animate-gradient flex flex-col justify-center p">
                <LoginForm/>
            </div>
        </div>
    )
}

export default Login;