import { Injectable } from '@angular/core';
import { WakandaClient } from 'wakanda-client/browser/no-promise';

@Injectable()
export class Wakanda {

    private client: WakandaClient;
    private catalog;

    constructor() {
        /**
         * You can pass in the `host` property if you are connecting to a different host:
         * this._client = new WakandaClient({ host: 'http://127.0.0.1:8081' });
         * 
         * More info available at : https://wakanda.github.io/doc/#/guide?section=main-data-cs-instance
         */
        this.client = new WakandaClient({ host: 'http://127.0.0.1:8081' });
        this.catalog = null;
    }

    getCatalog() {
        /**
         * If your catalog doesn't change during the lifetime of your user session,
         * you can store it to avoid unnecessary network requests.
         */
        if (!this.catalog) {
            /**
             * More info on `getCatalog` method at : https://wakanda.github.io/doc/#/guide?section=main-data-cs-instance
             */
            return this.client.getCatalog().then(c => {
                this.catalog = c;

                return c;
            });
        }
        
        /**
         * Return the cached version of the catalog
         */
        return Promise.resolve(this.catalog);
    }

    get directory() {
        return this.client.directory;
    }
}
