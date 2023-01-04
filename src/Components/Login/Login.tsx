import './Login.css'
import personIcon from './../../Assets/Person.svg'
import zoomIcon from './../../Assets/Zoom.svg'

type Props = {
    CredentialsSetter: any;
    pageSetter: any;
}

const Login = (props: Props) => {
    
    const showSearch = () =>  props.pageSetter("search");

    const checkLogin = () => {
        
    }

    return (
        <div className='loginContainer'>
            <h1>Login</h1>
            <img className='personIcon' src={zoomIcon} height={29} onClick={showSearch} />
            <div className='loginForm'>
                <div className='searchBar' style={{marginTop: 120}}>
                    <input 
                        className='searchInput'
                        placeholder='username'
                        // onChange={(event) => setRankingName(event.target.value)}
                        // onKeyDown={handleKeyDown}
                    />
                    <img 
                        src={personIcon} 
                        className='searchIcon' 
                        width={23} 
                    />
                </div>
                <div className='searchBar' style={{marginTop: 10}}>
                    <input 
                        className='searchInput'
                        placeholder='password'
                        type='password'
                        // onChange={(event) => setRankingName(event.target.value)}
                        // onKeyDown={handleKeyDown}
                    />
                </div>
                <button className='loginSubmit' type="submit">Login</button>
            </div>
            <p className='watermark'>developed by Mikail Gündüz</p>
        </div>
    )
}

export default Login;