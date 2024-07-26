import { useState } from "react";

const messages = [
  "Learn React ⚛️",
  "Apply for jobs 💼",
  "Invest your new income 🤑",
];

export default function App() {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  function handlePrev() {
    if (step > 1) setStep(step - 1);
  }
  function handleNext() {
    if (step < 3) setStep(step + 1);
  }
  return (
    <>
      <button className="close" onClick={() => setIsOpen(!isOpen)}>
        X
      </button>
      {isOpen && (
        <div className="steps">
          <div className="numbers">
            <div className={step >= 1 ? "active" : ""}>1</div>
            <div className={step >= 2 ? "active" : ""}>2</div>
            <div className={step >= 3 ? "active" : ""}>3</div>
          </div>

          <Step step={step}>{messages[step - 1]}</Step>

          <div className="buttons">
            <Button textColor="#fff" bgColor="#7950f2" onClick={handlePrev}>
              <span>←</span>Prev
            </Button>
            <Button textColor="#fff" bgColor="#7950f2" onClick={handleNext}>
              Next<span>→</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function Step({ step, children }) {
  return (
    <p className="message">
      <h3> Step {step} </h3>
      {children}
    </p>
  );
}
function Button({ textColor, bgColor, onClick, children }) {
  return (
    <button
      style={{ backgroundColor: bgColor, color: textColor }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
