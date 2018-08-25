import * as React from 'react';
import { Card } from '../common/card';
import { Button } from '../common/form';

export interface IUser {
    groupUserId: number
    userBaseId: number
    firstName: string
    lastName: string
    email: string
}

interface IUserprops {
    userList: IUser[],
    removeUser: (id) => void,
    groupName: string
}

export const ListGroupUsers = (props: IUserprops) => {
    const buildRow = (user, index) => {
        return (
            <tr key={index}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td> <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => props.removeUser(user.groupUserId)}
                >Remove
               </button></td>
            </tr>
        )
    }

    return (
        <div className="card">
            <div className="modal-header">
                <h4>{props.groupName}</h4>
                <button
                    type="button"
                    data-dismiss="modal"
                    aria-label="Close"
                    className="close"
                >
                    x
                    </button>
            </div>
            <div className="card-body">
                <table className="table table-striped table-bordered dataTable no-footer" role="grid">
                    <tbody>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Remove a user</th>
                        </tr>
                        {props.userList.map(buildRow)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}