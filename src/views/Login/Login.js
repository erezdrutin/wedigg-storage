import React from 'react';



const Login = (props) => {
    const { email, setEmail, password, setPassword, handleLogin, handleSignUp, hasAccount, setHasAccount, emailError, passwordError, company, setCompany, fullName, setFullName } = props;
    return (
        <section className="login">
            <div className="loginContainer">
                <label>Username</label>
                <input
                    type="text"
                    autoFocus
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <p className="errorMsg">{emailError}</p>
                <label>Password</label>
                <input
                    type="password"
                    autoFocus
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <p className="errorMsg">{passwordError}</p>
                
                {hasAccount ? (
                    <div>
                    <label>Company</label>
                    <input
                        type="text"
                        autoFocus
                        required
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                    />
                    <label>Full Name</label>
                    <input
                        type="text"
                        autoFocus
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                    />
                    </div>
                ) : ''}
                

                <div className="btnContainer">
                    {!hasAccount ? (
                        <>
                        <button onClick={handleLogin} variant="contained" color="primary">Sign in</button>
                        <p>Don&#39;t have an account?<span onClick={() => setHasAccount(!hasAccount)}>Sign up</span></p>
                        </>
                    ) : (
                        <>
                        <button onClick={handleSignUp} variant="contained" color="primary">Sign up</button>
                        <p>Have an account? <span onClick={() => setHasAccount(!hasAccount)}>Sign in</span></p>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Login;