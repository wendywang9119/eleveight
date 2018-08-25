import * as React from 'react';
import { ITextValue } from '../common/form/ITextValue';
import * as moment from 'moment';
import { Card } from '../common/card';
import CMDashboardApi from './cMDashboardApi';
import { Input, Button, DropDownList } from '../common/form';

interface IMilitaryPage {
    militaryData: {
        id: number
        branchType: string
        status: Boolean
        enlistedDate: string
        dischargedDate: string
        positionName: string
        dd214Form: Boolean
        dd214Url: string
        veteranIdNum: number
        veteranIdUrl: string
        otherFormType: string
        otherFormTypeUrl: string
        createdById: number
        modifiedById: number
        userBaseId: number
    },
    branchTypeOptions: ITextValue[],
    userBaseId: number
    isEdit: boolean
}

interface IMilitaryPageProps {
    userBaseId: number
}

class MilitaryPage extends React.Component<IMilitaryPageProps, IMilitaryPage>{
    constructor(props) {
        super(props);
        this.state = {
            militaryData: {
                id: 0,
                branchType: "",
                status: false,
                enlistedDate: moment().format("YYYY-MM-DD"),
                dischargedDate: moment().format("YYYY-MM-DD"),
                positionName: "",
                dd214Form: false,
                dd214Url: "",
                veteranIdNum: 0,
                veteranIdUrl: "",
                otherFormType: "",
                otherFormTypeUrl: "",
                createdById: props.userBaseId,
                modifiedById: props.userBaseId,
                userBaseId: props.userBaseId,
            },
            branchTypeOptions: [
                { value: 1, text: 'USMC' },
                { value: 2, text: 'Army' },
                { value: 3, text: 'Navy' },
                { value: 4, text: 'AirForce' },
                { value: 5, text: 'National Guard' }
            ],
            isEdit: true,
            userBaseId: props.userBaseId,
        }
    }

    componentDidMount() {
        this.getMilitaryByUserId();
    }

    getMilitaryByUserId = () => {
        CMDashboardApi.getMilitaryByUserId(this.state.userBaseId)
            .then(res => {
                if (res.items.length > 0) {
                    this.setState({
                        militaryData: res.items[0]
                    })
                }
            })
            .catch(err => console.log(err))
    }

    onChange = (fieldName, fieldValue) => {
        let nextState = {
            ...this.state,
            militaryData: {
                ...this.state.militaryData,
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
        let id = this.state.militaryData.id;
        if (id) {
            CMDashboardApi.updateMilitaryById(this.state.militaryData)
                .then(res => {
                    this.setState({
                        isEdit: true
                    })
                })
                .catch(err => console.log("Error", err))
        } else {
            CMDashboardApi.postMilitary(this.state.militaryData)
                .then(res => {
                    this.setState({
                        isEdit: true,
                        militaryData: {
                            ...this.state.militaryData,
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
                <form>
                    <div className="d-flex flex-column">
                        <div>
                            <Button
                                className="btn btn-primary float-right"
                                label={this.state.isEdit ? "Edit" : "Update"}
                                onClick={this.state.isEdit ? this.onEdit : this.onUpdate}
                            />
                        </div>

                        <div>
                            <fieldset disabled={this.state.isEdit}>
                                <DropDownList
                                    label="Branch"
                                    name="branchType"
                                    options={this.state.branchTypeOptions}
                                    selectedValue={this.state.militaryData.branchType}
                                    onChange={this.onChange}
                                />
                                <Input
                                    type="text"
                                    name="status"
                                    label="Status"
                                    value={this.state.militaryData.status ? "Active" : "Discharged"}
                                    onChange={this.onChange}
                                />
                                <div className="row">
                                    <div className="col">
                                        <Input
                                            type="date"
                                            name="enlistedDate"
                                            label="Enlist Date"
                                            value={moment(this.state.militaryData.enlistedDate).format("YYYY-MM-DD")}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col">
                                        <Input
                                            type="date"
                                            name="dischargedDate"
                                            label="Discharge Date"
                                            className="float-right"
                                            value={moment(this.state.militaryData.dischargedDate).format("YYYY-MM-DD")}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                </div>
                                <Input
                                    type="text"
                                    name="positionName"
                                    label="Position"
                                    value={this.state.militaryData.positionName}
                                    onChange={this.onChange}
                                />
                                <div className="row">
                                    <div className="col">
                                        <Input
                                            type="text"
                                            name="dd214Form"
                                            label="DD214"
                                            value={this.state.militaryData.dd214Form}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col">
                                        <a className="float-right" href="#">dd214 Img</a>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <Input
                                            type="text"
                                            name="veteranIdNum"
                                            label="Veteran ID Card"
                                            value={this.state.militaryData.veteranIdNum}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col">
                                        <a className="float-right" href="#">Govt ID</a>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <Input
                                            type="text"
                                            name="otherFormType"
                                            label="Other Form"
                                            value={this.state.militaryData.otherFormType}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col">
                                        <a className="float-right" href="#">Govt ID</a>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </form>
            </React.Fragment>
        )
    }
}

export default MilitaryPage;