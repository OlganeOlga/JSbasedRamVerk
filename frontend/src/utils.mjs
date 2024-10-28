const localBackend = "http://localhost:3000";
const remoteBackend = "https://jsramverk-oleg22-g9exhtecg0d2cda5.northeurope-01.azurewebsites.net/";

// Bestäm vilken backend som ska användas baserat på om vi kör lokalt eller i produktion
const backendUrl = window.location.hostname === 'localhost' ? localBackend : remoteBackend;

// const interface processRoute1result: Object {
//     ok: boolean,
//     status: number,
//     result: any, // Or a more specific type based on your data structure
//     message: string,
// };

const utils = {

    /**
     * Fetch route functionality to the React component
     * @async
     * 
     * @param {string} [passedMethod] - HTTP method ('GET', 'POST', etc.)
     * @param {string} [route]
     * @param {object|null} [body=null] - Request body (used only for POST/PUT requests)
     * @param {object} { [key: string]: string } = {} - Request headers
     * 
     * @param {string} route : express-route route
     * @returns {Promise<array>}: returns one ore more dokuments as array
     */
    processRoute : async function processRoute(passedMethod = 'GET', route = "/", body = null, headers = {}) {
        const url = backendUrl + route;
        console.log("route: ",route)
        // console.log(" url: ",url)

        const defaultHeaders = { 'Content-Type': 'application/json'};
        const mergeHeaders = {...defaultHeaders, ...headers};

        const options = {
            method: passedMethod,
            headers: mergeHeaders,
            body: body ? JSON.stringify(body) : null,
            //credentials: 'include' 
        };

        try {
            // Pass the URL and options to fetch
            const response = await fetch(url, options);
            console.log(response)
            
            if (!response.ok) {
                // console.log("reposns not OK")
                const errorData = await response.json();
                //console.error('Error:', errorData.message);  // Will print: 'No username found'
             
                return {
                    ok: response.ok,
                    status: response.status,
                    message: errorData.message,
                };
            }
            const result = await response.json();
            
            return {
                ok: response.ok,
                status: response.status,
                result: result
            };
        } catch (error) {
            console.log('Failed to fetch documents in processRoute.processRoute:', error);
            return error;
        }
    },

    // /**
    //  * Function handle request to the graphql route that
    //  * replase all previouse routes
    //  * @asynk
    //  * 
    //  * @param {object} params query for the request
    //  * @returns {object} resutl of the graphql request
    //  */
    // processGraphQl : async function processGraphQl(params) {
    //     const query = params;
    //     const respons = fetch('/graphql', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json',
    //         },
    //         body: JSON.stringify({ query: "{ courses { name } }" })
    //     })
    //     const result = await respons.json();
    //     console.log('data returned:', result.data);
    //     return result;
    // },
    //change for GRAPHQL in cookies

    
    /**
     * Fetch route functionality for making HTTP requests in a React component.
     * @async
     * 
     * @param {string} [body=''] - Request body (used only for POST/PUT requests).
     * 
     * @returns {Promise<processRoute1result>} - Returns a promise resolving to an object with the response status, data, or error message.
     */
    processRoute1: async function processRoute1(
        body = null, 
    )
     {
        console.log("from proceessRoute1, body: ", body)
        const url = backendUrl + '/graphql';
    
        const mergeHeaders = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                };
    
        const options = {
            method: 'POST',
            headers: mergeHeaders,
            body: body, //body is already json
            //credentials: 'include', // IMPORTANT: This ensures cookies (including HTTP-only cookies) are sent with requests
        };
    
        try {
            const response = await fetch(url, options);
            console.log("from process Route 1, respons: ", response)
    
            if (!response.ok) {
                const errorData = await response.json();
                return {
                    ok: response.ok,
                    status: response.status,
                    message: errorData.message
                };
            }
    
            const result = await response.json();
            console.log(result)
            return {
                ok: response.ok,
                status: response.status,
                result: result
            };
        } catch (error) {
            console.log('Failed to fetch documents in processRoute.processRoute:', error);
            return error;
        }
    },
}

export default utils;
