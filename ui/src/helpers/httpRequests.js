'use strict';

const axios = require('axios');

function getUser() {
    return axios.get('http://localhost/api/v1/auth/whoami');
}

module.exports = {
    getUser: getUser
};