import LLMInterface from "../components/LLMInterface";
import { getMonth } from "../components/util";
import { useState } from "react";

function AnalyticsPage(){
    return(
        <div className="w-full h-full flex bg-custom-gradient animate-gradient">
            <LLMInterface />
        </div>
    )
}

export default AnalyticsPage;