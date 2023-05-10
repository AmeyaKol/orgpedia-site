import PDFCanvas from 'src/pages/components/PDFCanvas.js';
export default function Home()
{
    const url = "/htmlcheatsheet.pdf";
    const name = url.replace(/^.*[\\\/]/, '');
    return <div className="main-content">
        <h1>{name}</h1>
        <PDFCanvas url={url} />
    </div>
}