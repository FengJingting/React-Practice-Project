import React from "react";
import ReactDOM from "react-dom/client";

// import "./index.css";
// import App from "./App";

import StarRating from "./StarRating";

function Test() {
  const [moviwRating, setMovieRating] = React.useState(0);
  return (
    <div>
      <StarRating
        color="blue"
        maxRating={10}
        onSetRating={setMovieRating}
      ></StarRating>
      <p>This movie was rated {moviwRating} stars.</p>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);
root.render(
  <React.StrictMode>
    <StarRating
      maxRating={5}
      className="test"
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <Test />
  </React.StrictMode>
);
