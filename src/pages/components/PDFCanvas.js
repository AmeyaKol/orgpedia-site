import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useState, useRef, useEffect } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PDFCanvas({ pdfUrl }) {
  const canvasRef = useRef(null);
  const annotationCanvasRef = useRef(null);
  const [labelList, setlabelList] = useState([]);
  const annotation = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const annotationCanvas = annotationCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const annotationCtx = annotationCanvas.getContext("2d");

    let pdfDoc = null;
    let pageNum = 1;
    let pageRendering = false;
    let pageNumPending = null;
    const handleClick = (event) => {
      // const annotationCanvas = annotationCanvasRef.current;
      // const annotationCtx = annotationCanvas.getContext("2d");

      const x = event.nativeEvent.offsetX;
      const y = event.nativeEvent.offsetY;

      annotationCtx.beginPath();
      // annotationCtx.strokeStyle = "blue";
      annotationCtx.rect(x - 25, y - 25, 50, 50);
      // annotationCtx.lineWidth = 2;
      annotationCtx.stroke();
      console.log("clicked on pdf");
    };
    onmousedown = function (e) {
      var pos = getMousePos(canvas, e);
      var x = pos.x;
      var y = pos.y;
      console.log("mousedown");
      console.log(x, y);
      annotation.current = [x, y];
    };

    onmouseup = function (e) {
      var pos = getMousePos(canvas, e);
      var x = pos.x;
      var y = pos.y;
      console.log("mouseup");
      console.log(x, y);
      // console.log(canvasRef.current.style);
      var startX = annotation.current[0];
      var startY = annotation.current[1];
      var width = x - startX;
      var height = y - startY;
      // canvasRef.current.style.border = "2px solid black";
      // ctx.strokeStyle = "red";
      ctx.stroke();
      ctx.strokeRect(startX, startY, width, height);
      setlabelList([...labelList, { startX, startY, width, height }]);
      annotation.current = [];
    };
    const getMousePos = (canvas, evt) => {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      };
    };

    const renderPage = (num) => {
      pageRendering = true;
      pdfDoc.getPage(num).then((page) => {
        const viewport = page.getViewport({ scale: 1 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: ctx,
          viewport,
        };
        const renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
          pageRendering = false;
          if (pageNumPending !== null) {
            renderPage(pageNumPending);
            pageNumPending = null;
          }
        });
      });

      // Clear annotation canvas
      annotationCtx.clearRect(
        0,
        0,
        annotationCanvas.width,
        annotationCanvas.height
      );
    };

    const queueRenderPage = (num) => {
      if (pageRendering) {
        pageNumPending = num;
      } else {
        renderPage(num);
      }
    };

    pdfjs.getDocument(pdfUrl).promise.then((pdfDoc_) => {
      if (pdfDoc !== null) pdfDoc.destroy();
      pdfDoc = pdfDoc_;
      renderPage(pageNum);
    });

    annotationCanvas.addEventListener("click", handleClick);
    return () => {
      annotationCanvas.removeEventListener("click", handleClick);
    };
  }, [pdfUrl, annotation]);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
      <canvas
        ref={annotationCanvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      ></canvas>
    </>
  );
}

export default PDFCanvas;
