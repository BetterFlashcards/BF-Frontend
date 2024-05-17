import axios from "axios";

const Client = axios.create({
  baseURL: "http://18.234.173.119/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default Client;
