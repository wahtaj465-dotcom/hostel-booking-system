export function Card({ className = "", ...props }) {
  return (
    <div
      className={[
        "rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
        "shadow-[0_0_0_1px_rgba(255,122,69,0.2),0_26px_60px_rgba(0,0,0,0.45)] backdrop-blur",
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