import axios from "axios";
const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});
export default {
  postEvent(event) {
    return apiClient.post("/events", event);
  },
  getEvents(page = 1, itemPerPage = 3) {
    return apiClient.get(`/events?_limit=${itemPerPage}&_page=${page}`);
  },
  getEvent(id) {
    return apiClient.get("/events/" + id);
  }
};
