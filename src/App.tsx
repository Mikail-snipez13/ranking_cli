import React, { useState } from 'react';
import './App.css';
import Login from './Components/Login/Login';
import RankingOverview from './Components/RankingOverview/RankingOverview';
import Search, {Ranking} from './Components/Start/Search';

function App() {

  const [page, setPage] = useState<string>("search");
  const [credentials, setCredentials] = useState(null);
  const [ranking, setRanking] = useState<Ranking>();

  return (
    <div className="App">
      {page === "search" ? <Search pageSetter={setPage} rankingSetter={setRanking} /> : null}
      {page === "ranking-overview" ? <RankingOverview pageSetter={setPage} ranking={ranking} /> : null}
      {page === "login" ? <Login CredentialsSetter={setCredentials} pageSetter={setPage} /> : null}
    </div>
  );
}

export default App;
