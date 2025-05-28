//Kaan Civelek
const API_URL = 'http://localhost:3000';

const request = async (endpoint, method = 'GET', body = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}` // �stersen token da ekleyebilirsin
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
        if (contentType?.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Bir hata olu�tu.');
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Bir hata olu�tu.');
        }
    }

    if (contentType?.includes('application/json')) {
        return response.json();
    } else {
        return response.text(); // Success gibi bir text d�nerse
    }
};

export default request;
