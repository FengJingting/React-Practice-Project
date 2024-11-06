import {useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "INC":
      return { ...state, count: state.count + state.step };
    case "DEC":
      return { ...state, count: state.count - state.step };
    case "SET_COUNT":
      return { ...state, count: action.payload };
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "RESET":
      return { ...state, count: 0, step: 1 };
    default:
      return state;
  }
}
function DateCounter() {
  // const [count, setCount] = useState(0);
  // const [step, setStep] = useState(1);
  const initialState = { count: 0, step: 1 };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, step } = state;//解构
  // This mutates the date object.
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  const dec = function () {
    dispatch({ type: "DEC" });
    // setCount((count) => count - 1);
    // setCount((count) => count - step);
  };

  const inc = function () {
    dispatch({ type: "INC" });
    // setCount((count) => count + 1);
    //setCount((count) => count + step);
  };

  const defineCount = function (e) {
    dispatch({ type: "SET_COUNT", payload: Number(e.target.value) });
    //setCount(Number(e.target.value));
  };

  const defineStep = function (e) {
    dispatch({ type: "SET_STEP", payload: Number(e.target.value) });
    //setStep(Number(e.target.value));
  };

  const reset = function () {
    dispatch({ type: "RESET" });
    //setCount(0);
    //setStep(1);
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
