type PdfProps = {
  src: string;
  title: string;
};

export default function Pdf({src, title}: PdfProps) {
  return (
    <>
      <div className="pdf-actions">
        <a
          className="button button--primary pdf-open-button"
          href={src}
          target="_blank"
          rel="noopener noreferrer">
          Open PDF
        </a>
      </div>
      <iframe
        className="pdf-frame"
        src={src}
        title={title}
        loading="lazy"
      />
    </>
  );
}
