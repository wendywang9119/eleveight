import apiExecute from '../common/apiExecute'
import { basename } from 'path';
import { debug } from 'util';

const baseUrl = "/"

const getOrgName = () => {
    return apiExecute(`${baseUrl}api/organization/Organizations/userid`, "GET", null)
}

const getScholarshipsBySchool = (orgId, schoolId) => {
    return apiExecute(`${baseUrl}api/organization/Organizationscholarshiprels/${orgId}/${schoolId}`, "GET", null)
}

const getSchoolsByUserId = () => {
    return apiExecute(`${baseUrl}api/organization/Organizationscholarshiprels/userId`, "GET", null)
}


const getOrgById = (id) => {
    return apiExecute(`${baseUrl}api/organization/Organizations/${id}`, "GET", null)
}

const updateOrgByOrgId = (model) => {
    
    return apiExecute(`${baseUrl}api/organization/Organizations/${model.id}`, "PUT", model)
}



const FundingOrgApi = {
    getOrgName,
    getScholarshipsBySchool,
    getSchoolsByUserId,
    getOrgById,
    updateOrgByOrgId
}

export default FundingOrgApi;