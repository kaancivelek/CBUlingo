//Kaan Civelek
const API_URL = 'http://localhost:3000';

/**
 * Generic API request handler with error handling and response parsing
 * @param {string} endpoint - API endpoint to call
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} body - Request body for POST/PUT requests
 * @returns {Promise} Parsed response data
 */
const request = async (endpoint, method = 'GET', body = null) => {
    // Configure request options
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}` // Optional token authentication
        },
    };

    // Add request body if provided
    if (body) {
        options.body = JSON.stringify(body);
    }

    // Make API request
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const contentType = response.headers.get('content-type');

    // Handle error responses
    if (!response.ok) {
        if (contentType?.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Bir hata oluştu.');
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Bir hata oluştu.');
        }
    }

    // Parse successful response based on content type
    if (contentType?.includes('application/json')) {
        return response.json();
    } else {
        return response.text(); // Handle text responses
    }
};

export default request;
