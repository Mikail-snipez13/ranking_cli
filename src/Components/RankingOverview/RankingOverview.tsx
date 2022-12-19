import { useEffect, useState } from "react";
import { ticketIsValidCheck } from "../Endpoints";
import { Ranking } from "../Start/Search";
import "./RankingOverview.css"

type Props = {
    pageSetter: any;
    ranking?: Ranking;
}

const RankingOverview = (props: Props) => {

    const [ticket, setTicket] = useState<string>('');
    const [isValid, setValid] = useState<boolean>(false);
    
    useEffect(() => {checkValidation()}, [ticket])

    const checkValidation = async () => {
        
        (ticket.length === 6 && props.ranking) && await fetch(ticketIsValidCheck(ticket, props.ranking?.id))
            .then(res => res.json())
            .then(data => setValid(data))
    }

    return (
        <div className="rankingOverview">
            <h1>{props.ranking ? props.ranking.title : "NO RANKING"}</h1>
            <div>
                <div className="deck">
                    <h2>18 Questions</h2>
                    <div style={isValid && ticket.length === 6 ? {borderColor: '#90C7A6'} : (ticket.length === 0 ? {} : {borderColor: '#d36969'})}>
                        <input type="text" placeholder="insert ticket" maxLength={6} onChange={event => setTicket(event.target.value)} />
                    </div>
                    <button>Start</button>
                </div>
            </div>
            
            <p className='watermark'>developed by Mikail Gündüz</p>
        </div>
    );
}

export default RankingOverview;