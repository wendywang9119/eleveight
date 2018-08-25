import apiExecute from '../common/apiExecute'

const baseUrl = "/"

const getScholarshipByOrgId = (id) => {
    return apiExecute(`${baseUrl}api/organization/scholarships/OrganizationId/${id}`, "GET", null)
}

const getOrgById = (id) => {
    return apiExecute(`${baseUrl}api/organization/Organizations/${id}`, "GET", null)
}

const getByQuery = (text) => {
    return apiExecute(`${baseUrl}api/organization/Organizations/${text}`, 'GET', null)
}

const assignScholarship = (model) => {
    return apiExecute(`${baseUrl}api/organization/Organizationscholarshiprels`, 'POST', model)
}

const getRelsByOrgId = (id) => {
    return apiExecute(`${baseUrl}api/organization/Organizationscholarshiprels/orgid/${id}`, 'GET', null)
}

const getRelsByUserId = () => {
    return apiExecute(`${baseUrl}api/organization/Organizationscholarshiprels/userid`, 'GET', null)
}

const getScholarshipByUserId = () => {
    return apiExecute(`${baseUrl}api/organization/scholarships/UserBaseId`, "GET", null)
}

const OrgAssignApi = {
    getScholarshipByOrgId,
    getByQuery,
    assignScholarship,
    getRelsByOrgId,
    getRelsByUserId,
    getScholarshipByUserId,
    getOrgById
}

export default OrgAssignApi;