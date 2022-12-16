import React, { KeyboardEvent, KeyboardEventHandler, useEffect, useState } from 'react';
import './Search.css';
import zoomIcon from './../../Assets/Zoom.svg'
import personIcon from './../../Assets/Person.svg'
import { randomInt } from 'crypto';

interface Ranking {
    id: number;
    title: string;
    votes: number;
    userId: number;
}

type Props = {

}

type Data = {
    ranking: Ranking
}

const Search = (props: Props) => {
    const [rankingName, setRankingName] = useState("");
    const [rankings, setRankings] = useState<Ranking[]>([]);
    const [questionCounts, setQuestionCounts] = useState(new Map<number, any>);
    const [loaded, setLoaded] = useState(false);
    const [connection, setConnection] = useState(true);

    const loadData = async () => {
        setLoaded(false);
        setConnection(true);

        // get rankings
        await fetch(`http://localhost:8080/ranking/search/${rankingName}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                else {
                    return res.json()
                }
            })
            .then((data: Ranking[]) => {
                setRankings(data)
                console.log(data)
            })
            .catch(() => setConnection(false))
        
        
        setLoaded(true);
        console.log();
    }

    const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            await loadData()
        }
    }

    const getQuestion = (id: number) => {return questionCounts.get(id)}

    const rankingList: JSX.Element[] = rankings.map((ranking: Ranking) => <RankingCard key={ranking.id} ranking={ranking}/>)

    return (
            <div className="start">
                <img className='personIcon' src={personIcon} height={29} />
                <h1 className="start-title">Ranking</h1>
                <div style={{flexGrow: 1}}>
                    <div className='searchBar'>
                        <input 
                            className='searchInput'
                            placeholder='ranking name'
                            onChange={(event) => setRankingName(event.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <img 
                            src={zoomIcon} 
                            className='searchIcon' 
                            height={23} 
                            onClick={loadData} />

                    </div>
                    {loaded && connection ? (rankings.length === 0 ? <NoFoundCard /> : null): null}
                    {!connection ? <NoConnectionCard /> : null}
                    {rankings.length > 0 ? <ul className='rankingList'>{rankingList}</ul> : null}
                </div>
                <p className='watermark'>developed by Mikail Gündüz</p>
                
            </div>
        )
}

type RankingCardProps = {
    ranking: Ranking;
}

const RankingCard = (props: RankingCardProps) => {

    return (
        <li className="rankingItem">
            <div>
                <h2>{props.ranking.title}</h2>
                <p className='creator'>created by John</p>
            </div>
            <p className='cards'><span className='count'>{18}</span><br/>cards</p>
        </li>
    )
}

const NoFoundCard = () => {

    return (
        <div className='ErrorCard'>
            <h2>FOUND NOTHING</h2>
        </div>
    )
}

const NoConnectionCard = () => {
    return (
        <div className='ErrorCard'>
            <h2>No Connection</h2>
        </div>
    )
}

export default Search;