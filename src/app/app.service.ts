import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }
  GetData(){
    return axios.get('../assets/data.json');
  }
}
