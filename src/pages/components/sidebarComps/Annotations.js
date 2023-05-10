import AnnotationsContext from "@/pages/contexts/AnnotationsContext";
import { useEffect, useState } from "react";
import { useContext } from "react";

const Annotations = () => {
  const [list, setList] = useState([]);
  const { annotations, deleteAnnotation } = useContext(AnnotationsContext);
  useEffect(() => {
    setList(annotations);
  }, [annotations]);
  return (
    <div className="annotationsList">
      <h3>Annotations</h3>
      {list.length === 0 ? (
        <p>No annotations yet</p>
      ) : (
        <ul style={{ backgroundColor: "" }}>
          {list.map((annotation) => {
            return (
              <li key={annotation.id} style={{ color: annotation.color }}>
                <h5>{annotation.label}</h5>
                <p>
                  {annotation.x}, {annotation.y}, {annotation.width},{" "}
                  {annotation.height}
                </p>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    deleteAnnotation(annotation.id);
                    setList((prevList) =>
                      prevList.filter((item) => item.id !== annotation.id)
                    );
                  }}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Annotations;
