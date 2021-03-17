import axios from 'axios';

const username = process.env.VUE_APP_USER
const password = process.env.VUE_APP_PASSWORD
const url = process.env.VUE_APP_URL

export default class AppointmentService {
    async getAppointments() {
        // return axios.get('assets/layout/data/appointments.json').then(res => res.data.data);
        return axios.get(url + '/get-all-appointments/', {
            auth: {
                username,
                password
            }
        }).then(res => res.data);

        // return axios.post(url + '/get-appointments/', {
        //     type: 'All'
        // }, {
        //     auth: {
        //         username,
        //         password
        //     }
        // }).then(res => res.data.students).catch(err => { throw err });
    }

    async archiveAppointment(appointment){
        return axios.post(url + "/archive-appointment/", appointment, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }

    async editAppointment(appointment){
        return axios.post(url + "/edit-appointment/", appointment, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }

    async addAppointment(appointment) {
        // console.log(appointment)
        return axios.post(url + "/add-new-appointment/", appointment, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }

    async addRecurringAppointment(appointment) {
        return axios.post(url + "/add-recurring-appointments/", appointment, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }

    async togglePaid(appointment){
        return axios.post(url + "/update-paid-status/", appointment, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }

    async updateStudentToPaid(input){
        return axios.post(url + "/update-student-paid-invoice/", input, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }

    async updateFamilyToPaid(input){
        return axios.post(url + "/update-family-paid-invoice/", input, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }
}
