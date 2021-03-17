import axios from 'axios';

const username = process.env.VUE_APP_USER
const password = process.env.VUE_APP_PASSWORD
const url = process.env.VUE_APP_URL

export default class DashboardService {
    async getIncome() {
        return axios.get(url + '/get-dashboard/', {
            auth: {
                username,
                password
            }
        }).then(res => res.data);
    }
}
