import apiExecute from '../common/apiExecute';



const getAllEducation = () => apiExecute(`/api/user/usereducations`, 'GET', null)


const getEducationByUserId = (id) => apiExecute(`/api/user/usereducations/userId/${id}`, 'GET', null)

const getEducationByCurrentUser = () => apiExecute(`/api/user/usereducations/userId/`, 'GET', null)


const postEducation = (model) => apiExecute(`/api/user/usereducations`, 'POST', model)


const updateEducation = (id, model) => apiExecute(`/api/user/usereducations/${id}`, 'PUT', model)


const getById = (id) => apiExecute(`/api/user/usereducations/${id}`, 'GET', null)


const getByQuery = (text) => apiExecute(`/api/organization/schools/${text}`, 'GET', null)


const deleteById = (id) =>  apiExecute(`/api/user/usereducations/${id}`, 'DELETE', null)


const UserEducationApi = {
    getAllEducation,
    getEducationByUserId,
    postEducation,
    updateEducation,
    getEducationByCurrentUser,
    getById,
    getByQuery,
    deleteById
}

export default UserEducationApi;