import * as React from 'react';
import { Input, Button, DropDownList } from '../common/form';
import { ITextValue } from '../common/form/ITextValue';
import CMDashboardApi from './cmDashboardApi';
import * as moment from 'moment';
import { FileUpload } from '../common/form/fileUpload';
import { ModalWindow } from '../common/modal';

interface IProfileData {
    userProfileId: number,
    userDemoId: number,
    citizenshipTypeId: number
    ethnicityId: number
    firstName: string
    middleName: string
    lastName: string
    gender: string
    ssnVisa: string
    dateOfBirth: string
    prefix: string
    birthCertUrl: string
    ssnUrl: string
}

interface IProfilePage {
    profileData: IProfileData
    prefixOptions: ITextValue[]
    raceOptions: ITextValue[]
    citizenshipOptions: ITextValue[]
    isEdit: boolean
    userBaseId: number
    modalStateBirth: boolean
    modalStateSSN: boolean
}

interface IProfileProps {
    userBaseId: number
}

class ProfilePage extends React.Component<IProfileProps, IProfilePage>{
    constructor(props) {
        super(props);
        this.state = {
            profileData: {
                userProfileId: 0,
                userDemoId: 0,
                citizenshipTypeId: 0,
                ethnicityId: 10,
                firstName: '',
                middleName: '',
                lastName: '',
                gender: '',
                ssnVisa: '',
                dateOfBirth: moment().format('YYYY-MM-DD'),
                prefix: '',
                birthCertUrl: '',
                ssnUrl: ''
            },
            prefixOptions: [
                { value: 1, text: 'Please Select' },
                { value: 2, text: 'Mr' },
                { value: 3, text: 'Mrs' },
                { value: 4, text: 'Miss' },
                { value: 5, text: 'Ms' }
            ],
            raceOptions: [],
            citizenshipOptions: [],
            isEdit: true,
            userBaseId: props.userBaseId,
            modalStateBirth: false,
            modalStateSSN: false
        }
    }

    componentDidMount() {
        this.getProfileByUserId();
        this.getAllCitizenship();
        this.getAllRace();
    }

    getProfileByUserId = () => {
        CMDashboardApi.getProfileByUserId(this.state.userBaseId)
            .then(res => {
                this.setState({
                    profileData: res.item
                })
            })
            .catch(err => console.log(err))
    }

    getAllCitizenship = () => {
        CMDashboardApi.getAllCitiizenship()
            .then(res => {
                let opts = res.items.map(item => {
                    return { value: item.id, text: item.typeName };
                })
                this.setState({
                    citizenshipOptions: opts
                })
            })
            .catch(err => console.log(err))
    }

    getAllRace = () => {
        CMDashboardApi.getAllRace()
            .then(res => {
                let opts = res.items.map(item => {
                    return { value: item.id, text: item.typeName };
                })
                this.setState({
                    raceOptions: opts
                })
            })
            .catch(err => console.log(err))
    }

    updateProfile = () => {
        let profileId = this.state.profileData.userProfileId;
        let demoId = this.state.profileData.userDemoId;
        let model = this.state.profileData;
        CMDashboardApi.updateProfile(profileId, demoId, model)
            .then(res => {
                this.setState({
                    isEdit: true
                })
            })
            .catch(err => console.log(err))
    }

    onChange = (fieldName, fieldValue) => {
        let nextState = {
            ...this.state,
            profileData: {
                ...this.state.profileData,
                [fieldName]: fieldValue
            }
        }

        this.setState(nextState, () => console.log(nextState));
    }

    onEdit = () => {
        this.setState({
            isEdit: false
        })
    }

    onUpdate = () => {
        this.updateProfile();
    }

    fileUploadComplete = (propKeyName, fileUrl) => {
        this.setState({
            ...this.state,
            profileData: {
                ...this.state.profileData,
                [propKeyName]: fileUrl
            }
        });
    }

    onBirthModalClose = () => this.setState({ modalStateBirth: false });

    onSSNModalClose = () => this.setState({ modalStateSSN: false });

    birthUpload = (url) => {
        this.setState({
            ...this.state,
            profileData: {
                ...this.state.profileData,
                birthCertUrl: url
            }
        })
    }

    ssnUpload = (url) => {
        this.setState({
            ...this.state,
            profileData: {
                ...this.state.profileData,
                ssnUrl: url
            }
        })
    }

    birthClick = () => {
        this.setState({
            modalStateBirth: true
        })
    }

    ssnClick = () => {
        this.setState({
            modalStateSSN: true
        })
    }


    render() {
        return (
            <React.Fragment>
                <form>
                    <div className="d-flex flex-column ">
                        <div>
                            <Button
                                className={this.state.isEdit ? "btn btn-secondary float-right" : "btn btn-primary float-right"}
                                label={this.state.isEdit ? "Edit" : "Update"}
                                onClick={this.state.isEdit ? this.onEdit : this.onUpdate}
                            />
                        </div>
                    </div>
                    <fieldset disabled={this.state.isEdit}>
                        <DropDownList
                            label="Prefix"
                            name="prefix"
                            options={this.state.prefixOptions}
                            selectedValue={this.state.profileData.prefix}
                            onChange={this.onChange}
                        />
                        <Input
                            type="text"
                            name="firstName"
                            label="Fisrt Name"
                            value={this.state.profileData.firstName}
                            onChange={this.onChange}
                        />
                        <Input
                            type="text"
                            name="middleName"
                            label="Middle Name"
                            value={this.state.profileData.middleName}
                            onChange={this.onChange}
                        />
                        <Input
                            type="text"
                            name="lastName"
                            label="Last Name"
                            value={this.state.profileData.lastName}
                            onChange={this.onChange}
                        />
                        <div className="row">
                            <div className="col">
                                <DropDownList
                                    label="Race"
                                    name="ethnicityId"
                                    options={this.state.raceOptions}
                                    selectedValue={this.state.profileData.ethnicityId}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="col">
                                <Input className="float-right"
                                    type="text"
                                    name="gender"
                                    label="Gender"
                                    value={this.state.profileData.gender}
                                    onChange={this.onChange}
                                />
                            </div>
                        </div>
                        <Input
                            type="date"
                            name="dateOfBirth"
                            label="Birthdate"
                            value={moment(this.state.profileData.dateOfBirth).format("YYYY-MM-DD")}
                            onChange={this.onChange}
                        />
                        <div className="row">
                            <div className="col">
                                <DropDownList
                                    label="Citizenship Status"
                                    name="citizenshipTypeId"
                                    options={this.state.citizenshipOptions}
                                    selectedValue={this.state.profileData.citizenshipTypeId}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="col">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={this.birthClick}
                                >Birth Certificate</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <Input
                                    type="text"
                                    name="ssnVisa"
                                    label="SSN or Visa"
                                    value={this.state.profileData.ssnVisa}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="col">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={this.ssnClick}
                                >SSN Card</button>
                            </div>
                        </div>
                    </fieldset>
                </form>

                <div>
                    <ModalWindow
                        showModal={this.state.modalStateBirth}
                        onClose={this.onBirthModalClose}
                    >
                        <ModalWrapper
                            title="Birth Certificate"
                            src={this.state.profileData.birthCertUrl}
                            onUpload={this.birthUpload}
                        />
                    </ModalWindow>

                    <ModalWindow
                        showModal={this.state.modalStateSSN}
                        onClose={this.onSSNModalClose}
                    >
                        <ModalWrapper
                            title="SSN Card"
                            src={this.state.profileData.ssnUrl}
                            onUpload={this.ssnUpload}
                        />
                    </ModalWindow>
                </div>


            </React.Fragment>

        )
    }


}

const ModalWrapper = (props) => {
    return (
        <div>
            <h3>{props.title}</h3>
            <img className="img-fluid pb-2" src={props.src} height='auto' width='100%' />
            <FileUpload
                onUploadComplete={props.onUpload}
            />
        </div>
    )

}


export default ProfilePage;


