import LLMInterface from "../components/LLMInterface";

function AnalyticsPage(){
    return(
        //For whatever reason the H height is improper
        <div className="p-8 flex items-center justify-center bg-custom-gradient animate-gradient min-h-screen">
            <LLMInterface />
        </div>
    )
}

export default AnalyticsPage;