import camelCase from 'camelcase';
import Handlebars from 'handlebars/runtime';

import templateClient from '../templates/client.hbs';
import templateCoreApiError from '../templates/core/ApiError.hbs';
import templateCoreApiRequestOptions from '../templates/core/ApiRequestOptions.hbs';
import templateCoreApiResult from '../templates/core/ApiResult.hbs';
import axiosGetHeaders from '../templates/core/axios/getHeaders.hbs';
import axiosGetRequestBody from '../templates/core/axios/getRequestBody.hbs';
import axiosGetResponseBody from '../templates/core/axios/getResponseBody.hbs';
import axiosGetResponseHeader from '../templates/core/axios/getResponseHeader.hbs';
import axiosRequest from '../templates/core/axios/request.hbs';
import axiosSendRequest from '../templates/core/axios/sendRequest.hbs';
import templateCoreBaseHttpRequest from '../templates/core/BaseHttpRequest.hbs';
import templateCancelablePromise from '../templates/core/CancelablePromise.hbs';
import fetchGetHeaders from '../templates/core/fetch/getHeaders.hbs';
import fetchGetRequestBody from '../templates/core/fetch/getRequestBody.hbs';
import fetchGetResponseBody from '../templates/core/fetch/getResponseBody.hbs';
import fetchGetResponseHeader from '../templates/core/fetch/getResponseHeader.hbs';
import fetchRequest from '../templates/core/fetch/request.hbs';
import fetchSendRequest from '../templates/core/fetch/sendRequest.hbs';
import functionBase64 from '../templates/core/functions/base64.hbs';
import functionCatchErrorCodes from '../templates/core/functions/catchErrorCodes.hbs';
import functionGetFormData from '../templates/core/functions/getFormData.hbs';
import functionGetQueryString from '../templates/core/functions/getQueryString.hbs';
import functionGetUrl from '../templates/core/functions/getUrl.hbs';
import functionIsBlob from '../templates/core/functions/isBlob.hbs';
import functionIsFormData from '../templates/core/functions/isFormData.hbs';
import functionIsString from '../templates/core/functions/isString.hbs';
import functionIsStringWithValue from '../templates/core/functions/isStringWithValue.hbs';
import functionIsSuccess from '../templates/core/functions/isSuccess.hbs';
import functionResolve from '../templates/core/functions/resolve.hbs';
import templateCoreHttpRequest from '../templates/core/HttpRequest.hbs';
import templateCoreSettings from '../templates/core/OpenAPI.hbs';
import templateCoreRequest from '../templates/core/request.hbs';
import xhrGetHeaders from '../templates/core/xhr/getHeaders.hbs';
import xhrGetRequestBody from '../templates/core/xhr/getRequestBody.hbs';
import xhrGetResponseBody from '../templates/core/xhr/getResponseBody.hbs';
import xhrGetResponseHeader from '../templates/core/xhr/getResponseHeader.hbs';
import xhrRequest from '../templates/core/xhr/request.hbs';
import xhrSendRequest from '../templates/core/xhr/sendRequest.hbs';

export const registerHandlebarHelpers = (): void => {
    Handlebars.registerHelper('camelCase', camelCase);

    Handlebars.registerHelper(
        'equals',
        function (this: unknown, a: string, b: string, options: Handlebars.HelperOptions) {
            return a === b ? options.fn(this) : options.inverse(this);
        }
    );

    Handlebars.registerHelper('ifdef', function (this: unknown, ...args): string {
        const options = args.pop();
        if (!args.every(value => !value)) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper(
        'notEquals',
        function (this: unknown, a: string, b: string, options: Handlebars.HelperOptions) {
            return a !== b ? options.fn(this) : options.inverse(this);
        }
    );
};

export interface Templates {
    client: Handlebars.TemplateDelegate;
    core: {
        apiError: Handlebars.TemplateDelegate;
        apiRequestOptions: Handlebars.TemplateDelegate;
        apiResult: Handlebars.TemplateDelegate;
        baseHttpRequest: Handlebars.TemplateDelegate;
        cancelablePromise: Handlebars.TemplateDelegate;
        httpRequest: Handlebars.TemplateDelegate;
        request: Handlebars.TemplateDelegate;
        settings: Handlebars.TemplateDelegate;
    };
}

/**
 * Read all the Handlebar templates that we need and return a wrapper object
 * so we can easily access the templates in our generator/write functions.
 */
export const registerHandlebarTemplates = (): Templates => {
    registerHandlebarHelpers();

    // Main templates (entry points for the files we write to disk)
    const templates: Templates = {
        client: Handlebars.template(templateClient),
        core: {
            apiError: Handlebars.template(templateCoreApiError),
            apiRequestOptions: Handlebars.template(templateCoreApiRequestOptions),
            apiResult: Handlebars.template(templateCoreApiResult),
            baseHttpRequest: Handlebars.template(templateCoreBaseHttpRequest),
            cancelablePromise: Handlebars.template(templateCancelablePromise),
            httpRequest: Handlebars.template(templateCoreHttpRequest),
            request: Handlebars.template(templateCoreRequest),
            settings: Handlebars.template(templateCoreSettings),
        },
    };

    // Generic functions used in 'request' file @see src/templates/core/request.hbs for more info
    Handlebars.registerPartial('functions/base64', Handlebars.template(functionBase64));
    Handlebars.registerPartial('functions/catchErrorCodes', Handlebars.template(functionCatchErrorCodes));
    Handlebars.registerPartial('functions/getFormData', Handlebars.template(functionGetFormData));
    Handlebars.registerPartial('functions/getQueryString', Handlebars.template(functionGetQueryString));
    Handlebars.registerPartial('functions/getUrl', Handlebars.template(functionGetUrl));
    Handlebars.registerPartial('functions/isBlob', Handlebars.template(functionIsBlob));
    Handlebars.registerPartial('functions/isFormData', Handlebars.template(functionIsFormData));
    Handlebars.registerPartial('functions/isString', Handlebars.template(functionIsString));
    Handlebars.registerPartial('functions/isStringWithValue', Handlebars.template(functionIsStringWithValue));
    Handlebars.registerPartial('functions/isSuccess', Handlebars.template(functionIsSuccess));
    Handlebars.registerPartial('functions/resolve', Handlebars.template(functionResolve));

    // Specific files for the fetch client implementation
    Handlebars.registerPartial('fetch/getHeaders', Handlebars.template(fetchGetHeaders));
    Handlebars.registerPartial('fetch/getRequestBody', Handlebars.template(fetchGetRequestBody));
    Handlebars.registerPartial('fetch/getResponseBody', Handlebars.template(fetchGetResponseBody));
    Handlebars.registerPartial('fetch/getResponseHeader', Handlebars.template(fetchGetResponseHeader));
    Handlebars.registerPartial('fetch/request', Handlebars.template(fetchRequest));
    Handlebars.registerPartial('fetch/sendRequest', Handlebars.template(fetchSendRequest));

    // Specific files for the xhr client implementation
    Handlebars.registerPartial('xhr/getHeaders', Handlebars.template(xhrGetHeaders));
    Handlebars.registerPartial('xhr/getRequestBody', Handlebars.template(xhrGetRequestBody));
    Handlebars.registerPartial('xhr/getResponseBody', Handlebars.template(xhrGetResponseBody));
    Handlebars.registerPartial('xhr/getResponseHeader', Handlebars.template(xhrGetResponseHeader));
    Handlebars.registerPartial('xhr/request', Handlebars.template(xhrRequest));
    Handlebars.registerPartial('xhr/sendRequest', Handlebars.template(xhrSendRequest));

    // Specific files for the axios client implementation
    Handlebars.registerPartial('axios/getHeaders', Handlebars.template(axiosGetHeaders));
    Handlebars.registerPartial('axios/getRequestBody', Handlebars.template(axiosGetRequestBody));
    Handlebars.registerPartial('axios/getResponseBody', Handlebars.template(axiosGetResponseBody));
    Handlebars.registerPartial('axios/getResponseHeader', Handlebars.template(axiosGetResponseHeader));
    Handlebars.registerPartial('axios/request', Handlebars.template(axiosRequest));
    Handlebars.registerPartial('axios/sendRequest', Handlebars.template(axiosSendRequest));

    return templates;
};
