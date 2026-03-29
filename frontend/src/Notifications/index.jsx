import { useEffect, useState } from "react";
import { getNotifications } from "../services/notifications";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications().then((res) => setNotifications(res.data || []));
  }, []);

  return (
    <div className="min-h-screen px-6 py-10">
      <h2 className="text-3xl font-bold">Notifications</h2>

      <div className="mt-6 space-y-3">
        {notifications.map((n) => (
          <div key={n._id} className="bg-[var(--glass)] p-4 rounded-xl border border-[var(--glass-border)]">
            <p>{n.message}</p>
            <small className="text-[var(--muted)]">{n.createdAt}</small>
          </div>
        ))}
      </div>
    </div>
  );
}