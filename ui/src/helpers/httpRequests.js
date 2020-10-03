const axios = require('axios');
const { func } = require('prop-types');
const config = require('./config');
const _env = {
    api: config.baseUrl
}

function getUser() {
    return axios.get(_env.api + 'auth/whoami');
}

function getOneUser(id) {
    return axios.get(_env.api + 'user/' + id);
}

function createPublicLink(id){
    return axios.put(_env.api + 'compendium/' + id + '/link')
}

function deletePublicLink(id){
    return axios.delete(_env.api + 'compendium/' + id + '/link')
}

function getPublicLinks(){
    return axios.get(_env.api + 'link')
}

function listAllCompendia() {
    return axios.get(_env.api + 'compendium');
}

function listUserCompendia(user) {
    return axios.get(_env.api + 'compendium?user=' + user);
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

function getCode(id, file){
    return axios.post(_env.api + 'bindings/extractRcode', {id: id, file:file});
}

function searchBinding(term, metadata){
    return axios.post(_env.api + 'bindings/searchBinding', {term:term, metadata: metadata});
}

function geocodingRequest(query){
    var encodedQuery= escape(query)
    var access_token='token'
    const link ="https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodedQuery + ".json?access_token=" + access_token
    return axios.get(link)
}

function downloadERC(id, image){
    return _env.api + 'compendium/' + id + '.zip?image=' + image
}

function createSubstitution(baseId, overlayId, substitutionFiles){
    const body={"base": baseId, "overlay": overlayId, "substitutionFiles": substitutionFiles, "metadataHandling": "keepBase"}
    return axios.post(_env.api + 'substitution', body);
}

function complexSearch(query){
    var _url = _env.api + 'search';
    return axios.post(_url, query);
}

module.exports = {
    getUser: getUser,
    listAllCompendia: listAllCompendia,
    listUserCompendia: listUserCompendia,
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
    getCode: getCode,
    searchBinding: searchBinding,
    geocodingRequest: geocodingRequest,
    downloadERC: downloadERC,
    createSubstitution: createSubstitution,
    complexSearch: complexSearch,
    getOneUser: getOneUser,
    createPublicLink: createPublicLink,
    deletePublicLink: deletePublicLink,
    getPublicLinks: getPublicLinks,
};