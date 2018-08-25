import * as React from 'react';
import { Input, Button, DropDownList, TextArea } from '../common/form';
import { ITextValue } from '../common/form/ITextValue';
import { FileUpload } from '../common/form/fileUpload'
import CMDashboardApi from './cmDashboardApi';
import * as moment from 'moment';

interface IAwardData {
    id: number;
    honorTypeId: number;
    awardedBy: string;
    startDate: string;
    endDate: string;
    title: string;
    awardFileUrl: string;
    awardFileUrlUploadDate: string;
    notes: string;
    createdByUserBaseId: number;
    modifiedByUserBaseId: number;
}

interface IUserAwardPage {
    awardData: IAwardData;
    honorTypeList: ITextValue[];
    isEdit: boolean;
    isDisabled: boolean;
    userBaseId: IAwardProps;
}

interface IAwardProps {
    userBaseId: number
}

class UserAwardPage extends React.Component<IAwardProps, IUserAwardPage> {
    constructor(props) {
        super(props);
        this.state = {
            awardData: {
                id: props.userBaseId,
                honorTypeId: 0,
                awardedBy: "",
                startDate: moment().format(`YYYY-MM-DD`),
                endDate: moment().format(`YYYY-MM-DD`),
                title: "",
                awardFileUrl: "",
                awardFileUrlUploadDate: "",
                notes: "",
                createdByUserBaseId: props.userBaseId,
                modifiedByUserBaseId: props.userBaseId
            },
            honorTypeList: [],
            isEdit: true,
            isDisabled: true,
            userBaseId: props.userBaseId
        }
    }

    componentDidMount() {
        this.getUserAwardData();
        this.getAllHonorTypeData();
    }

    //#region Api calls
    getUserAwardData() {
        CMDashboardApi.getUserAwardById(this.state.userBaseId)
            .then(resp => {
                if (resp.item.id === 0) {
                    let data = resp.item;
                    data.awardFileUrl = '';
                    data.awardedBy = '';
                    data.notes = '';
                    data.title = '';
                    this.setState({
                        awardData: data
                    })
                } else {
                    this.setState({ awardData: resp.item });
                }
            }).catch(err => console.log(`Unable to load user data`, err));
    }

    getAllHonorTypeData() {
        let honorData = [];
        CMDashboardApi.getAllHonorType()
            .then(resp => {
                honorData = resp.items.map((list) => { return { value: list.id, text: list.typeName } });
                honorData.unshift({ value: 0, text: `Select Honor Type` });
                this.setState({ honorTypeList: honorData });
            }).catch(err => console.log(`Unable to load honortype data`, err));
    }

    updateAwards() {
        CMDashboardApi.updateUserAward(this.state.awardData)
            .then(res => {
                this.setState({ isEdit: true })
            }).catch(err => console.log(`User Award Update Error: `, err))
    }

    postAwards() {
        CMDashboardApi.postUserAward(this.state.awardData)
            .then(res => {
                this.setState({
                    isEdit: true,
                    awardData: {
                        ...this.state.awardData,
                        id: res.item
                    }
                });
            }).catch(err => console.log(`User Award Post Error: `, err))
    }
    //#endregion


    //#region Change Handlers
    onChange = (key, val) => {
        let nextState = {
            ...this.state,
            awardData: {
                ...this.state.awardData,
                [key]: val
            }
        }
        this.setState(nextState, () => console.log(nextState));
    }

    onEdit = () => { this.setState({ isEdit: false }) }

    onUpdate = () => { (this.state.userBaseId) ? this.updateAwards() : this.postAwards() }
    //#endregion

    render() {
        return (
            <React.Fragment>
                <form>
                    <div className="d-flex flex-column">
                        <div>
                            <Button
                                className={this.state.isEdit ? "btn btn-secondary float-right" : "btn btn-primary float-right"}
                                label={this.state.isEdit ? "Edit" : "Update"}
                                onClick={this.state.isEdit ? this.onEdit : this.onUpdate}
                            />
                        </div>
                    </div>
                    <fieldset disabled={this.state.isEdit}>
                        <div className="form-group">
                            <DropDownList
                                label="Honor"
                                name="honorTypeId"
                                options={this.state.honorTypeList}
                                selectedValue={this.state.awardData.honorTypeId}
                                onChange={this.onChange}
                                disabled={this.state.isDisabled}
                            />
                        </div>
                        <div className="form-group">
                            <Input
                                type="text"
                                name="awardedBy"
                                label="Awarded By"
                                value={this.state.awardData.awardedBy}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="form-group">
                            <Input
                                type="date"
                                name="startDate"
                                label="Start Date"
                                value={moment(this.state.awardData.startDate).format(`YYYY-MM-DD`)}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="form-group">
                            <Input
                                type="date"
                                name="endDate"
                                label="Expiration Date"
                                value={moment(this.state.awardData.endDate).format(`YYYY-MM-DD`)}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="form-group">
                            <Input
                                type="text"
                                name="title"
                                label="Title"
                                value={this.state.awardData.title}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="form-group">
                            <TextArea
                                type="text"
                                name="notes"
                                label="Notes"
                                value={this.state.awardData.notes}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="form-group">
                            <FileUpload onUploadComplete={name => this.state.awardData.awardFileUrl = name} />
                        </div>
                    </fieldset>
                </form>
            </React.Fragment>
        );
    }
}
export default UserAwardPage