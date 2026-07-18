import api from "./api";

export const getRooms = () => api.get("/hostels");
export const getRoom = (id) => api.get(`/hostels/${id}`);
export const createRoom = (data) => api.post("/hostels", data);
export const reduceBed = (id) => api.patch(`/hostels/${id}/reduce-bed`);
export const increaseBed = (id) => api.patch(`/hostels/${id}/increase-bed`);