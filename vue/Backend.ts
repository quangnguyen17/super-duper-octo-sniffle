import axios from 'axios';

class Backend {
    static parseError(error: any) {
        let errMsg = '';
        if (error.response) {
            // console.log(error.response);
            if (error.response.data) {
                errMsg = error.response.data;
            } else {
                errMsg = error.response;
            }
        } else {
            errMsg = JSON.stringify(error, null, 2);
        }
        return errMsg;
    }

    static async getCurrentUser() {
        const { data } = await axios.get('/currentUser');
        return data;
    }

    static async getGames() {
        const { data } = await axios.get('/games');
        return data;
    }

    static async getGameById(gameId: string) {
        const { data } = await axios.get(`/games?gameId${gameId}`);
        return data[0];
    }

    static async addGame(game: any) {
        const { data } = await axios.post('/games', game);
        return data[0];
    }

    static async updateGame(gameId: string, updateData: any) {
        const { data } = await axios.get(`/games?gameId${gameId}`);
        return data[0];
    }

    static async getUsers() {
        const { data } = await axios.get('/users');
        return data;
    }

    static async addUser(user: any) {
        const { data } = await axios.post('/users', user);
        return data;
    }

    static async updateUser(user: any) {
        const { data } = await axios.put('/users', user);
        return data;
    }

    static async deleteUser(userId: string) {
        const { data } = await axios.delete(`/users?userId=${userId}`);
        return data;
    }

    static async getRoles() {
        const { data } = await axios.get('/roles');
        return data.map((role: any) => role.role);
    }

    static async getLanguages() {
        const { data } = await axios.get('/languages');
        return data.map((language: any) => language.languageCode.toLowerCase());
    }

    static async getCategories() {
        const { data } = await axios.get('/categories');
        return data.map((category: any) => category.categoryId);
    }

    static async getCurrencies() {
        const { data } = await axios.get('/currencies');
        return data.map((currency: any) => currency.currencyCode);
    }

    static async getCountries() {
        const { data } = await axios.get('/countries');
        return data.map((country: any) => country.countryName);
    }

    // fixtures
    static async getFixtures() {
        const { data } = await axios.get('/fixtures');
        return data;
    }

    static async addFixture(fixture: any) {
        const { data } = await axios.post('/fixtures', fixture);
        return data;
    }

    static async updateFixture(fixture: any) {
        const { data } = await axios.put('/fixtures', fixture);
        return data;
    }

    static async deleteFixture(_id: string) {
        const { data } = await axios.delete(`/fixtures?_id=${_id}`);
        return data;
    }

    static async invokeFixtureEndpoint(endpoint: string) {
        const axiosInstance = axios.create();
        try {
            const { data } = await axiosInstance.get(endpoint);
            return Promise.resolve(data);
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

export default Backend;