import axios from 'axios';

const username = process.env.VUE_APP_USER
const password = process.env.VUE_APP_PASSWORD
const url = process.env.VUE_APP_URL

export default class TutorService {
    async getAllTutors() {
        return axios.post(url + '/get-all-tutors/', {
            type: 'All'
        }, {
            auth: {
                username,
                password
            }
        }).then(res => res.data.tutors).catch(err => { throw err });
    }

    async getUnarchivedTutors() {
        return axios.post(url + '/get-all-tutors/', {
            type: 'NonArchived'
        }, {
            auth: {
                username,
                password
            }
        }).then(res => res.data.tutors).catch(err => { throw err });
    }

    async addTutor(tutor) {
        return axios.post(url + "/add-new-tutor/", tutor, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }

    async archiveTutor(tutor){
        return axios.post(url + "/archive-tutor/", tutor, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }

    async editTutor(tutor){
        return axios.post(url + "/edit-tutor/", tutor, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }
}
