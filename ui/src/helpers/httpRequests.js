'use strict';

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

module.exports = {
    getUser: getUser,
    listAllCompendia: listAllCompendia,
    uploadViaSciebo: uploadViaSciebo,
    uploadWorkspace: uploadWorkspace,
};