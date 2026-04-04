import { useEffect, useState } from "react";
import { getNotifications } from "../services/notifications";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications().then((res) => setNotifications(res.data || []));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Notifications
        </h2>
        <p className="mt-1 text-slate-600">
          Updates about bookings and system events.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]"
          >
            <p className="text-slate-900">{n.message}</p>
            <small className="text-slate-500">{n.createdAt}</small>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 text-slate-600">
          No notifications yet.
        </div>
      )}
    </div>
  );
}