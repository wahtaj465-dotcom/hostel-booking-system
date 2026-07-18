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
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Notifications</h2>
        <p className="mt-1 text-slate-400">Updates about bookings and system events.</p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            className="rounded-3xl border border-[#ff6f3d]/25 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,111,61,0.12),0_25px_60px_rgba(0,0,0,0.45)]"
          >
            <p className="text-slate-100">{n.message}</p>
            <small className="text-slate-500">{n.createdAt}</small>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-slate-400">
          No notifications yet.
        </div>
      )}
    </div>
  );
}