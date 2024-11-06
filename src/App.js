import { useEffect, useReducer } from 'react';
// import DateCounter from './DateCounter';
import Header from './components/Header';
import Main from './Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import NextButton from './components/NextButton';
import Progress from './components/Progress';
import FinishScreen from './components/FinishScreen';
import Footer from './components/Footer';
import Timer from './components/Timer';

const initialState = {
    questions: [],
    // loading, error, ready, active, finished
    status:'loading',
    index:0,
    answer:null,
    points:0,
    highscore:0,
    secondsRemaining: null,
}

const SEC_PRE_QUESTION = 60;
function reducer(state, action){
    switch(action.type){
        case 'dataReceived':
            return{
                ...state,
                questions: action.payload,
                status: 'ready'

            };
        case 'dataFailed':
            return{
                ...state,
                status: 'error'
            };
        case 'start':
            return{
                ...state,
                status: 'active',
                secondsRemaining: SEC_PRE_QUESTION  * state.questions.length
            };
        case 'newAnswer':
            const question = state.questions[state.index];
            console.log(action.payload,question.correctOption)
            return{
                ...state,
                answer:action.payload,
                points: 
                action.payload === question.correctOption 
                ? state.points + question.points 
                : state.points
            };
        case 'nextQuestion':
            return{
                ...state,
                index: state.index + 1,
                answer: null
            };
        case 'finish':
            return{
                ...state,
                status: 'finished',
                highscore: Math.max(state.points, state.highscore)
            };
        case 'restart':
            return{
                ...initialState,
                questions: state.questions,
                status:'ready',
                
            };
        case 'tick':
            return{
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                status: state.secondsRemaining > 0 ? state.status : 'finished'
            };
        default:
            throw new Error('Invalid action type')
    }
}
export default function App(){
    const [{questions,status,index,answer,points,highscore,secondsRemaining}, dispatch] = useReducer(reducer, initialState)

    const numQuestions = questions.length
    const maxPossiblePoints = questions.reduce(
        (prev, cur)=>prev + cur.points,0);
    // call when on mount
    useEffect(function(){fetch("http://localhost:8000/questions") //fetch function return a promise
        .then((res)=>res.json())
        .then((data)=>dispatch({type:'dataReceived',payload: data}))
        .catch((err)=>dispatch({type:'dataFailed'}))},[])
    return(
        <div className='app'>
            <Header />
                
            <Main>
                x
                {status === "loading" && <Loader />}
                {status === "error" && <Error />}
                {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>}
                {status === "active" && (
                    <>
                        <Progress 
                            index={index} 
                            numQuestions={numQuestions} 
                            points={points}
                            maxPossiblePoints={maxPossiblePoints}
                            answer={answer} />
                            
                        <Question 
                            question = {questions[index]} 
                            dispatch={dispatch} 
                            answer={answer}/>
                        <Footer>
                            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
                            <NextButton 
                            dispatch={dispatch} 
                            answer={answer}
                            numQuestions={numQuestions}
                            index = {index} />
                        </Footer>
                        
                    </>
                )}
                {status === "finished" && 
                <FinishScreen 
                points={points} 
                maxPossiblePoints={maxPossiblePoints}
                highscore={highscore}
                dispatch={dispatch} />}
            </Main>
            
        </div>
    )
}