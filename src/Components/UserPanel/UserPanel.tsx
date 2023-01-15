import { useEffect, useState } from "react";
import { Credentials } from "../../App"
import { getAllMyRankings } from "../Endpoints";
import { RankingUser } from "../Login/Login";
import { Ranking } from "../Start/Search";
import "./UserPanel.css"
import zoomIcon from './../../Assets/Zoom.svg'

type Props = {
    credentials: Credentials | null;
    rankingUser: RankingUser | null;
    RankingSetter: any;
    pageSetter: any;
}

const UserPanel = (props: Props) => {

    const [rankings, setRankings] = useState<Ranking[] | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(true);

    const showSearch = () => props.pageSetter("search")
    
    const loadRankings = async () => {
        await fetch(getAllMyRankings(), {
            headers: {
                "Authorization": "Basic " + btoa(props.credentials?.username + ":" + props.credentials?.password)
            }
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(data => {
            setRankings(data);
            setLoading(false);
            setLoaded(true);
        })
        .catch(err => {
            setLoading(false);
        })
    }
    
    useEffect(() => {
        loadRankings()
    }, [])

    const RankingList = rankings?.map(
        (ranking: Ranking) => <RankingItem rankingSetter={props.RankingSetter} key={ranking.id} ranking={ranking} pageSetter={props.pageSetter} />)

    return (
        <div className="user-panel-container">
            <img className='personIcon' src={zoomIcon} height={29} onClick={showSearch} />
            <h1>Welcome, {props.rankingUser?.name || props.rankingUser?.username}</h1>
            <p>all your active rankings</p>
            {loaded ? 
            <div style={{flexGrow: 1}}>
                <div className="user-panel-ranking-list">
                    {RankingList}
                </div>
            </div>
            : 
            <LoadingIndicator />
            }
            <p className='watermark'>developed by Mikail Gündüz</p>
        </div>
    )
}

type ItemProps = {
    ranking: Ranking;
    pageSetter: any;
    rankingSetter: any;
}

const RankingItem = (props: ItemProps) => {

    const showRanking = () => {
        props.rankingSetter(props.ranking);
        props.pageSetter("user-panel-ranking");
    }

    return (
        <div className="user-panel-ranking-item" onClick={showRanking}>
            <h2>{props.ranking.title}</h2>
            <p>votes: {props.ranking.votes}</p>
        </div>
    )
}

const LoadingIndicator = (props: any) => {
    return (
        <div className="loadingIndicatorContainer">
            <div className="loadingCircleLeft"></div>
            <div className="loadingCircleMiddle"></div>
            <div className="loadingCircleRight"></div>
        </div>
    )
}

export default UserPanel;