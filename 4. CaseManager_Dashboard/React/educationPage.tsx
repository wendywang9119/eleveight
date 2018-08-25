import * as React from 'react';
import { ITextValue } from '../common/form/ITextValue';
import * as moment from 'moment';
import { Card } from '../common/card';
import CMDashboardApi from './cMDashboardApi';
import { Input, Button, DropDownList } from '../common/form/index';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { FileUpload } from '../common/form/fileUpload';
import { ModalWindow } from '../common/modal';

interface IEducationPage {
    educationData: {
        id: number
        userBaseId: number
        currentSemester: string
        gpa: number
        schoolId: number
        reportCardFileUrl: string
        completedUnits: number
        enrollmentDate: string
        expGradDate: string
        major: string
        plan: string
        schoolIdNum: string
        schoolIdPhotoFileUrl: string
        createdById: number
        modifiedById: number
        schoolName: string
        unitReportCardUrl: string
    },
    isEdit: boolean
    isLoading: boolean
    schoolList: ITextValue[]
    modalStateGPA: boolean
    modalStateUnit: boolean
    modalStateSchoolId: boolean
}

interface IEducationPageProps {
    userBaseId: number
}

class EducationPage extends React.Component<IEducationPageProps, IEducationPage>{
    constructor(props) {
        super(props);
        this.state = {
            educationData: {
                id: 0,
                currentSemester: "",
                gpa: 0,
                schoolId: 0,
                reportCardFileUrl: "",
                completedUnits: 0,
                enrollmentDate: moment().format("YYYY-MM-DD"),
                expGradDate: moment().format("YYYY-MM-DD"),
                major: "",
                plan: "",
                schoolIdNum: "",
                schoolIdPhotoFileUrl: "",
                createdById: props.userBaseId,
                modifiedById: props.userBaseId,
                schoolName: "",
                userBaseId: props.userBaseId,
                unitReportCardUrl: ""
            },
            isEdit: true,
            isLoading: false,
            schoolList: [],
            modalStateGPA: false,
            modalStateUnit: false,
            modalStateSchoolId: false
        }
    }

    componentDidMount() {
        this.getEducationByUserId();
    }

    getEducationByUserId = () => {
        CMDashboardApi.getEducationByUserId(this.state.educationData.userBaseId)
            .then(res => {
                if (res.items.length > 0) {
                    let data = res.items[0];
                    data.schoolName = data.schoolName.trim();
                    this.setState({
                        educationData: data
                    })
                }
            })
            .catch(err => console.log(err))
    }

    onChange = (fieldName, fieldValue) => {
        let nextState = {
            ...this.state,
            educationData: {
                ...this.state.educationData,
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
        let id = this.state.educationData.id;
        if (id) {
            CMDashboardApi.updateEducationById(this.state.educationData)
                .then(res => {
                    this.setState({
                        isEdit: true
                    })
                })
                .catch(err => console.log("Error", err))
        } else {
            CMDashboardApi.postEducation(this.state.educationData)
                .then(res => {
                    this.setState({
                        isEdit: true,
                        educationData: {
                            ...this.state.educationData,
                            id: res.item
                        }
                    })
                })
                .catch(err => console.log(err))
        }
    }

    onTypeAheadOnChange = (selected) => {
        if (selected && selected.length > 0) {
            this.setState({
                ...this.state,
                educationData: {
                    ...this.state.educationData,
                    schoolName: selected[0].schoolName,
                    schoolId: selected[0].id
                }
            })
        };
    }

    onSchoolInputChange = (field: string) => {
        this.setState({
            ...this.state,
            educationData: {
                ...this.state.educationData,
                schoolName: field
            }
        });
    }

    getByQuery = (query: string) => {
        this.setState({ isLoading: true })
        CMDashboardApi.getByQuery(query)
            .then(res => {
                let newSchoolList = [...res.items]
                newSchoolList.map((school) => {
                    school.schoolName = school.schoolName.trim();
                });
                this.setState({
                    schoolList: newSchoolList,
                    isLoading: false,
                });
            })
            .catch(err => console.log(err))
    }

    onGPAModalClose = () => this.setState({ modalStateGPA: false });

    onUnitModalClose = () => this.setState({ modalStateUnit: false });

    onSchoolModalClose = () => this.setState({ modalStateSchoolId: false });

    gpaUpload = (url) => {
        this.setState({
            ...this.state,
            educationData: {
                ...this.state.educationData,
                reportCardFileUrl: url
            }
        })
    }

    unitUpload = (url) => {
        this.setState({
            ...this.state,
            educationData: {
                ...this.state.educationData,
                unitReportCardUrl: url
            }
        })
    }

    schoolUpload = (url) => {
        this.setState({
            ...this.state,
            educationData: {
                ...this.state.educationData,
                schoolIdPhotoFileUrl: url
            }
        })
    }

    gpaClick = () => {
        this.setState({
            modalStateGPA: true
        })
    }

    unitClick = () => {
        this.setState({
            modalStateUnit: true
        })
    }

    schoolClick = () => {
        this.setState({
            modalStateSchoolId: true
        })
    }



    render() {
        return (
            <React.Fragment>
                <form>
                    <div className="d-flex flex-column ">
                        <div>
                            <Button
                                className={this.state.isEdit ? "float-right btn btn-secondary" : "float-right btn btn-primary"}
                                label={this.state.isEdit ? "Edit" : "Update"}
                                onClick={this.state.isEdit ? this.onEdit : this.onUpdate}
                            />
                        </div>

                        <div>
                            <fieldset disabled={this.state.isEdit}>
                                <Input
                                    type="text"
                                    name="currentSemester"
                                    label="Current Grade"
                                    value={this.state.educationData.currentSemester}
                                    onChange={this.onChange}
                                />
                                <div className="form-group">
                                    <label>School Name</label>
                                    <AsyncTypeahead
                                        options={this.state.schoolList}
                                        labelKey="schoolName"
                                        onSearch={this.getByQuery}
                                        isLoading={this.state.isLoading}
                                        useCache={true}
                                        onChange={this.onTypeAheadOnChange}
                                        onInputChange={this.onSchoolInputChange}
                                        selected={this.state.educationData.schoolName !== '' ? [this.state.educationData.schoolName] : []}  // check if there is a schoolName
                                    />
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <Input
                                            type="text"
                                            name="gpa"
                                            label="GPA"
                                            value={this.state.educationData.gpa}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={this.gpaClick}
                                        >GPA Report Card</button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <Input
                                            type="text"
                                            name="completedUnits"
                                            label="Completed Units"
                                            value={this.state.educationData.completedUnits}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col">

                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={this.unitClick}
                                        >Units Report Card</button>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col">
                                        <Input
                                            type="date"
                                            name="enrollmentDate"
                                            label="Enrollment Date"
                                            value={moment(this.state.educationData.enrollmentDate).format("YYYY-MM-DD")}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col">
                                        <Input
                                            type="date"
                                            name="expGradDate"
                                            label="Expected Grad Date"
                                            className="float-right"
                                            value={moment(this.state.educationData.expGradDate).format("YYYY-MM-DD")}
                                            onChange={this.onChange}
                                        />
                                    </div>

                                </div>

                                <Input
                                    type="text"
                                    name="major"
                                    label="Major"
                                    value={this.state.educationData.major}
                                    onChange={this.onChange}
                                />
                                <Input
                                    type="text"
                                    name="plan"
                                    label="Plan"
                                    value={this.state.educationData.plan}
                                    onChange={this.onChange}
                                />
                                <div className="row">
                                    <div className="col">
                                        <Input
                                            type="text"
                                            name="schoolIdNum"
                                            label="School ID#"
                                            value={this.state.educationData.schoolIdNum}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={this.schoolClick}
                                        >School Issued Id</button>
                                    </div>

                                </div>
                            </fieldset>
                        </div>
                    </div>
                </form>

                <div>
                    <ModalWindow
                        showModal={this.state.modalStateGPA}
                        onClose={this.onGPAModalClose}
                    >
                        <ModalWrapper
                            title="GPA Report Card"
                            src={this.state.educationData.reportCardFileUrl}
                            onUpload={this.gpaUpload}
                        />
                    </ModalWindow>

                    <ModalWindow
                        showModal={this.state.modalStateUnit}
                        onClose={this.onUnitModalClose}
                    >
                        <ModalWrapper
                            title="Completed Units Report Card"
                            src={this.state.educationData.unitReportCardUrl}
                            onUpload={this.unitUpload}
                        />
                    </ModalWindow>

                    <ModalWindow
                        showModal={this.state.modalStateSchoolId}
                        onClose={this.onSchoolModalClose}
                    >
                        <ModalWrapper
                            title="School Issued ID"
                            src={this.state.educationData.schoolIdPhotoFileUrl}
                            onUpload={this.schoolUpload}
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

export default EducationPage;