import apiExecute from '../common/apiExecute';

const baseUrl = '/';

const getAllUsers = (pgNum: number = 1) => {
    return apiExecute(`${baseUrl}api/user/users/${pgNum}`, 'GET', null);
}

const lockAccount = (id) => {
    return apiExecute(`${baseUrl}api/user/userbases/lockAccount/${id}`, 'PUT', null)
}

const unlockAccount = (id) => {
    return apiExecute(`${baseUrl}api/user/userbases/unlockAccount/${id}`, 'PUT', null)
}

const UserManagementApi = {
    getAllUsers,
    lockAccount,
    unlockAccount
}

export default UserManagementApi;