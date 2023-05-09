import { useState } from "react";
import AnnotationsContext from "@/pages/contexts/AnnotationsContext";
import { useContext } from "react";

const Annotations = () => {
  const { annotations, deleteAnnotation } = useContext(AnnotationsContext);

  return (
    <div className="annotationsList">
      <h3>Annotations</h3>
      <ul>
        {annotations.map((annotation) => (
          <li key={annotation.id} style={{ color: annotation.color }} onClick={deleteAnnotation(annotation.id)}>
            <h4>{annotation.label}</h4>
            <p>
              {annotation.x}, {annotation.y}, {annotation.width},{" "}
              {annotation.height}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Annotations;
