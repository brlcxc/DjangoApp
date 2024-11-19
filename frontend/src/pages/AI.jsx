import LLMInterface from "../components/LLMInterface";

function AnalyticsPage(){
    return(
        //The 700px is a band-aid fix for the h not being the proper size
        <div className="p-8 h-[700px] flex items-center justify-center bg-custom-gradient animate-gradient min-h-screen">
            <LLMInterface />
        </div>
    )
}

export default AnalyticsPage;