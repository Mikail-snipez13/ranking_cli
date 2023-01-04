import { KeyboardEvent, useEffect, useState } from 'react';
import './Search.css';
import zoomIcon from './../../Assets/Zoom.svg'
import personIcon from './../../Assets/Person.svg'
import { Method } from '@testing-library/react';
import { getQuestions, getUsernameById, rankingSearch } from '../Endpoints';

export interface Ranking {
    id: number;
    title: string;
    votes: number;
    userId: number;
}

type Props = {
    pageSetter: any;
    rankingSetter: any;
}

type Data = {
    ranking: Ranking
}

const Search = (props: Props) => {
    const [rankingName, setRankingName] = useState("");
    const [rankings, setRankings] = useState<Ranking[]>([]);
    const [questionCounts, setQuestionCounts] = useState<Map<number, number>>(new Map<number, number>());
    const [names, setNames] = useState<Map<number, string>>(new Map<number, string>());
    const [loaded, setLoaded] = useState(false);
    const [loadedMeta, setLoadedMeta] = useState(false);
    const [connection, setConnection] = useState(true);
    
    useEffect(() => {}, [loadedMeta])

    const loadData = async () => {
        setLoaded(false);
        setConnection(true);
        setLoadedMeta(false);
        // get rankings
        if (rankingName === "") {
            setLoaded(true);
            return;
        }
        await fetch(rankingSearch(rankingName))
            .then((res) => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                else {
                    return res.json()
                }
            })
            .then((data: Ranking[]) => {
                setRankings(data);
                if (data.length > 0) {

                    // fetch meta data for rankings
                    data.forEach((ranking: Ranking, index: number) => {
                        Promise.all([
                            fetch(getQuestions(ranking.id)),
                            fetch(getUsernameById(ranking.userId))
                        ])
                        .then(async ([quest, user]) => {
                            // console.log(quest, user);
                            return [await quest.json(), await user.text()];
                        })
                        .then(([quest, user]) => {
                            questionCounts.set(ranking.id, quest.length)
                            names.set(ranking.userId, user)
                            console.log(index);
                            if (index === data.length-1) {
                                setLoadedMeta(true);
                                console.log("loaded", index);
                            }
                        })
                        .catch(() => setConnection(false))
                    })
                }
                console.log(data);
                setLoaded(true);
            })
            .catch(() => setConnection(false));
        console.log();
    }

    const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            await loadData()
        }
    }
    const showLogin = () => {props.pageSetter('login')}

    const getQuestion = (id: number) => {return questionCounts.get(id)}
    const getName = (id: number) => {return names.get(id)}
    const getRankingView = (ranking: Ranking) => {props.rankingSetter(ranking); props.pageSetter("ranking-overview");}

    const rankingList: JSX.Element[] = rankings.map((ranking: Ranking) => 
        <RankingCard key={ranking.id} 
        ranking={ranking} 
        questions={getQuestion(ranking.id)}
        name={getName(ranking.userId)}
        pageSetter={props.pageSetter}
        getRankingView={getRankingView}
        />)

        return (
            <div className="start">
                <img className='personIcon' src={personIcon} height={29} onClick={showLogin} />
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
                            width={23} 
                            onClick={loadData} />

                    </div>
                    {loaded && connection ? (rankings.length === 0 ? <NoFoundCard /> : null): null}
                    {!connection ? <NoConnectionCard /> : null}
                    {rankings.length > 0 && loaded && loadedMeta ? <ul className='rankingList'>{rankingList}</ul> : null}
                </div>
                <p className='watermark'>developed by Mikail Gündüz</p>
                
            </div>
        )
}

type RankingCardProps = {
    ranking: Ranking;
    questions: number | undefined;
    name: string | undefined;
    pageSetter: any;
    getRankingView: any;
}

const RankingCard = (props: RankingCardProps) => {

    return (
        <li className="rankingItem" 
            onClick={() => props.getRankingView(props.ranking)}
        >
            <div>
                <h2>{props.ranking.title}</h2>
                <p className='creator'>created by {props.name}</p>
            </div>
            <p className='cards'>
                <span className='count'>{props.questions}</span>
                <br/>cards
            </p>
        </li>
    )
}

const NoFoundCard = () => {

    return (
        <div className='ErrorCard'>
            <h2>nothing found</h2>
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