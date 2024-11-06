function StartScreen({numQuestions, dispatch}) {
    return (
        <div className = "start">
            <h2> Welcome</h2>
            <h3> {numQuestions} questions to test React Mastery</h3>
            <button className="btn btn-ui" onClick={()=>dispatch({type:"start"})}>Let's Start</button>
        </div>
    )
}

export default StartScreen
