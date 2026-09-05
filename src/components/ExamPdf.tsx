type ExamPdfProps = {
  src: string;
  title: string;
};

export default function ExamPdf({src, title}: ExamPdfProps) {
  return (
    <>
      <div className="exam-pdf-actions">
        <a
          className="button button--primary exam-pdf-open-button"
          href={src}
          target="_blank"
          rel="noopener noreferrer">
          Open PDF
        </a>
      </div>
      <iframe
        className="exam-pdf-frame"
        src={src}
        title={title}
        loading="lazy"
      />
    </>
  );
}
