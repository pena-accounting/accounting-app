import axios from 'axios';

const username = process.env.VUE_APP_USER
const password = process.env.VUE_APP_PASSWORD
const url = process.env.VUE_APP_URL

export default class DashboardService {
    async getIncome(input) {
        return axios.post(url + '/get-dashboard/', input, {
            auth: {
                username,
                password
            }
        }).then(res => res.data);
    }

    async getWeeklyIncome(input){
        return axios.post(url + "/get-prev-weeks-total/", input, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }

    async getWeeklyIncomeRange(input){
        return axios.post(url + "/get-range-total/", input, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }
}
