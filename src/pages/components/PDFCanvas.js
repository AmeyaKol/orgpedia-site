import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useState, useRef, useEffect, useContext } from "react";
import LabelContext from "../contexts/LabelContext";
import AnnotationsContext from "../contexts/AnnotationsContext";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFCanvas = ({ url }) => {
  const pdfCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const { annotations, updateAnnotations } = useContext(AnnotationsContext);
  const { label, updateLabel } = useContext(LabelContext);
  const colors = {
    Title: "red",
    Copy: "orange",
    Date: "rgb(219, 216, 18)",
    Body: "green",
    Table: "blue",
    OrderNumber: "indigo",
    Signature: "violet",
  };
  useEffect(() => {
    const pdfCanvas = pdfCanvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    const pdfContext = pdfCanvas.getContext("2d");
    const overlayContext = overlayCanvas.getContext("2d");

    let pdfPage = null;

    // Load the PDF
    pdfjs.getDocument(url).promise.then(function (pdf) {
      // Get the first page of the PDF
      pdf.getPage(1).then(function (page) {
        pdfPage = page;

        // Set the PDF canvas dimensions to match the PDF page
        const viewport = page.getViewport({ scale: 1 });
        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;

        // Set the overlay canvas dimensions to match the PDF canvas
        overlayCanvas.width = pdfCanvas.width;
        overlayCanvas.height = pdfCanvas.height;

        // Render the PDF page on a separate canvas element
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        page.render(renderContext).promise.then(() => {
          pdfContext.drawImage(canvas, 0, 0);
        });
      });
    });

    // Add event listeners to the overlay canvas
    overlayCanvas.addEventListener("mousedown", handleMouseDown);
    overlayCanvas.addEventListener("mousemove", handleMouseMove);
    overlayCanvas.addEventListener("mouseup", handleMouseUp);
    overlayCanvas.addEventListener("mouseout", handleMouseUp);

    // Add a resize event listener to the window object
    window.addEventListener("resize", handleResize);

    return () => {
      // Remove event listeners when the component unmounts
      overlayCanvas.removeEventListener("mousedown", handleMouseDown);
      overlayCanvas.removeEventListener("mousemove", handleMouseMove);
      overlayCanvas.removeEventListener("mouseup", handleMouseUp);
      overlayCanvas.removeEventListener("mouseout", handleMouseUp);

      window.removeEventListener("resize", handleResize);
    };
  }, [url, label]);
  useEffect(() => {
    const canvas = pdfCanvasRef.current;
    const context = canvas.getContext("2d");

    function drawAnnotations() {
      // // clear the overlay canvas
      const overlayCanvas = overlayCanvasRef.current;
      const overlayContext = overlayCanvas.getContext("2d");
      // overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

      // draw each annotation as a rectangle
      annotations.forEach((annotation) => {
        overlayContext.strokeStyle = colors[annotation.label];
        overlayContext.lineWidth = 1;
        overlayContext.strokeText(
          annotation.label,
          annotation.x,
          annotation.y + annotation.height + 10
        );
        overlayContext.strokeRect(
          annotation.x,
          annotation.y,
          annotation.width,
          annotation.height
        );
        overlayContext.font = "18px consolas";
      });
    }
    drawAnnotations();
  }, [annotations]);
  const handleResize = () => {
    const pdfCanvas = pdfCanvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;

    // Set the overlay canvas dimensions to match the PDF canvas
    overlayCanvas.width = pdfCanvas.width;
    overlayCanvas.height = pdfCanvas.height;
  };

  const handleMouseDown = (e) => {
    if (label === null) {
      alert("Please select a label");
      return;
    }
    isDrawingRef.current = true;
    lastXRef.current = e.offsetX;
    lastYRef.current = e.offsetY;
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current) return;

    const overlayCanvas = overlayCanvasRef.current;
    const overlayContext = overlayCanvas.getContext("2d");
    overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    overlayContext.strokeStyle = colors[label];
    overlayContext.lineWidth = 2;
    overlayContext.strokeRect(
      lastXRef.current,
      lastYRef.current,
      e.offsetX - lastXRef.current,
      e.offsetY - lastYRef.current
    );
  };

  const handleMouseUp = (e) => {
    if (!isDrawingRef.current) return;
    const pdfCanvas = pdfCanvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    const pdfContext = pdfCanvas.getContext("2d");
    const overlayContext = overlayCanvas.getContext("2d");

    overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    annotations.forEach((annotation) => {
      overlayContext.strokeStyle = colors[annotation.label];
      overlayContext.lineWidth = 2;
      overlayContext.strokeRect(
        annotation.x,
        annotation.y,
        annotation.width,
        annotation.height
      );
    });
    overlayContext.strokeStyle = colors[label];
    overlayContext.lineWidth = 2;
    overlayContext.strokeRect(
      lastXRef.current,
      lastYRef.current,
      e.offsetX - lastXRef.current,
      e.offsetY - lastYRef.current
    );

    pdfContext.drawImage(
      overlayCanvas,
      0,
      0,
      pdfCanvas.width,
      pdfCanvas.height,
      0,
      0,
      pdfCanvas.width,
      pdfCanvas.height
    );
    updateAnnotations({
      x: lastXRef.current,
      y: lastYRef.current,
      width: e.offsetX - lastXRef.current,
      height: e.offsetY - lastYRef.current,
      label: label,
      color: colors[label],
    });
    isDrawingRef.current = false;
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas ref={pdfCanvasRef} />
      <canvas
        ref={overlayCanvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};

export default PDFCanvas;
