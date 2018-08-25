import * as React from 'react';
import UserManagementApi from './userApi';
import { ListAllUsers, IUser } from './listUsers'
import { Pagination } from '../common/layout/pagination';

interface IUserManagementPage {
    users: IUser[]
    searchText: string
    maxPage: number
    currentPage: number
}

class UserManagementPage extends React.Component<{}, IUserManagementPage>{
    constructor(props) {
        super(props);
        this.state = {
            users: [
                {
                    userBaseId: 0,
                    firstName: '',
                    lastName: '',
                    email: '',
                    isEmailConfirmed: false,
                    roleName: '',
                    isAccountLocked: false,
                    orgName: "",
                    paymentFail: false
                }
            ],
            searchText: '',
            maxPage: 0,
            currentPage: 1
        }
    }

    public componentDidMount() {
        this.getUsers();
    }

    onChange = (fieldName, fieldValue) => {
        let nextState = {
            ...this.state,
            [fieldName]: fieldValue
        }

        this.setState(nextState);
    }

    onClick = (userId, isLocked) => {
        if (isLocked) {
            this.unlockAccount(userId);
        } else {
            this.lockAccount(userId);
        }
    }

    onNavClick = (pgNum) => {
        this.setState({
            ...this.state,
            currentPage: pgNum
        }, () => this.getUsers())
    }

    onPreviousClick = () => {
        this.setState({
            ...this.state,
            currentPage: this.state.currentPage - 1
        }, () => this.getUsers())
    }

    onForwardClick = () => {
        this.setState({
            ...this.state,
            currentPage: this.state.currentPage + 1
        }, () => this.getUsers())
    }

    getUsers = () => {
        UserManagementApi.getAllUsers(this.state.currentPage)
            .then(res => {
                let newUsers = res.items;
                this.setState({
                    ...this.state,
                    users: newUsers,
                    maxPage: newUsers[0].pageCount
                });
            })
            .catch(err => console.log(err))
    }

    lockAccount = (id) => {
        UserManagementApi.lockAccount(id)
            .then(res => {
                this.getUsers();
            })
            .catch(err => console.log(err))
    }

    unlockAccount = (id) => {
        UserManagementApi.unlockAccount(id)
            .then(res => {
                this.getUsers();
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div className="card">
                <div className="card-header mb-4">
                    <h2 className="mb-1">User Management Page</h2>
                </div>
                <div className="card-body">
                    <div className="container-fluid flex-grow-1">
                        <ListAllUsers
                            users={this.state.users}
                            searchText={this.state.searchText}
                            onClick={this.onClick}
                            onChange={this.onChange}
                        />
                        <Pagination
                            currentPage={this.state.currentPage}
                            onNavClick={this.onNavClick}
                            onPreviousClick={this.onPreviousClick}
                            onForwardClick={this.onForwardClick}
                            totalPages={this.state.maxPage}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default UserManagementPage;