import * as React from 'react';
import { IUserEducationForm } from './userEducationForm';
import { Button } from '../common/form';
import { Card } from '../common/card';
import * as moment from 'moment';

interface IListEducationProps {
    educationList: IUserEducationForm[];
    onClick: (id) => void
    onDelete: (id) => void
}

export const ListEducation = (props: IListEducationProps) => {
    const buildRow = (item) => {
        return (
            <div key={item.id} className="col-md-8">
                <Card key={item.id}>
                    <h3>{item.schoolName}</h3>
                    <div className="float-right">
                        <Button
                            className="btn btn-primary"
                            onClick={() => props.onDelete(item.id)}
                            label="Delete"
                        />
                    </div>
                    <div className="float-right">
                        <button
                            className="btn btn-primary"
                            onClick={() => props.onClick(item.id)}
                            data-toggle="modal"
                            data-target="#educationForm"
                        >Edit
                            </button>
                    </div>
                    <div className="card-body">

                        <p><strong>Current Semester:</strong> {item.currentSemester}</p>
                        <p><strong>Major:</strong> {item.major} <strong>Gpa: </strong>{item.gpa}</p>
                        <p><strong>Enrollment Date:</strong> {moment(item.enrollmentDate).format('MM-DD-YYYY')}</p>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div>
            {props.educationList.map(buildRow)}
        </div>
    )
}