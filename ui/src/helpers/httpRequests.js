const axios = require('axios');
const _env = {
    api: "http://localhost/api/v1/"
}

function getUser() {
    return axios.get(_env.api + 'auth/whoami');
}

function listAllCompendia() {
    return axios.get(_env.api + 'compendium');
}

function uploadViaSciebo(url, folder) {
    return axios.post(_env.api + 'compendium', {content_type:'workspace', share_url: url, path:folder});
}

function uploadWorkspace(workspace) {
    console.log(workspace)
    return axios.post(_env.api + 'compendium', workspace);
}

function singleCompendium(id) {
    var _url = _env.api + 'compendium/' + id;
    return axios.get(_url);
}

function getFile(path) {
    return axios.get(path);
}

function newJob(body) {
    var _url = _env.api + 'job/';
    return axios.post(_url, body)
}

function updateMetadata(id, data){
    var _url = _env.api + 'compendium/' + id + '/metadata';
    var body = {o2r: data};
    return axios.put(_url, body);
}


module.exports = {
    getUser: getUser,
    listAllCompendia: listAllCompendia,
    uploadViaSciebo: uploadViaSciebo,
    uploadWorkspace: uploadWorkspace,
    singleCompendium: singleCompendium,
    getFile: getFile,
    newJob: newJob,
    updateMetadata: updateMetadata,
};