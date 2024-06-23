import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { ref } from 'vue';

import Globals from '/src/services/Globals';


export default class Authentication {

  constructor() {
    this.token = null;
    this.isLoggedIn = ref(false);
    this.userData = null;
  }

  async login (username, password) {
    try {
      let tokenResponse = await axios.post(Globals.SERVER_URL + "/users/login", {
        username: username,
        password: password
      });

      

      let token = tokenResponse.data;
      let decodedJwt = jwt_decode(token);
      console.log(decodedJwt);
      this.userData = decodedJwt
      localStorage.setItem('token_exp', decodedJwt.exp);
      localStorage.setItem('token_pseudonym', decodedJwt.pseudonym);
    } catch (err) {
      throw err;
    }
  }

  async logout () {
    try {
      await axios.get(Globals.SERVER_URL + "/users/logout");
      localStorage.removeItem('token_exp');
      localStorage.removeItem('token_pseudonym');
    } catch (err) {
      throw err;
    }
  }

  async register (name, email, password) {
    console.log(name, email, password);
    return axios.post(Globals.SERVER_URL + "/users/register", {
      name: name,
      email: email,
      password: password
    });
  }

  async selfRegister (password) {
    return axios.post(Globals.SERVER_URL + "/users/self-register", {
      password: password
    });
  }

  getLogin () {
    return localStorage.getItem('token_pseudonym');
  }
  
  tokenExpired() {
    let now = Math.round(Date.now() / 1000) // Current date in epoch (seconds since unix epoch)
    let tokenExpiration = localStorage.getItem('token_exp');

    if(tokenExpiration) {
      if(now < tokenExpiration) {
        return false;
      }
    }

    return true;
  }

  isAuthorized() {
    if( this.tokenExpired() ) {
      this.isLoggedIn.value = false;
    }
    else {
      this.isLoggedIn.value = true;
    }
    return this.isLoggedIn.value;
  }
}