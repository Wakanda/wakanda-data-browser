import { Injectable } from '@angular/core';

@Injectable()
export class Config {
    public readonly host = 'http://127.0.0.1:8081';

    constructor() { }
}