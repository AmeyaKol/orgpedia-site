import { useState } from "react";
import styles from "src/styles/Labels.module.css";

const Label = () => {
  const [active, setActive] = useState(-1);
  const labels = [
    "Title",
    "Copy",
    "Date",
    "Body",
    "Table",
    "OrderNumber",
    "Signature",
  ];
  const labelClick = (id) => {
    setActive(id);

  };
  return (
    <>
      <h3>Label</h3>
      <div className={styles.labelbtns}>
        {labels.map((label, index) => (
          <li
            key={label}
            style={{ backgroundColor: active === index && "lightgray" }}
          >
            <h5
              key={index}
              className="labelbtn"
              style={{ cursor: "pointer" }}
              onClick={() => labelClick(index)}
            >
              {label}
            </h5>
          </li>
        ))}
      </div>
    </>
  );
};

export default Label;
