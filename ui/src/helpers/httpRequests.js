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
function updateMetadata(id, data){
    var _url = _env.api + 'compendium/' + id + '/metadata';
    var body = {o2r: data};
    return axios.put(_url, body);
}

function uploadViaSciebo(url, folder) {
    return axios.post(_env.api + 'compendium', {content_type:'workspace', share_url: url, path:folder});
}

function uploadWorkspace(workspace, config) {
    console.log(workspace)
    return axios.post(_env.api + 'compendium', workspace, config);
}

function singleCompendium(id) {
    var _url = _env.api + 'compendium/' + id;
    return axios.get(_url);
}

function getFile(path) {
    return axios.get(_env.api + path);
}

function newJob(body) {
    var _url = _env.api + 'job/';
    return axios.post(_url, body);
}

function listJobs(compendium_id) {
    return axios.get(_env.api + "job?compendium_id=" + compendium_id);
}

function getSingleJob(id) {
    return axios.get(_env.api + "job/" + id );
}

function getLogs(id) {
    return axios.get( _env.api + 'job/' + id + '?steps=all' );
}

function sendBinding(binding){
    return axios.post(_env.api + 'bindings/binding', binding);
}

function runManipulationService(binding){
    return axios.post(_env.api + 'compendium/'+binding.id+'/binding/' + binding.computationalResult.result.replace(/\s/g, '').toLowerCase(), binding);
}

function getCodelines(binding){
    return axios.post(_env.api + 'bindings/extractR', binding);
}

function searchBinding(term, metadata){
    return axios.post(_env.api + 'bindings/searchBinding', {term:term, metadata: metadata});
}

function geocodingRequest(query){
    var encodedQuery= escape(query)
    var access_token='Mapbox Key'
    const link ="https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodedQuery + ".json?access_token=" + access_token
    return axios.get(link)
}

function downloadERC(id, image){
    return _env.api + 'compendium/' + id + '.zip?image=' + image
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
    listJobs: listJobs,
    getSingleJob: getSingleJob,
    getLogs: getLogs,
    sendBinding: sendBinding,
    runManipulationService: runManipulationService,
    getCodelines: getCodelines,
    searchBinding: searchBinding,
    geocodingRequest: geocodingRequest,
    downloadERC: downloadERC,
};