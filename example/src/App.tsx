import React from "react";
import "./index.css";
import GiftCard from "./components/GiftCard";
import SetPassword from "./components/SetPassword";
import "react-form-decorator/dist/index.css";

const App = () => {
  return (
    <div className="form">
      <GiftCard />
      <SetPassword />
    </div>
  );
};

export default App;
