function Options({question, dispatch, answer}) {
    console.log(question)
    const hasAnswered = answer !== null
    return (
        <div className="options">
        {
            question.options.map((option,index)=>(
                <button 
                key={option} 
                disabled = {answer !== null}
                className={`btn btn-option ${answer === index ? 'answer' : ""} 
                ${hasAnswered ? index === question.correctOption ? "correct" : "wrong":""}`}
                onClick={()=>dispatch({type:"newAnswer", payload: index})}>{option}</button>
            ))
        }
    </div>
    )
}

export default Options
