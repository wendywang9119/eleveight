import * as React from 'react';
import { ITextValue } from '../common/form/ITextValue';
import * as moment from 'moment';
import { Card } from '../common/card';
import CMDashboardApi from './cMDashboardApi';
import { Input, Button, DropDownList } from '../common/form';

interface IEmploymentPage {
    employmentData: {
        id: number
        userBaseId: number
        companyName: string
        jobTitle: string
        startDate: string
        endDate: string
        isCurrentlyEmployed: Boolean
        jobDuties: string
        wasVolunteerPosition: Boolean
        createdById: number
        modifiedById: number
        employerZip: number
        streetAddress: string
        notes: string
        jobContract: string
    },
    isEdit: boolean,
    userBaseId: number
}

interface IEmploymentPageProps {
    userBaseId: number
}

class EmploymentPage extends React.Component<IEmploymentPageProps, IEmploymentPage>{
    constructor(props) {
        super(props);
        this.state = {
            employmentData: {
                id: 0,
                companyName: "",
                userBaseId: props.userBaseId,
                jobTitle: "",
                startDate: moment().format("YYYY-MM-DD"),
                endDate: moment().format("YYYY-MM-DD"),
                isCurrentlyEmployed: false,
                jobDuties: "",
                wasVolunteerPosition: false,
                createdById: props.userBaseId,
                modifiedById: props.userBaseId,
                streetAddress: "",
                employerZip: 0,
                notes: "",
                jobContract: ""
            },
            isEdit: true,
            userBaseId: props.userBaseId
        }
    }

    componentDidMount() {
        this.getEmploymentByUserId();
    }

    getEmploymentByUserId = () => {
        CMDashboardApi.getEmploymentByUserId(this.state.userBaseId)
            .then(res => {
                console.log(res);
                if (res.items.length > 0) {
                    let data = res.items[0];
                    data.jobContract = '';
                    this.setState({
                        employmentData: data
                    })
                }
            })
            .catch(err => console.log(err))
    }

    onChange = (fieldName, fieldValue) => {
        let nextState = {
            ...this.state,
            employmentData: {
                ...this.state.employmentData,
                [fieldName]: fieldValue
            }
        }
        this.setState(nextState);
    }

    onEdit = () => {
        this.setState({
            isEdit: false
        })
    }

    onUpdate = () => {
        let id = this.state.employmentData.id;
        if (id) {
            CMDashboardApi.updateEmploymentById(this.state.employmentData)
                .then(res => {
                    this.setState({
                        isEdit: true
                    })
                })
                .catch(err => console.log("Error", err))
        } else {
            CMDashboardApi.postEmployment(this.state.employmentData)
                .then(res => {
                    this.setState({
                        isEdit: true,
                        employmentData: {
                            ...this.state.employmentData,
                            id: res.item
                        }
                    })
                })
                .catch(err => console.log("Error", err))
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="flex-container">
                    <form>
                        <div className="d-flex flex-column ">
                            <div>
                                <Button
                                    className="btn btn-primary float-right"
                                    label={this.state.isEdit ? "Edit" : "Update"}
                                    onClick={this.state.isEdit ? this.onEdit : this.onUpdate}
                                />
                            </div>
                            <div>
                                <fieldset disabled={this.state.isEdit}>
                                    <Input
                                        type="text"
                                        name="jobTitle"
                                        label="Job Title"
                                        value={this.state.employmentData.jobTitle}
                                        onChange={this.onChange}
                                    />
                                    <Input
                                        type="text"
                                        name="jobDuties"
                                        label="Job Duties"
                                        value={this.state.employmentData.jobDuties}
                                        onChange={this.onChange}
                                    />
                                    <Input
                                        type="text"
                                        name="companyName"
                                        label="Employer Name"
                                        value={this.state.employmentData.companyName}
                                        onChange={this.onChange}
                                    />
                                    <div className="row">
                                        <div className="col">
                                            <Input
                                                type="text"
                                                name="streetAddress"
                                                label="Street Address"
                                                value={this.state.employmentData.streetAddress}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="col">
                                            <Input
                                                type="text"
                                                name="employerZip"
                                                label="Employer Zip"
                                                className="float-right"
                                                value={this.state.employmentData.employerZip}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <Input
                                                type="text"
                                                name="jobContract"
                                                label="FT/PT/Intern"
                                                value={this.state.employmentData.jobContract}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="col">

                                            <a className="float-right" href="#">Pay Stub</a>
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <Input
                                                type="date"
                                                name="startDate"
                                                label="Start Date"
                                                value={moment(this.state.employmentData.startDate).format("YYYY-MM-DD")}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="col">
                                            <Input
                                                type="date"
                                                name="endDate"
                                                label="End Date"
                                                className="float-right"
                                                value={moment(this.state.employmentData.endDate).format("YYYY-MM-DD")}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                    </div>
                                    <Input
                                        type="text"
                                        name="notes"
                                        label="Notes"
                                        value={this.state.employmentData.notes}
                                        onChange={this.onChange}
                                    />
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

export default EmploymentPage;