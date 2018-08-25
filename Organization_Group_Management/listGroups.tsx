import * as React from 'react';
import { Input, Button, Checkbox } from '../common/form';
import { IOrgGroupsData } from './orgGroupsPage';
import { Card } from '../common/card';

interface IListGroupsProps {
    groupsList: IOrgGroupsData[],
    onEdit: (id) => void,
    onDelete: (id) => void,
    viewUsers: (id) => void
}

export const ListGroups = (props: IListGroupsProps) => {
    const buildRow = (item, index) => {
        return (
            <div className="card-body" key={index}>

                <h5>Group Name: {item.groupName}</h5>
                <p>{item.userCount} people in this group</p>

                <button
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target="#userList"
                    onClick={() => props.viewUsers(item.id)}
                >View Users in this group</button>

                <div className='btn btn-group'>
                    <Button
                        className="btn btn-secondary"
                        label="Edit"
                        onClick={() => props.onEdit(item.id)}
                    />
                </div>
                <Button
                    className="btn btn-danger"
                    label="Delete"
                    onClick={() => props.onDelete(item.id)}
                    disabled={item.userCount === 0 ? false : true}
                />
            </div>
        )
    }

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h4>Group List</h4>
                </div>
                {props.groupsList.map(buildRow)}
            </div>
        </div>
    )
}