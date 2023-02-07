import { useEffect, useState } from "react";
import { setSourceMapRange } from "typescript";
import { Credentials } from "../../App";
import { create_question, create_teacher, create_tickets, deleteQuestion, delete_teacher, getQuestions, getTeacherByRanking, getTickets, updateQuestion, update_teacher } from "../Endpoints";
import { RankingUser } from "../Login/Login";
import { Ranking } from "../Start/Search";
import zoomIcon from './../../Assets/Zoom.svg'
import './UserPanelRanking.css'

type Props = {
    ranking?: Ranking;
    credentials: Credentials | null;
    rankingUser: RankingUser | null;
    questions: any;
    pageSetter: any;
}

export interface Question {
    id: number;
    text: string;
    rankingId: number;
}

interface Ticket {
    id: number;
    valid: boolean;
    code: string;
    rankingId: number;
}

const UserPanelRanking = (props: Props) => {

    const showUserPanel = () => props.pageSetter("user-panel")
    const showSearch = () => props.pageSetter("search")
    const [loaded, setLoaded] = useState(false);
    
    // question panel
    const [questions, setQuestions] = useState<Question[]>([]);
    const [questionText, setQuestionText] = useState<string>("");
    const [isCreatingQuest, setCreatingQuest] = useState<boolean>(false);
    const [noContent, setNoContent] = useState<boolean>(false);
    
    // ticket panel
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [ticketNotFount, setTicketNotFound] = useState<boolean>(false);
    const [ticketInput, setTicketInput] = useState<string>("");
    const [ticketResult, setTicketResult] = useState<Ticket>();
    const [createdTickets, setCreatedTickets] = useState<string[]>([]);
    const [n, setN] = useState<number>(1)

    // teacher panel
    const [teachers, setTeachers] = useState<Teacher[]>();
    const [isCreatingTeacher, setCreatingTeacher] = useState<boolean>(false);

    const load = () => {
        setLoaded(false)
        if (props.ranking === undefined) {
            return;
        }

        Promise.all([
            fetch(getQuestions(props.ranking.id)),
            fetch(getTickets(props.ranking.id)),
            fetch(getTeacherByRanking(props.ranking.id))
        ])
        .then(async ([question, ticket, teacher]) => {
            return [await question.json(), await ticket.json(), await teacher.json()]
        })
        .then(([question, ticket, teacher]) => {
            setQuestions(question);
            setTickets(ticket);
            setTeachers(teacher);
            setLoaded(true);
        })
        .catch(() => {})
    }

    useEffect(() => {
      load()
    }, [])
    
    useEffect(() => {

    }, [loaded])

    const createQuestion = () => {
        fetch(create_question(), {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(props.credentials?.username + ":" + props.credentials?.password)
            },
            body: JSON.stringify({
                text: questionText,
                rankingId: props.ranking?.id
            })
        })
        .then(() => {
            load()
        })
    }

    const questionList = questions?.map(question => 
        <QuestionItem pageSetter={props.pageSetter} key={question.id} credentials={props.credentials} load={load} question={question}/>)

    const teacherList = teachers?.map(teacher => 
        <TeacherItem pageSetter={props.pageSetter} key={teacher.id} credentials={props.credentials} load={load} teacher={teacher} />)

    const ticketList = tickets?.map(ticket => 
        <TicketItem key={ticket.id} ticket={ticket} />)
    
    const createdTicketList = createdTickets?.map(code => 
        <div key={code}>{code}</div>)

        
    const validTickets = () => {
        if (tickets == null) {
            console.log("no")
            return [];
        }
        
        var validTickets: Ticket[] = [];
        
        tickets.forEach(ticket => {
            if (ticket.valid) {
                validTickets.push(ticket)
            }
        })
        
        return validTickets;
    }

    const searchTicket = (code: string) => {
        setTicketNotFound(false);
        code = code.toUpperCase();
        if (code !== "") {
            for (var i = 0; i < tickets.length; i++) {
                if (tickets[i].code == code) {
                    setTicketResult(tickets[i])
                    return tickets[i]
                }
            }
            setTicketNotFound(true);
        }
        
    }

    const createTickets = () => {
        if (props.ranking == null) {
            return;
        }

        fetch(create_tickets(props.ranking?.id, n), {
            method: "GET",
            headers: {
                "Authorization": "Basic " + btoa(props.credentials?.username + ":" + props.credentials?.password)
            }
        })
        .then(res => res.json())
        .then((data: string[]) => setCreatedTickets(data))
        .then(() => load())
    }

    const createTeacher = () => {
        if (props.ranking == null) {return;}

        fetch(create_teacher(), {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(props.credentials?.username + ":" + props.credentials?.password)
            },
            body: JSON.stringify({
                name: questionText,
                rankingId: props.ranking.id
            })
        })
        .then(() => {
            load()
        })
    }

    const showResults = () => {
        props.questions(questions);
        props.pageSetter('results')
    }

    const validTicketList = validTickets().map(ticket => 
        <TicketItem key={ticket.id} ticket={ticket}/>)
        
    return (
        <div>
            {/* create question form */}
            {isCreatingQuest || isCreatingTeacher ? 
            <div className="create-question-form">
                <div style={{margin: 10}}>
                    <h3>{isCreatingQuest ? "Create question" : "Create teacher"}</h3>
                    <label style={noContent ? {color: "red"}: {}}>{isCreatingQuest ? "Question" : "Teacher"}</label>
                    <textarea 
                    style={noContent ? 
                        {borderRadius: 2, borderColor: "red", fontSize: 20, minWidth: "100%", maxWidth: "100%", minHeight: 130, maxHeight: 130}
                    : {fontSize: 20, minWidth: "100%", maxWidth: "100%", minHeight: 130, maxHeight: 130}}
                    className="roboto"
                    maxLength={255}
                    onChange={event => {setQuestionText(event.target.value); setNoContent(false)}}/>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <input type="button" value="cancel" onClick={() => {setCreatingQuest(false); setNoContent(false); setCreatingTeacher(false);}} />
                        <input 
                        style={{backgroundColor: "#90c7a6"}}
                        type="button" value="create" onClick={() => {
                            if (questionText == "") {
                                setNoContent(true)
                                return;
                            }

                            if (isCreatingQuest) {
                                createQuestion()
                                setCreatingQuest(false)
                            }
                            else if (isCreatingTeacher) {
                                createTeacher()
                                setCreatingTeacher(false);
                            }
                            setNoContent(false)
                        }}/>
                    </div>
                </div>
            </div> : null}

            {/* user panel ranking */}
            <img className='personIcon' src={zoomIcon} height={29} onClick={showSearch} />
            <div className="user-panel-ranking">    
                <h1 className="user-panel-ranking-title">{props.ranking?.title}</h1>
                <div>
                    <div className="user-panel-ranking-content">  

                        {/* QuestionSection */}
                        <div className="QuestionSection">
                            <h2 className="SectionTitle">Questions</h2>
                            {questions?.length !== 0 ?
                            <div className="user-panel-ranking-question-list">
                                {questionList}
                            </div>
                            :
                            <div style={{flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                <div style={{textAlign: "center"}}>
                                    <h3>No questions yet!</h3>
                                    <p>Please create one to see the list</p>
                                </div>
                            </div>
                            }
                            <input className="user-panel-ranking-question-button" type="button" value={"create question"} onClick={() => {
                                setQuestionText("")
                                setCreatingQuest(true)
                            }}/>
                        </div>

                        <div 
                        style={{width: "48%", display: "flex", flexDirection: "column"}}
                        >
                            {/* TicketSection */}
                            <div className="TicketSection">
                                <div style={{marginTop: 0, marginBottom: 20, marginLeft: 20, marginRight: 20}}>
                                    <h2 className="SectionTitle">Tickets</h2>

                                    {/* stats */}   
                                    <div className="ticket-stats-container">
                                        <p>Total: {tickets?.length}</p>
                                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "70%"}}>
                                            <p>used {tickets.length - validTickets()?.length} [{tickets.length == 0 ? 0 : Math.round(((tickets.length - validTickets().length)/tickets.length)*100)}%]</p>
                                            <div className="ticket-progress-bar-background" style={tickets.length == 0 ? {backgroundColor: "#bbbbbb"} : {}}>
                                                <div className="ticket-progress-bar-foreground" style={{width: `${tickets.length == 0 ? 0 : (tickets.length - validTickets().length)/tickets.length*100}%`}}/>
                                            </div>
                                            <p>{validTickets()?.length} valid</p>
                                        </div>
                                    </div>
                                    <hr />

                                    {/* ticket list */}
                                    <div className="ticket-content-container">
                                        <div>
                                            <div>All</div>
                                            <div className="user-panel-ticket-list">
                                                {ticketList}
                                            </div>
                                        </div>
                                        <hr />
                                        <div>
                                            <div>Valid</div>
                                            <div className="user-panel-ticket-list">
                                                {validTicketList}
                                            </div>  
                                        </div>

                                        <div style={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
                                            <div style={{marginLeft: 20, marginRight: 20, display: "flex", flexDirection: "column", alignItems: "center"}}>
                                               
                                                {/* Search */}
                                                <div style={{textAlign: "center",}}>Search</div>
                                                <input 
                                                type="text" 
                                                maxLength={6} 
                                                style={{width: "50%", fontSize: 16, textAlign: "center", textTransform: "uppercase"}} 
                                                placeholder="ticket"
                                                onChange={event => setTicketInput(event.target.value)}
                                                onKeyDown={event => {
                                                    console.log(event)
                                                    if (event.key === "Enter") {
                                                        searchTicket(ticketInput)
                                                    }
                                                }} />
                                                {ticketNotFount && <div style={{color: "red"}}>not found</div>}
                                                {ticketResult && !ticketNotFount && <div style={ticketResult.valid ? {color: "#90c7a6"} : {color: "#fa4655"}}>{ticketResult.code}</div>}
                                            </div>

                                            {/* ticket factory */}
                                            <div style={{marginTop: 30, marginLeft: 20, marginRight: 20, display: "flex", flexDirection: "column", alignItems: "center"}}>
                                                <div >Ticket Factory</div>
                                                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                                    <div style={{fontSize: 10, marginRight: 4}}> How many?</div>
                                                   
                                                    <input type="number" value={n} style={{width: 30, marginRight: 4}} min={1} max={50} 
                                                    onChange={event => setN(Number(event.target.value))}/>
                                                    <input type="button" value="create" onClick={() => createTickets()}/>
                                                </div>
                                                <div className="user-panel-ticket-list" style={{height: 90, marginTop: 10}}>{createdTicketList}</div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* teacher section */}
                            <div className="TicketSection" style={{marginTop: 20, flexGrow: 1}}>
                                <h2 className="SectionTitle">Teacher</h2>
                                {teachers?.length !== 0 ?
                                <div className="user-panel-ranking-question-list" style={{height: 115}}>
                                    {teacherList}
                                </div>
                                :
                                <div style={{flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                    <div style={{textAlign: "center"}}>
                                        <h3>No teachers yet!</h3>
                                        <p>Please create one to see the list</p>
                                    </div>
                                </div>
                                }
                                <input className="user-panel-ranking-question-button" type="button" value={"create teacher"} onClick={() => {
                                    setQuestionText("")
                                    setCreatingTeacher(true)
                                }}/>
                            </div>

                        </div>
                        
                    </div>
                            {/* Result section */}
                            <div className="ResultSection" style={{marginTop: 20, marginLeft: 20, marginRight: 20, height: 50}}>
                                <input 
                                type="button" 
                                style={{backgroundColor: "transparent", border: "none", fontSize: 24, marginTop: 10}}
                                onClick={showResults} value="Results" />
                            </div>
                </div>
                
            </div>
            <p style={{textAlign: "center"}} className='watermark'>developed by Mikail Gündüz</p>
        </div>
    )
}

type QuestionItemProps = {
    question: Question;
    credentials: Credentials | null;
    load: any;
    pageSetter: any;
}

// question item with all handlings
const QuestionItem = (props: QuestionItemProps) => {

    const [onEdit, setEdit] = useState<boolean>(false);
    const [editText, setEditText] = useState<string>(props.question.text);
    const [deleteAlert, setDeleteAlert] = useState<boolean>(false);

    const updateSelf = () => {
        fetch(updateQuestion(props.question.id), {
            method: "PATCH",
            headers: {
                "Authorization": "Basic " + btoa(props.credentials?.username + ":" + props.credentials?.password)
            },
            body: JSON.stringify({
                text: `${editText}`
            })
        })
        .then(() => props.load())
    }

    const deleteSelf = () => {
        fetch(deleteQuestion(props.question.id), {
            method: "DELETE",
            headers: {
                "Authorization": "Basic " + btoa(props.credentials?.username + ":" + props.credentials?.password)
            }
        })
        .then(() => props.load())
    }

    const showDeleteAlert = () => { 
        setDeleteAlert(true)
    }

    return (
        <div>

        {onEdit ? 
        <div className="question-item-container" style={{flexDirection: "column", padding: 8}}>
            <textarea className="question-item-container-input" 
            style={{margin: "0", maxWidth: "100%", minWidth: "100%", maxHeight: "100px", height: 70}}
            maxLength={255}
            onChange={
                (event) => setEditText(event.target.value)} 
                value={editText} />
            <div className="question-options">
                <input type="submit" value="cancel" style={{}} onClick={() => {setEdit(false); setDeleteAlert(false)}}/>
                <p>{editText.length} out of 255</p>
                <input type="submit" 
                value={"update"} 
                style={{backgroundColor: "#90d7a6", border: "1px solid grey",  marginLeft: 10}}
                onClick={() => {
                    updateSelf();
                    setEdit(false)
                }}/>
                <input 
                type="submit" 
                value="delete" 
                onClick={() => {
                    showDeleteAlert()
                }}
                style={{backgroundColor: "#fa4655", border: "1px solid grey", marginLeft: 10}}/>
            </div>
            {deleteAlert ? <div className="question-delete-alert">
                <p>
                    <span style={{fontWeight: "bold"}}>Are you sure you want to delete this question?</span><br />
                     All the votes will be deleted.
                </p>
                <input type="button" value="cancel" onClick={() => setDeleteAlert(false)} />
                <input type="button" value="delete" style={{backgroundColor: "#fa4655"}}
                onClick={
                    () => {
                        deleteSelf()
                    }
                }/>
            </div> : null}

        </div>
        :
        <div className="question-item-container">
            <p className="question-item-container-text">{editText}</p>
            <div className="option-points" onClick={() => {
                setEdit(true)
                setEditText(props.question.text)
            }}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        }
        </div>
    )
}

interface Teacher {
    id: number;
    name: string;
    rankingId: number;
}

type TeacherItemProps = {
    teacher: Teacher;
    credentials: Credentials | null;
    load: any;
    pageSetter: any;
}

const TeacherItem = (props: TeacherItemProps) => {

    const [onEdit, setEdit] = useState<boolean>(false);
    const [editText, setEditText] = useState<string>(props.teacher.name);
    const [deleteAlert, setDeleteAlert] = useState<boolean>(false);

    const updateSelf = () => {
        fetch(update_teacher(props.teacher.id), {
            method: "PATCH",
            headers: {
                "Authorization": "Basic " + btoa(props.credentials?.username + ":" + props.credentials?.password)
            },
            body: JSON.stringify({
                name: `${editText}`
            })
        })
        .then(() => props.load())
    }

    const deleteSelf = () => {
        fetch(delete_teacher(props.teacher.id), {
            method: "DELETE",
            headers: {
                "Authorization": "Basic " + btoa(props.credentials?.username + ":" + props.credentials?.password)
            }
        })
        .then(() => props.load())
    }

    const showDeleteAlert = () => { 
        setDeleteAlert(true)
    }

    return (
        <div>

        {onEdit ? 
        <div className="question-item-container" style={{flexDirection: "column", padding: 8}}>
            <textarea className="question-item-container-input" 
            style={{margin: "0", maxWidth: "100%", minWidth: "100%", maxHeight: "100px", height: 70}}
            maxLength={255}
            onChange={
                (event) => setEditText(event.target.value)} 
                value={editText} />
            <div className="question-options">
                <input type="submit" value="cancel" style={{}} onClick={() => {setEdit(false); setDeleteAlert(false)}}/>
                <p>{editText.length} out of 255</p>
                <input type="submit" 
                value={"update"} 
                style={{backgroundColor: "#90d7a6", border: "1px solid grey",  marginLeft: 10}}
                onClick={() => {
                    updateSelf();
                    setEdit(false)
                }}/>
                <input 
                type="submit" 
                value="delete" 
                onClick={() => {
                    showDeleteAlert()
                }}
                style={{backgroundColor: "#fa4655", border: "1px solid grey", marginLeft: 10}}/>
            </div>
            {deleteAlert ? <div className="question-delete-alert">
                <p>
                    <span style={{fontWeight: "bold"}}>Are you sure to delete this?</span>
                </p>
                <input type="button" value="cancel" onClick={() => setDeleteAlert(false)} />
                <input type="button" value="delete" style={{backgroundColor: "#fa4655"}}
                onClick={
                    () => {
                        deleteSelf()
                    }
                }/>
            </div> : null}

        </div>
        :
        <div className="question-item-container">
            <p className="question-item-container-text">{editText}</p>
            <div className="option-points" onClick={() => {
                setEdit(true)
                setEditText(props.teacher.name)
            }}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        }
        </div>
    )
}

type TicketItemProps = {
    ticket: Ticket;
}

const TicketItem = (props: TicketItemProps) => {
    return (
        <div style={props.ticket.valid ? {color: "#90c7a6"} : {color: "#fa4655"}}>
            {props.ticket.code}
        </div>
    )
}

export default UserPanelRanking;