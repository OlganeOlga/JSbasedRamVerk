import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === "production"
//       ? "https://jaramverk-olga22-noahh-djczc2fnbcgheeb2.swedencentral-01.azurewebsites.net/"
//       : "http://localhost:3000";

const URL = "https://jaramverk-olga22-noahh-djczc2fnbcgheeb2.swedencentral-01.azurewebsites.net/"
export const socket = io(URL, {
    autoConnect: false
  });
