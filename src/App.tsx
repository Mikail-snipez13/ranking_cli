import React, { useState } from 'react';
import './App.css';
import Login, { RankingUser } from './Components/Login/Login';
import RankingOverview from './Components/RankingOverview/RankingOverview';
import Results from './Components/Results/Results';
import Search, {Ranking} from './Components/Start/Search';
import UserPanel from './Components/UserPanel/UserPanel';
import UserPanelRanking, { Question } from './Components/UserPanelRanking/UserPanelRanking';
import { Analytics } from "@vercel/analytics/react"

export type Credentials = {
  username: string;
  password: string;
}

function App() {

  const [page, setPage] = useState<string>("search");
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [rankingUser, setRankingUser] = useState<RankingUser | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null); 
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [ranking, setRanking] = useState<Ranking>();

  return (
    <div className="App">
      <Analytics />
      {page === "search" ? <Search loggedIn={loggedIn} pageSetter={setPage} rankingSetter={setRanking} /> : null}
      {page === "ranking-overview" ? <RankingOverview pageSetter={setPage} ranking={ranking} /> : null}
      {page === "login" ? 
      <Login 
      RankingUserSetter={setRankingUser}
      CredentialsSetter={setCredentials} 
      setLoggedIn={setLoggedIn}
      pageSetter={setPage} /> : null}
      {page === "user-panel" ? <UserPanel 
      pageSetter={setPage} 
      credentials={credentials} 
      rankingUser={rankingUser}
      RankingSetter={setRanking} /> : null}
      {page === "user-panel-ranking" ? <UserPanelRanking 
      pageSetter={setPage}
      credentials={credentials}
      ranking={ranking}
      rankingUser={rankingUser}
      questions={setQuestions}
      /> : null}
      {page === "results" ? <Results questions={questions} pageSetter={setPage} /> : null}
    </div>
  );
}

export default App;
