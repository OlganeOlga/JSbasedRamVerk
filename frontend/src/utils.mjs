const localBackend = "http://localhost:3000";
const utils = {

    /**
     * Fetch route functionality to the React component
     * @async
     * 
     * @param {string |null} userName name of the user
     * @param {string} [passedMethod='GET'] - HTTP method ('GET', 'POST', etc.)
     * @param {object|null} [body=null] - Request body (used only for POST/PUT requests)
     * @param {object} [headers={}] - Request headers
     * 
     * @param {string} route : express-route route
     * @returns {Promise<array>}: returns one ore more dokuments as array
     */
    processRoute : async function processRoute(userName, passedMethod = 'GET', 
        route = "/data", body = null, headers = {}) {
        const url = localBackend + route;
        
        const defaultHeaders = { 'Content-Type': 'application/json'};
        const mergeHeaders = {...defaultHeaders, ...headers};

        const options = {
            method: passedMethod,
            headers: mergeHeaders,
            body: body ? JSON.stringify(body) : null, 
        };

        try {
            // Pass the URL and options to fetch
            console.log(`Fetching data from URL: ${url} with options:`, options)
            const response = await fetch(url, options);
            console.log("Respons of the processRoute", response)
            if (!response.ok) {
                console.log(`HTTP error! Status: ${response.status}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            
  
            // Check if user exists, and return the documents, otherwise return a message
            if(result) {
                return {
                    status: response.status,
                    result: result
                };
        ;
            }
             throw new Error(`User with name ${userName} not found`);

        } catch (error) {
            console.log('Failed to fetch documents in processRoute.processRoute:', error);
            return error;
        }
    },

    /**
     * Reload documents on the page
     * @async
     * 
     * @param {string |null} userName name of the user
     * @param {function} setDocuments 
     * @param {function} setLoading
     * 
     * @returns {void}
     */
    loadDocuments: async function loadDocuments(userName, setDocuments, setLoading) {
        try {
            const result = await this.processRoute(userName,'GET'); // Call fetch function here
            if (result) {
                console.log(result.result);
                console.log('User being searched for:', userName);
                const user = result.result.find(user => user.username === userName);
                console.log(user.documents);
                setDocuments(user.documents); // Update documents state
            } else {
                setDocuments([]); // Handle no documents case
            }
        } catch (error) {
            console.error("Error loading documents:", error);
            setDocuments([]); // Reset documents on error
        } finally {
            setLoading(false); // Stop loading state
        }
    },
}

export default utils;
