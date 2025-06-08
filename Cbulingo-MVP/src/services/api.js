//Kaan Civelek
import { dataService } from './dataService';

const request = async (endpoint, method = 'GET', body = null) => {
    // Endpoint'i parse et
    const [table, query] = endpoint.split('?');
    const tableName = table.replace('/', '');
    const id = table.split('/').pop();
    
    try {
        switch (method) {
            case 'GET':
                if (query) {
                    const [key, value] = query.split('=');
                    const decodedValue = decodeURIComponent(value);
                    
                    switch (tableName) {
                        case 'tblUsers':
                            if (key === 'userEmail') {
                                return dataService.getUserByEmail(decodedValue);
                            }
                            break;
                        case 'tblEnglish':
                            if (key === 'enId') {
                                return dataService.getEnglishWordById(parseInt(decodedValue));
                            } else if (key === 'enName') {
                                return dataService.getEnglishWordByName(decodedValue);
                            }
                            break;
                        case 'tblTurkish':
                            if (key === 'trId') {
                                return dataService.getTurkishWordById(parseInt(decodedValue));
                            }
                            break;
                        case 'tblTranslation':
                            if (key === 'enId') {
                                return dataService.getTranslationByEnId(parseInt(decodedValue));
                            }
                            break;
                        case 'tblLearnedWords':
                            if (key === 'userId') {
                                return dataService.getLearnedWordsByUserId(parseInt(decodedValue));
                            }
                            break;
                    }
                } else if (id && id !== tableName) {
                    // ID ile sorgulama
                    switch (tableName) {
                        case 'tblEnglish':
                            return dataService.getEnglishWordById(parseInt(id));
                        case 'tblTurkish':
                            return dataService.getTurkishWordById(parseInt(id));
                        case 'tblTranslation':
                            return dataService.getTranslationById(id);
                        case 'tblLearnedWords':
                            return dataService.getLearnedWordById(id);
                    }
                } else {
                    // Tüm listeyi getir
                    switch (tableName) {
                        case 'tblUsers':
                            return dataService.getUsers();
                        case 'tblEnglish':
                            return dataService.getEnglishWords();
                        case 'tblTurkish':
                            return dataService.getTurkishWords();
                        case 'tblLearningStages':
                            return dataService.getLearningStages();
                        case 'tblTranslation':
                            return dataService.getTranslations();
                        case 'tblLearnedWords':
                            return dataService.getLearnedWords();
                    }
                }
                break;

            case 'POST':
                switch (tableName) {
                    case 'tblUsers':
                        return dataService.addUser(body);
                    case 'tblEnglish':
                        return dataService.addEnglishWord(body);
                    case 'tblTurkish':
                        return dataService.addTurkishWord(body);
                    case 'tblTranslation':
                        return dataService.addTranslation(body);
                    case 'tblLearnedWords':
                        return dataService.addLearnedWord(body);
                }
                break;

            case 'PUT':
            case 'PATCH':
                if (query) {
                    const [key, value] = query.split('=');
                    const decodedValue = decodeURIComponent(value);
                    
                    switch (tableName) {
                        case 'tblUsers':
                            if (key === 'userEmail') {
                                return dataService.updateUser(decodedValue, body);
                            }
                            break;
                    }
                } else if (id && id !== tableName) {
                    switch (tableName) {
                        case 'tblEnglish':
                            return dataService.updateEnglishWord(id, body);
                        case 'tblTurkish':
                            return dataService.updateTurkishWord(id, body);
                        case 'tblTranslation':
                            return dataService.updateTranslation(id, body);
                        case 'tblLearningStages':
                            return dataService.updateLearningStage(id, body);
                    }
                }
                break;

            case 'DELETE':
                if (query) {
                    const [key, value] = query.split('=');
                    const decodedValue = decodeURIComponent(value);
                    
                    switch (tableName) {
                        case 'tblUsers':
                            if (key === 'userEmail') {
                                return dataService.deleteUser(decodedValue);
                            }
                            break;
                    }
                } else if (id && id !== tableName) {
                    switch (tableName) {
                        case 'tblEnglish':
                            return dataService.deleteEnglishWord(id);
                        case 'tblTurkish':
                            return dataService.deleteTurkishWord(id);
                        case 'tblTranslation':
                            return dataService.deleteTranslation(id);
                        case 'tblLearnedWords':
                            return dataService.deleteLearnedWord(id);
                    }
                }
                break;
        }
    } catch (error) {
        throw new Error(error.message || 'Bir hata oluştu.');
    }
};

export default request;
