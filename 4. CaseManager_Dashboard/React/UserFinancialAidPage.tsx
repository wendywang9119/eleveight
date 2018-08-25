import * as React from 'react';
import { ITextValue } from '../common/form/ITextValue';
import * as moment from 'moment';
import { Card } from '../common/card';
import CMDashboardApi from './CMDashboardApi';
import { Input, Button, DropDownList } from '../common/form';
import { FileUploadWithCrop } from '../common/form/fileUploadWithCrop'



interface IUserFinancialAid {
    UserFinancialAidData: {
        id: number
        awardTypeId: number
        awardedBy: string
        program: string
        awardLetterUrl: string
        amountAwarded: number
        frequencyTypeId: number
        startDate: string
        endDate: string
        isFirstGen: boolean
        livingSituationTypeId: number
        createdByUserBaseId: number
        modifiedByUserBaseId: number

    },
    userBaseId: number
    isFirstGen: ITextValue[],
    awardTypes: ITextValue[],
    frequencyTypes: ITextValue[],
    livingSituationTypes: ITextValue[]
    isEdit: boolean,


}

interface IUserFinancialAidProps {
    userBaseId: number

}

class UserFinancialAidPage extends React.Component<IUserFinancialAidProps, IUserFinancialAid>{
    constructor(props) {
        super(props);
        this.state = {
            UserFinancialAidData: {
                id: 0,
                awardTypeId: 0,
                awardedBy: "",
                program: "",
                awardLetterUrl: "",
                amountAwarded: 0,
                frequencyTypeId: 0,
                startDate: moment().format("YYYY-MM-DD"),
                endDate: moment().format("YYYY-MM-DD"),
                isFirstGen: false,
                livingSituationTypeId: 0,
                createdByUserBaseId: 0,
                modifiedByUserBaseId: 0

            },
            isFirstGen: [
                { value: 1, text: 'Yes' },
                { value: 2, text: 'No' },
            ],
            userBaseId: props.userBaseId,
            isEdit: true,
            awardTypes: [],
            frequencyTypes: [],
            livingSituationTypes: []
        }
    }

    componentDidMount() {

        this.getFinancialAidByUserId();

        CMDashboardApi.getAllAwardTypes()
            .then(res => {
                let opts = res.items.map(item => {
                    return { value: item.id, text: item.typeName }
                })
                this.setState({
                    awardTypes: opts
                })
            })
            .catch(err => console.log(err))

        CMDashboardApi.getAllFrequencyTypes()
            .then(res => {
                let opts = res.items.map(item => {
                    return { value: item.id, text: item.typeName }
                })
                this.setState({
                    frequencyTypes: opts
                })
            })
            .catch(err => console.log(err))

        CMDashboardApi.getAllLivingSituationTypes()
            .then(res => {
                let opts = res.items.map(item => {
                    return { value: item.id, text: item.typeName }
                })
                this.setState({
                    livingSituationTypes: opts
                })
            })
            .catch(err => console.log(err))

    }


    getFinancialAidByUserId = () => {
        CMDashboardApi.getFinancialAidByUserId(this.state.userBaseId)
            .then(res => {
                if (res.item.awardedBy == null && res.item.program == null) {
                    let data = res.item;
                    data.awardedBy = '';
                    data.program = '';
                    this.setState({
                        UserFinancialAidData: res.item
                    })
                } else {
                    this.setState({
                        UserFinancialAidData: res.item
                    })
                }
            })
            .catch(err => console.log(err))
    }


    onChange = (fieldName, fieldValue) => {
        let nextState = {
            ...this.state,
            UserFinancialAidData: {
                ...this.state.UserFinancialAidData,
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

    onUploadComplete = (url) => {
        let nextState = {
            UserFinancialAidData: {
                ...this.state.UserFinancialAidData,
                awardLetterUrl: url
            }
        }
        this.setState(nextState, () => { (this.state.UserFinancialAidData, "awardLetterUrl") })
        this.clear();
    }

    clear = () => {
        if (document.getElementById("croppedImage")) document.getElementById("croppedImage").remove();
        if (document.getElementById("uploadComplete")) document.getElementById("uploadComplete").innerHTML = "";
    }

    onUpdate = () => {
        let id = this.state.UserFinancialAidData.id;
        if (id) {
            CMDashboardApi.updateFinancialAidById(this.state.UserFinancialAidData)
                .then(res => {
                    this.clear();
                    this.setState({
                        isEdit: true
                    })

                })
                .catch(err => console.log("Error", err))
        } else {
            CMDashboardApi.postUserFinancialAid(this.state.UserFinancialAidData)
                .then(res => {
                    this.clear();
                    this.setState({
                        isEdit: true,
                        UserFinancialAidData: {
                            ...this.state.UserFinancialAidData,
                            id: res.item.id
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
                                    label="Award Type"
                                    name="awardTypeId"
                                    options={this.state.awardTypes}
                                    selectedValue={this.state.UserFinancialAidData.awardTypeId}
                                    onChange={this.onChange}
                                />
                                <Input
                                    type="text"
                                    name="awardedBy"
                                    label="Awarded By"
                                    value={this.state.UserFinancialAidData.awardedBy}
                                    onChange={this.onChange}
                                />
                                <Input
                                    type="text"
                                    name="program"
                                    label="Program"
                                    value={this.state.UserFinancialAidData.program}
                                    onChange={this.onChange}
                                />
                                <div className="row">
                                    <div className="col">
                                        <Input
                                            type="text"
                                            name="amountAwarded"
                                            label="Amount Awarded"
                                            value={this.state.UserFinancialAidData.amountAwarded}
                                            onChange={this.onChange}
                                        />

                                        <DropDownList
                                            label="Frequency Type"
                                            name="frequencyTypeId"
                                            options={this.state.frequencyTypes}
                                            selectedValue={this.state.UserFinancialAidData.frequencyTypeId}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <Input
                                            type="date"
                                            name="startDate"
                                            label="Start Date"
                                            value={moment(this.state.UserFinancialAidData.startDate).format("YYYY-MM-DD")}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col">
                                        <Input
                                            type="date"
                                            name="endDate"
                                            label="End Date"
                                            className="float-right"
                                            value={moment(this.state.UserFinancialAidData.endDate).format("YYYY-MM-DD")}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                </div>
                                <div>

                                </div>
                                <div className="row">
                                    <div className="col">
                                        <DropDownList
                                            label="1st Generation"
                                            name="isFirstGen"
                                            options={this.state.isFirstGen}
                                            selectedValue={this.state.UserFinancialAidData.isFirstGen}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col">
                                        <DropDownList
                                            label="Living Situation"
                                            name="livingSituationTypeId"
                                            options={this.state.livingSituationTypes}
                                            selectedValue={this.state.UserFinancialAidData.livingSituationTypeId}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">

                                        <div className="row">
                                            <div className="form-group col">
                                                <p>Upload Award Letter</p>
                                                <FileUploadWithCrop
                                                    onUploadComplete={this.onUploadComplete}
                                                    canvasUrl={this.state.UserFinancialAidData.awardLetterUrl}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
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

export default UserFinancialAidPage;