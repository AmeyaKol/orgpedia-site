import React from "react";
import { useState, useContext } from "react";
import LabelContext from "./LabelContext";

const LabelState = (props) => {
  const context = useContext(LabelContext);
  const [label, setLabel] = useState(null);
  const updateLabel = (label) => {
    setLabel(label);
  };
  return (
    <LabelContext.Provider value={{ label, updateLabel }}>
      {props.children}
    </LabelContext.Provider>
  );
};

export default LabelState;
