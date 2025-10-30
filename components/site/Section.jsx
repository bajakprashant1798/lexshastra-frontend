export default function Section({ id, className="", children }) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-4 py-16 ${className}`}>
      {children}
    </section>
  );
}
