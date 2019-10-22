import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class DataService {

  private messageData = new BehaviorSubject<string>('');
  currentData = this.messageData.asObservable();

  constructor() {}

  changeData(message: string) {
    this.messageData.next(message);
  }

}
