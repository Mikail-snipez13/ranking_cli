import './Login.css'
import personIcon from './../../Assets/Person.svg'
import zoomIcon from './../../Assets/Zoom.svg'
import { useState } from 'react';
import { getMe } from '../Endpoints';
import { Credentials } from '../../App';

type Props = {
    CredentialsSetter: any;
    RankingUserSetter: any;
    pageSetter: any;
    setLoggedIn: any;
}

export interface RankingUser {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
    roles: []
}

const Login = (props: Props) => {
    const [username, setUsername] = useState<String>("");
    const [password, setPassword] = useState<String>("");
    const [noInput, setNoInput] = useState<boolean>(false);
    const [onLogin, setOnLogin] = useState<boolean>(false);
    const [userData, setUserData] = useState<RankingUser | null>();
    const [logged, setLogged] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    

    const showSearch = () =>  props.pageSetter("search");

    const checkLogin = async () => {
        if (username === "" || password === "") {
            setNoInput(true);
            return; 
        }
        
        setOnLogin(true);
        setLogged(false);
        setUserData(null);
        await fetch(getMe(), {
            headers: {
                "Authorization": "Basic " + btoa(`${username}:${password}`)
            }
        })
        .then((res: Response) => {
            if (res.ok) {return res.json()}
        })
        .then(data => {
            setUserData(data);
            setLogged(true);
            props.CredentialsSetter({username: username, password: password} as Credentials);
            props.RankingUserSetter(data as RankingUser);
            props.setLoggedIn(true);
            props.pageSetter("user-panel");
        })
        .catch(() => setError("no connection"))
        
    }

    return (
        <div className='loginContainer' onSubmit={checkLogin}>
            <h1>Login</h1>
            <img className='personIcon' src={zoomIcon} height={29} onClick={showSearch} />
            {logged && <p>logged in</p>}
            <div className='loginForm'>
                <div 
                    className='searchBar' 
                    style={(noInput && username === "" ? 
                        {borderColor: "red", marginTop: 120} :
                        {marginTop: 120})}
                >
                    <input 
                        className='searchInput'
                        placeholder='username'
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <img 
                        src={personIcon} 
                        className='searchIcon' 
                        width={23} 
                    />
                </div>
                <div 
                    className='searchBar' 
                    style={(noInput && password === "" ? 
                        {borderColor: "red", marginTop: 10} :
                        {marginTop: 10})}
                >
                    <input 
                        className='searchInput'
                        placeholder='password'
                        type='password'
                        onChange={(event) => setPassword(event.target.value)}
                        // onKeyDown={handleKeyDown}
                    />
                </div>
                <button className='loginSubmit' type="submit" onClick={checkLogin}>Login</button>
            </div>
            <p className='watermark'>developed by Mikail Gündüz</p>
        </div>
    )
}

export default Login;