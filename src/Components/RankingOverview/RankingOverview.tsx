import { useEffect, useState } from "react";
import Select, { SelectInstance, SingleValue } from "react-select";
import { getQuestions, getTeacherByRanking, ticketIsValidCheck, ticketSubmit } from "../Endpoints";
import { Ranking } from "../Start/Search";
import "./RankingOverview.css"
import arrowIcon from "../../Assets/left.svg"
import Confetti from "react-confetti";
import zoomIcon from './../../Assets/Zoom.svg'

type Props = {
    pageSetter: any;
    ranking?: Ranking;
}

interface Question {
    id: number;
    text: string;
    rankingId: number;
    teacherId?: number;
}

interface Teacher {
    id: number;
    name: string;
    rankingId: number;
}

const RankingOverview = (props: Props) => {

    const [ticket, setTicket] = useState<string>('');
    const [isValid, setValid] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [firstLoad, setFirstLoad] = useState<boolean>(false);
    const [connection, setConnection] = useState<boolean>(true);
    const [swipeCount, setSwipeCount] = useState<number>(0);
    const [voting, setVoting] = useState<Map<string, number>>(new Map<string, number>);
    const [selection, setSelection] = useState<string>("");
    const [submitted, setSubmitted] = useState(false);
    const [submitException, setSubmitException] = useState(false);
    
    useEffect(() => {
        if (!firstLoad) {loadData()}
        setFirstLoad(true);
    });
    useEffect(() => {checkValidation()}, [ticket])

    const checkValidation = () => {
        if (ticket.length === 6 && props.ranking) {
            setConnection(true)
            fetch(ticketIsValidCheck(ticket, props.ranking?.id))
                .then(res => {
                    if (!res.ok) {
                        return false
                    }
                    return res.json();
                })
                .then(data => {setValid(data)})
                .catch(() => setConnection(false))
        } 
    }

    const loadData = async () => {
        setLoad(false)
        setConnection(true);
        if (props.ranking !== undefined) {
            Promise.all([
                fetch(getQuestions(props.ranking.id)),
                fetch(getTeacherByRanking(props.ranking.id))
            ])
            .then(async ([quest, teach]) => [await quest.json(), await teach.json()])
            .then(([quest, teach]) => {
                setQuestions(quest);
                setTeachers(teach);
                setLoad(true);
            })
            .catch(() => {setConnection(false)})
        }
    }

    const startHandler = () => {
        checkValidation();
        if (isValid && questions.length > 0) {
            setSwipeCount(1);
        }
    }

    const selectionHandler = (event: SingleValue<{value: string, label: string}>) => {
        if (event !== null) {
            teachers.forEach(teacher => {
                if (teacher.name === event.value) {
                    voting.set(`${questions[swipeCount-1].id}`, teacher.id)
                }
            })
            setSelection(event.value);
        }
    }

    const leftArrowHandle = () => {
        if (swipeCount > 1) {
            setSwipeCount(swipeCount-1);
        }
    }

    const submit = async () => {
        teachers.forEach(teacher => {
            if (teacher.name === selection) {
                voting.set(`${questions[swipeCount-1].id}`, teacher.id)
            }
        })
        if (props.ranking) {
            await fetch(ticketSubmit(ticket, props.ranking.id), {method: "POST", body: JSON.stringify(Object.fromEntries(voting))})
                .then(res => {
                    if (res.ok) {
                        setSubmitted(true);
                        return res.text();
                    }
                    setSubmitException(true);
                })
                .catch(() => setConnection(false))
        }

    }

    const rightArrowHandle = () => {
        if (swipeCount < questions.length && selection !== "") {
            teachers.forEach(teacher => {
                if (teacher.name === selection) {
                    let currentVoting = voting;
                    currentVoting.set(`${questions[swipeCount-1].id}`, teacher.id);
                    setVoting(currentVoting)
                }
            })
            setSwipeCount(swipeCount+1);
        }
    }

    const TeacherList = teachers.map(teacher => {return {value: teacher.name, label: teacher.name}})
    const showSearch = () =>  props.pageSetter("search");

    return (
        <div className="rankingOverview">
            <h1>{props.ranking ? props.ranking.title : "NO RANKING"}</h1>
            <img className='personIcon' src={zoomIcon} height={29} onClick={showSearch} />
            {load && !submitted ?
            <div className="questionCardContainer">
                {swipeCount > 0 ?
                <div>
                    <div className="questionCard">
                        <div className="questionCardTitle">
                            <h2 style={{margin: 20}}>{questions[swipeCount-1].text}</h2>
                        </div>
                        <div className="teacherInput">
                            <Select placeholder="select teacher" options={TeacherList} onChange={selectionHandler} />
                        </div>
                    </div>
                    <div className="questionCardNav">
                        {/* <img className="leftArrow" src={greenArrow}/> */}
                        {/* <div className={swipeCount !== 1 ? "ArrowCircle ArrowRed" : "ArrowCircle ArrowDisabled"} onClick={leftArrowHandle}>
                            <img src={arrowIcon} alt="" width="49" style={{transform: "rotate(180deg)"}}/>
                        </div> */}
                        <h2>{swipeCount} <br/><span style={{color: "#a3a3a3", fontSize: 16, lineHeight: "0.5"}}>of {questions.length}</span></h2>
                        <div className={swipeCount < questions.length ? "ArrowCircle": "submitArrow"} onClick={swipeCount === questions.length ? submit : rightArrowHandle}>
                            {swipeCount !== questions.length ? 
                            <img width={49} className="rightArrow" src={arrowIcon} /> 
                            : <p>Submit</p>}
                        </div>
                    </div>
                </div>
                
                : 
                <div className="deck">
                    <h2>{questions.length} {questions.length === 1 ? "Question" : "Questions"}</h2>
                    <div style={isValid && ticket.length === 6 ? {borderColor: '#90C7A6'} : (ticket.length === 0 ? {} : {borderColor: '#d36969'})}>
                        <input type="text" placeholder="insert ticket" maxLength={6} onChange={event => setTicket(event.target.value)} />
                    </div>
                    <button style={questions.length > 0 ? {} : {background: "#aaaaaa"}} onClick={startHandler}>Start</button>
                </div>
                }
            </div>
            : null}   
            {submitted ? 
            <div className="submittedFace">
                <h2>Thank you for the vote!</h2>
                <Confetti 
                width={window.innerWidth} 
                height={window.innerHeight} 
                recycle={false} 
                tweenDuration={20000}
                numberOfPieces={1000}
                />
            </div>
            :
            null}
            
            
            <p className='watermark'>developed by Mikail Gündüz</p>
        </div>
    );
}

export default RankingOverview;