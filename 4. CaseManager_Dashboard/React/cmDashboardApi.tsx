﻿import apiExecute from '../common/apiExecute';

const baseUrl = '/';

const getAllCitiizenship = () => {
    return apiExecute(`${baseUrl}api/common/citizenshipTypes`, 'GET', null)
}

const getAllRace = () => {
    return apiExecute(`${baseUrl}api/common/ethnicityTypes`, 'GET', null)
}

const getEducationByUserId = (id) => {
    return apiExecute(`${baseUrl}api/user/usereducations/userId/${id}`, 'GET', null)
}

const getEmploymentByUserId = (id) => {
    return apiExecute(`${baseUrl}api/user/userWorkExperiences/baseId/${id}`, 'GET', null)
}

const getMilitaryByUserId = (id) => {
    return apiExecute(`${baseUrl}api/user/militarys/userbaseid/${id}`, 'GET', null)
}

const updateEducationById = (model) => {
    return apiExecute(`${baseUrl}api/user/usereducations/${model.id}`, 'PUT', model)
}

const postEducation = (model) => {
    return apiExecute(`${baseUrl}api/user/usereducations/`, 'POST', model)
}

const updateEmploymentById = (model) => {
    return apiExecute(`${baseUrl}api/user/userWorkExperiences/put/${model.id}`, 'PUT', model)
}

const postEmployment = (model) => {
    return apiExecute(`${baseUrl}api/user/userWorkExperiences/post/`, 'POST', model)
}

const updateMilitaryById = (model) => {
    return apiExecute(`${baseUrl}api/user/militarys/${model.id}`, 'PUT', model)
}

const postMilitary = (model) => {
    return apiExecute(`${baseUrl}api/user/militarys/`, 'POST', model)
}

const updateProfile = (profileId, demoId, model) => {
    return apiExecute(`${baseUrl}api/clients/cmdashboardprofiles/${profileId}/${demoId}`, 'PUT', model)
}

const getProfileByUserId = (userId) => {
    return apiExecute(`${baseUrl}api/clients/cmdashboardprofiles/${userId}`, 'GET', null)
}

const getCertificationByUserId = (userId) => {
    return apiExecute(`${baseUrl}api/user/usercertifications/userid/${userId}`, 'GET', null)
}

const postCertification = (model) => {
    return apiExecute(`${baseUrl}api/user/usercertifications/`, 'POST', model)
}

const updateCertification = (id, model) => {
    return apiExecute(`${baseUrl}api/user/usercertifications/${id}`, 'PUT', model)
}

const getContactByUserId = (id) => {
    return apiExecute(`${baseUrl}api/clients/cmdashboardcontacts/${id}`, 'GET', null)
}

const updateContact = (model) => {
    return apiExecute(`${baseUrl}api/clients/cmdashboardcontacts/`, 'PUT', model)
}

const getAllState = () => {
    return apiExecute(`${baseUrl}api/common/USStates/`, 'GET', null)
}

const getAllMaritalStatus = () => {
    return apiExecute(`${baseUrl}api/common/maritalstatustypes`, 'GET', null)
}

const getAllLanguage = () => {
    return apiExecute(`${baseUrl}api/common/languageTypes`, 'GET', null)
}

const getAddressByUserId = (id) => {
    return apiExecute(`${baseUrl}api/clients/cmdashboardaddresses/${id}`, 'GET', null)
}

const updateAddress = (addressId, demoId, model) => {
    return apiExecute(`${baseUrl}api/clients/cmdashboardaddresses/${addressId}/${demoId}`, 'PUT', model)
}

const getByQuery = (text) => {
    return apiExecute(`${baseUrl}api/organization/schools/${text}`, 'GET', null)
}

const getAddressByUserBaseId = () => apiExecute(`/api/clients/cmdashboardaddresses/userbaseId`, 'GET', null)

const getFinancialAidByUserId = (id) => {
    return apiExecute(`${baseUrl}api/user/UserFinancialAid/${id}`, 'GET', null)
}

const updateFinancialAidById = (model) => {
    return apiExecute(`${baseUrl}api/user/UserFinancialAid/${model.id}`, 'PUT', model)
}

const getAllAwardTypes = () => {
    return apiExecute(`${baseUrl}api/user/AwardType`, 'GET', null)
}
const getAllFrequencyTypes = () => {
    return apiExecute(`${baseUrl}api/user/FrequencyType`, 'GET', null)
}
const getAllLivingSituationTypes = () => {
    return apiExecute(`${baseUrl}api/user/LivingSituationType`, 'GET', null)
}
const postUserFinancialAid = (model) => {
    return apiExecute(`${baseUrl}api/user/UserFinancialAid`, 'POST', model)
}

const getUserAwardById = (id) => {
    return apiExecute(`${baseUrl}api/user/userAward/${id}`, `GET`, null);
}

const postUserAward = (model) => {
    return apiExecute(`${baseUrl}api/user/userAward`, `POST`, model);
}

const updateUserAward = (model) => {
    return apiExecute(`${baseUrl}api/user/userAward/${model.id}`, `PUT`, model);
}

const getAllHonorType = () => {
    return apiExecute(`${baseUrl}api/user/HonorType`, `GET`, null);
}

const postHonorType = (model) => {
    return apiExecute(`${baseUrl}api/user/HonorType/${model.id}`, `POST`, model);
}

const updateHonorType = (model) => {
    return apiExecute(`${baseUrl}api/user/HonorType`, `PUT`, model);
}

const CMDashboardApi = {
	getAllCitiizenship,
	getAllRace,
	getEducationByUserId,
	getEmploymentByUserId,
	getMilitaryByUserId,
	updateEducationById,
	updateEmploymentById,
	updateMilitaryById,
	updateProfile,
	getProfileByUserId,
	getCertificationByUserId,
	updateCertification,
	getContactByUserId,
	updateContact,
	getAllState,
	getAllMaritalStatus,
	getAllLanguage,
	getAddressByUserId,
	updateAddress,
	getByQuery,
	postEducation,
	postCertification,
	postMilitary,
    postEmployment,
    getUserAwardById,
    postUserAward,
    updateUserAward,
    getAllHonorType,
    postHonorType,
    updateHonorType,
    getFinancialAidByUserId,
    updateFinancialAidById,
    postUserFinancialAid,
    getAllAwardTypes,
    getAllFrequencyTypes,
    getAllLivingSituationTypes,
    getAddressByUserBaseId
}

export default CMDashboardApi;