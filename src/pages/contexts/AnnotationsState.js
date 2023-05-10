import React, { useEffect } from "react";
import { useState, useContext } from "react";
import AnnotationsContext from "./AnnotationsContext";
import json from "json5";

const AnnotationsState = (props) => {
  const [annotations, setAnnotations] = useState([]);

  const updateAnnotations = (annotation) => {
    setAnnotations((prevAnnotations) => [...prevAnnotations, annotation]);
  };
  const deleteAnnotation = (id) => {
    setAnnotations((prevAnnotations) =>
      prevAnnotations.filter((annotation) => annotation.id !== id)
    );
  };
  return (
    <AnnotationsContext.Provider
      value={{ annotations, updateAnnotations, deleteAnnotation }}
    >
      {props.children}
    </AnnotationsContext.Provider>
  );
};

export default AnnotationsState;
