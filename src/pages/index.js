import PDFCanvas from 'src/pages/components/PDFCanvas.js';
export default function Home()
{
    return <div className="main-content">
        <h1>File name</h1>
        <PDFCanvas pdfUrl="/htmlcheatsheet.pdf" />
    </div>
}