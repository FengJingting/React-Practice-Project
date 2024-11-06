function FinishScreen({points, maxPossiblePoints, highscore,dispatch}) {
    const percentage = (points/maxPossiblePoints) * 100;
    let emoji;
    if(percentage >= 80){
        emoji = '🎉';
    }
    if(percentage < 80 && percentage >= 60){
        emoji = '😐';
    }
    if(percentage < 60){
        emoji = '😢';
    }

    return (
        <>
        <p className="result"> 
        <span>{emoji}</span>You scored<srtong>{points}</srtong> 
        out of{maxPossiblePoints}({
            Math.ceil(percentage)
        } %)</p>
        <p className="highscore"> (Highscore:{highscore} points)</p>
        <button className="btn btn-ui" 
            onClick={()=>dispatch({type:"restart"})}>Reastrt Quiz</button>
        
        </>
        
    )
}

export default FinishScreen
