import axios from 'axios';

const username = process.env.VUE_APP_USER
const password = process.env.VUE_APP_PASSWORD
const url = process.env.VUE_APP_URL

export default class StudentService {
    async getStudents() {
        // return axios.get('assets/layout/data/students.json').then(res => res.data.data);

        return axios.post(url + '/get-all-students/', {
            type: 'All'
        }, {
            auth: {
                username,
                password
            }
        }).then(res => res.data.students).catch(err => { throw err });
    }

    async addStudent(student) {
        console.log(student)
        return axios.post(url + "/add-new-student/", student, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }

    async archiveStudent(student){
        return axios.post(url + "/archive-student/", student, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }

    async editStudent(student){
        return axios.post(url + "/edit-student/", student, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }
}
