import type { ApiRequestOptions } from './ApiRequestOptions';
import { CancelablePromise } from './CancelablePromise';
import type { OpenAPIConfig } from './OpenAPI';

export const request = <T>(config: OpenAPIConfig, options: ApiRequestOptions): CancelablePromise<T> =>
    new CancelablePromise((resolve, reject, onCancel) => {
        const url = `${config.BASE}${options.path}`;

        try {
            // Do your request...
            const timeout = setTimeout(() => {
                resolve({
                    body: {
                        ...options,
                    },
                    ok: true,
                    status: 200,
                    statusText: 'dummy',
                    url,
                });
            }, 500);

            // Cancel your request...
            onCancel(() => {
                clearTimeout(timeout);
            });
        } catch (e) {
            reject(e);
        }
    });
