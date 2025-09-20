import axios from "axios";


export const api = axios.create({
  baseURL: "http://192.168.1.7:3000",
  timeout:10000,
});


//interceptor loco para cuando no tenga acceso
api.interceptors.response.use(
  response=>response,
  error=>{
    if(error.response?.status===401){
      console.log("Token invalido o expirado, de vuelta pal login");

      
    }
  }
)

