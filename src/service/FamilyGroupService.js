import axios from 'axios';

const username = process.env.VUE_APP_USER
const password = process.env.VUE_APP_PASSWORD
const url = process.env.VUE_APP_URL

export default class FamilyGroupService {
    async getFamilyGroups() {
        // return axios.get('assets/layout/data/familyGroups.json').then(res => res.data.data);
        return axios.get(url + '/get-all-family-groups/', {
            auth: {
                username,
                password
            }
        }).then(res => res.data.family_groups).catch(err => { throw err });
    }

    async addFamilyGroup(group) {
        return axios.post(url + "/add-family-group/", group, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }

    async archiveFamilyGroup(group){
        return axios.post(url + "/archive-family-group/", group, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }

    async addStudentToGroup(input){
        return axios.post(url + "/add-student-to-group/", input, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }

    async removeStudentFromGroup(input){
        return axios.post(url + "/remove-student-from-group/", input, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }

    async editFamilyGroup(input){
        return axios.post(url + "/edit-family-group/", input, {
            auth: {
                username,
                password
            }
        }).then(res => res.data).catch(err => { throw err });
    }
}
