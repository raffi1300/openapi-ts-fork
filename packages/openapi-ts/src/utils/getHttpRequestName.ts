import type { Config } from '../types/config';

/**
 * Generate the HttpRequest filename based on the selected client
 * @param client The selected HTTP client (fetch, xhr, node or axios)
 */
export const getHttpRequestName = (client: Config['client']): string => {
    switch (client) {
        case 'axios':
            return 'AxiosHttpRequest';
        case 'fetch':
            return 'FetchHttpRequest';
        case 'node':
            return 'NodeHttpRequest';
        case 'xhr':
            return 'XHRHttpRequest';
    }
};
