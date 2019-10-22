import {Injectable} from '@angular/core';

@Injectable()
export class FilterService {
  private filter = [];

  getData() {
    return this.filter;
  }

  updateData(data) {
    this.filter = data;
  }
}
