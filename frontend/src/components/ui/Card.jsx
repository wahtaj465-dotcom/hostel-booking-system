export function Card({ className = "", ...props }) {
  return (
    <div
      className={[
        "rounded-3xl border border-slate-200/70 bg-white/80 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }) {
  return <div className={["p-6", className].join(" ")} {...props} />;
}

export function CardContent({ className = "", ...props }) {
  return <div className={["px-6 pb-6", className].join(" ")} {...props} />;
}