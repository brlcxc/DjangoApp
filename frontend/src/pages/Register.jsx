import AuthForm from "../components/AuthForm";

function Register() {
    return(
        <div className="bg-custom-gradient animate-gradient flex flex-col justify-center items-center gap-2 h-screen">
            <AuthForm route="/api/users/register/" isRegistration={true}/>
        </div>
    )
}

export default Register;