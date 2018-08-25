import apiExecute from '../common/apiExecute';

const baseUrl = '/';

const getGroupsByOrgId = (id) => {
    return apiExecute(`${baseUrl}api/organization/OrganizationUserGroups/orgid/${id}`, 'GET', null)
}

const getGroupsByUserId = () => {
    return apiExecute(`${baseUrl}api/organization/OrganizationUserGroups/userid`, 'GET', null)
}

const postGroup = (model) => {
    return apiExecute(`${baseUrl}api/organization/OrganizationUserGroups`, 'POST', model)
}

const updateGroup = (id, model) => {
    return apiExecute(`${baseUrl}api/organization/OrganizationUserGroups/${id}`, 'PUT', model)
}

const deleteGroup = (id) => {
    return apiExecute(`${baseUrl}api/organization/OrganizationUserGroups/${id}`, 'DELETE', null)
}

const getById = (id) => {
    return apiExecute(`${baseUrl}api/organization/OrganizationUserGroups/${id}`, 'GET', null)
}

const getUserByGroup = (id) => {
    return apiExecute(`${baseUrl}api/user/users/groupid/${id}`, 'GET', null)
}

const removeUser = (id) => {
    return apiExecute(`${baseUrl}api/organization/OrganizationUserGroupUsers/${id}`, 'DELETE', null)
}

const getOrgByUserId = () => {
    return apiExecute(`${baseUrl}api/organization/Organizations/userid`, 'GET', null)
}

const OrgGroupsApi = {
    getGroupsByOrgId,
    postGroup,
    updateGroup,
    deleteGroup,
    getById,
    getUserByGroup,
    removeUser,
    getGroupsByUserId,
    getOrgByUserId
}

export default OrgGroupsApi;