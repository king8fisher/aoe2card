import * as fs from 'node:fs';
import * as path from 'node:path';

/**

Usage:

```ts
fetchAndSaveBinary('https://aoe2techtree.net/img/Techs/unique_tech_1.png', 'output.png').catch((err) => {
  console.error('error caught:', err);
});
```
 
@param url 
@param filePath 
@returns 

*/
export async function fetchAndSaveBinary(url: string, filePath: string) {
  const response = await fetch(url);
  if (response.ok && response.body) {
    const dest = fs.createWriteStream(path.resolve(filePath), {
      emitClose: true
    });
    // dest.on('finish', () => {
    //   //console.log('File downloaded and saved successfully.');
    // });
    dest.on('error', (err) => {
      throw new Error('writing error', { cause: err });
    });
    // dest.on('close', () => {
    //   console.log('stream closed');
    // });

    const stream = new WritableStream({
      write(chunk) {
        dest.write(chunk);
      },
      close() {
        dest.end();
      },
      abort(err) {
        throw new Error('stream aborted', { cause: err });
      }
    });
    await response.body.pipeTo(stream);
    await new Promise<void>((resolve, reject) => {
      dest.on('finish', () => resolve());
      dest.on('error', reject);
    });
    return { status: 'ok ' };
  } else {
    throw new NotFoundError(url, response.status);
  }
}

export class NotFoundError extends Error {
  private _url: string;
  private _status: number;
  constructor(url: string, status: number) {
    super(`Resource not found at ${url} with status ${status}`);
    this._url = url;
    this._status = status;
    this.name = 'NotFoundError';
  }
  get url() {
    return this._url;
  }
  get status() {
    return this._status;
  }

}
