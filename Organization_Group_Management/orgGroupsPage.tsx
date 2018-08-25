import * as React from 'react';
import { Input, Button, Checkbox } from '../common/form';
import OrgGroupsApi from './orgGroupsApi';
import { ListGroups } from './listGroups';
import { Card } from '../common/card';
import { IUser, ListGroupUsers } from './listGroupUsers';

interface IOrgGroupsPage {
    orgGroupObj: IOrgGroupsData,
    groupsList: IOrgGroupsData[],
    userList: IUser[],
    orgName: string,
    buttonText: string,
    groupName: string,
    groupId: number,
    orgId: number
}

export interface IOrgGroupsData {
    id: number,
    organizationId: number,
    groupName: string,
    isActive: boolean,
    userCount: number
}

export default class OrgGroupsPage extends React.Component<any, IOrgGroupsPage>{
    constructor(props) {
        super(props);
        this.state = {
            orgGroupObj: {
                id: 0,
                organizationId: 0,
                groupName: '',
                isActive: false,
                userCount: 0
            },
            groupsList: [],
            userList: [],
            orgName: '',
            buttonText: 'Add a new group',
            groupName: '',
            groupId: 0,
            orgId: props.match.params.id
        }
    }

    componentDidMount() {
        let orgId = this.state.orgId;
        if (orgId) {
            this.getGroupsByOrdId();
        } else {
            this.getOrgByUserId();
            this.getGroupsByUserId();
        }
    }

    getOrgByUserId = () => {
        OrgGroupsApi.getOrgByUserId()
            .then(res => {
                this.setState({
                    orgGroupObj: {
                        ...this.state.orgGroupObj,
                        organizationId: res.item.id
                    },
                    orgName: res.item.orgName,
                    orgId: res.item.id
                })
                this.getGroupsByOrdId();
            })
            .catch(err => console.log(err))
    }

    getGroupsByUserId = () => {
        OrgGroupsApi.getGroupsByUserId()
            .then(res => {
                this.setState({
                    ...this.state,
                    groupsList: res.items,
                    orgGroupObj: {
                        ...this.state.orgGroupObj,
                        organizationId: (res.items)[0].organizationId,
                    },
                    orgName: (res.items)[0].orgName
                })
            })
            .catch(err => console.log(err))
    }

    getGroupsByOrdId = () => {
        OrgGroupsApi.getGroupsByOrgId(this.state.orgId)
            .then(res => {
                this.setState({
                    ...this.state,
                    groupsList: res.items,
                    orgGroupObj: {
                        ...this.state.orgGroupObj,
                        organizationId: (res.items)[0].organizationId,
                    },
                    orgName: (res.items)[0].orgName
                })
            })
            .catch(err => console.log(err))
    }

    postGroup = (data) => {
        OrgGroupsApi.postGroup(data)
            .then(res => {
                this.getGroupsByOrdId();
                this.setState({
                    orgGroupObj: {
                        id: 0,
                        organizationId: 0,
                        groupName: '',
                        isActive: false,
                        userCount: 0
                    }
                })
            })
            .catch(err => console.log(err))
    }

    getGroupById = (id) => {
        OrgGroupsApi.getById(id)
            .then(res => {
                this.setState({
                    orgGroupObj: res.item
                })
            })
            .catch(err => console.log(err))
    }

    updateGroup = (id, model) => {
        OrgGroupsApi.updateGroup(id, model)
            .then(res => {
                this.getGroupsByOrdId();
                this.setState({
                    ...this.state,
                    buttonText: "Add a new group",
                    orgGroupObj: {
                        id: 0,
                        organizationId: 0,
                        groupName: '',
                        isActive: false,
                        userCount: 0
                    }
                })
            })
            .catch(err => console.log(err))
    }

    deleteGroup = (id) => {
        OrgGroupsApi.deleteGroup(id)
            .then(res => {
                this.getGroupsByOrdId();
            })
            .catch(err => console.log(err))
    }

    getUsersByGroup = (id) => {
        OrgGroupsApi.getUserByGroup(id)
            .then(res => {
                this.setState({
                    userList: res.items
                })
            })
            .catch(err => console.log(err))
    }

    removeUserinGroup = (id) => {
        OrgGroupsApi.removeUser(id)
            .then(res => {
                this.getUsersByGroup(this.state.groupId)
            })
            .catch(res => console.log(res))
    }

    onChange = (fieldName, fieldValue) => {
        let nextState = {
            ...this.state,
            orgGroupObj: {
                ...this.state.orgGroupObj,
                [fieldName]: fieldValue
            }
        }

        this.setState(nextState, () => console.log(nextState))
    }

    onCheck = (fieldName, fieldValue) => {
        let nextState = {
            ...this.state,
            orgGroupObj: {
                ...this.state.orgGroupObj,
                [fieldName]: fieldValue
            }
        }
        this.setState(nextState, () => console.log(nextState))
    }

    onPost = () => {

        let groupId = this.state.orgGroupObj.id;
        if (groupId) {
            this.updateGroup(groupId, this.state.orgGroupObj);
        } else {
            this.postGroup(this.state.orgGroupObj);
        }
    }

    onEdit = (id) => {
        this.getGroupById(id);
        this.setState({
            ...this.state,
            buttonText: "Update"
        })
    }

    onDelete = (id) => {
        this.deleteGroup(id);
    }

    viewUsers = (id) => {
        this.getUsersByGroup(id);
        OrgGroupsApi.getById(id)
            .then(res => {
                this.setState({
                    ...this.state,
                    groupName: res.item.groupName,
                    groupId: res.item.id
                })
            })
            .catch(err => console.log(err))
    }

    removeUser = (id) => {
        this.removeUserinGroup(id);
    }

    onRegister = () => {
        this.props.history.push(`/funding/members/registration/${this.state.orgId}`)
    }


    render() {
        return (
            <React.Fragment>
                <div className="col-md-12">
                    <h2 className="mb-1">{this.state.orgName} - Organization Groups Management Page</h2>
                    <div className="row">
                        <div className="col">
                            <div className="card">
                                <div className="card-header">
                                    <h4>Create a group</h4>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <Input
                                            type="text"
                                            name="groupName"
                                            label="Group Name"
                                            value={this.state.orgGroupObj.groupName}
                                            onChange={this.onChange}
                                        />
                                        <Checkbox
                                            name="isActive"
                                            label="Is Active?"
                                            checked={this.state.orgGroupObj.isActive}
                                            onCheck={this.onCheck}
                                        />
                                        <Button
                                            label={this.state.buttonText}
                                            className="btn btn-primary"
                                            onClick={this.onPost}
                                            disabled={this.state.orgGroupObj.groupName.length < 5 ? true : false}
                                        />
                                    </form>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header">
                                    <h4>Register a user in this organization</h4>
                                </div>
                                <div className="card-body">
                                    <Button
                                        label="Register a new user"
                                        className="btn btn-secondary"
                                        onClick={this.onRegister}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <ListGroups
                                groupsList={this.state.groupsList}
                                onEdit={this.onEdit}
                                onDelete={this.onDelete}
                                viewUsers={this.viewUsers}
                            />
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="userList" style={{ display: "none", ariaHidden: "true" }}>
                    <div className="modal-dialog modal-lg card-body">
                        <div className="modal-body">
                            <div className="modal-content">
                                <ListGroupUsers
                                    userList={this.state.userList}
                                    removeUser={this.removeUser}
                                    groupName={this.state.groupName}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}