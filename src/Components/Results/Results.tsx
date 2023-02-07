import { useEffect, useState } from "react"
import { getQuestions, get_results } from "../Endpoints";
import { Question } from "../UserPanelRanking/UserPanelRanking"
import './Results.css'
import arrow from '../../Assets/arrow.svg'

type ResultProps = {
    questions: Question[] | null;
    pageSetter: any;
}

const Results = (props: ResultProps) => {
    
    const [results, setResults] = useState<Map<Question, any>>(new Map())
    const [loaded, setLoaded] = useState<boolean>(false);
    const [connection, setConnection] = useState<boolean>(true);

    const load = () => {
        if (props.questions === null) {
            return;
        }

        setConnection(true);
        var count = 0;
        props.questions.forEach((quest) => {
            fetch(get_results(quest.id))
                .then(res => res.json())
                .then(data => {
                    results.set(quest, data);
                    setResults(results);
                    count++;
                    
                    if (count == props.questions?.length) {
                        setLoaded(true);
                    }
                })
                .catch(() => setConnection(false))
        })
        
        
    }

    useEffect(load, [props.questions])

    const showRankingOverview = () => {
        props.pageSetter('user-panel-ranking')
    }

    const result_list = () => {
        var list: JSX.Element[] = [];
        results.forEach((value, key) => {
            list.push(
                <RankItem key={key.id} question={key} results={value} /> 
            )
        })

        return list;
    }

    return (
        <div>
            <img className='personIcon' style={{top: 30}} src={arrow} height={29} onClick={showRankingOverview} />
            <h1 style={{textAlign: 'center'}}>Results</h1>
            {loaded && connection ? <div className="results-list">{result_list()}</div> : null}
            <p style={{textAlign: "center"}} className='watermark'>developed by Mikail Gündüz</p>
        </div>
    )
}

type RankingItemProps = {
    question: Question;
    results: any;
}

const RankItem = (props: RankingItemProps) => {
    return (
        <div className='results-rank-item' style={{width: 250, height: 'auto'}}>
            <div style={{margin: 10}}>    
                <h2>{props.question.text}</h2>
                <p>1: {props.results['1']}</p>
                <p>2: {props.results['2']}</p>
                <p>3: {props.results['3']}</p>
            </div>
        </div>
    )
}

export default Results;