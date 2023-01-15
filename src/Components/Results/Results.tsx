import { useState } from "react"
import { Question } from "../UserPanelRanking/UserPanelRanking"

type ResultProps = {
    questions: Question[];
    pageSetter: any;
}

const Results = (props: any) => {
    
    const [results, setResults] = useState<Map<Question, any>>(new Map)

    return (
        <div>
            
        </div>
    )
}

export default Results;