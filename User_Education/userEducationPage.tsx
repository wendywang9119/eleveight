import * as React from 'react';
import { UserEducationForm, IUserEducationForm } from './userEducationForm'
import { ISchool } from './searchSuggestion';
import { ListEducation } from './educationList';
import UserEducationApi from './userEducationApi';
import { Button } from '../common/form';
import { Card } from '../common/card';
import * as moment from 'moment';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import apiExecute from '../common/apiExecute';
import { validateFields, formatTestCase, ITestCase } from "../common/DynamicRuleValidation";

interface IUserEducationPage {
    educationObj: IUserEducationForm,
    educationList: IUserEducationForm[],
    schoolList: ISchool[],
    isLoading: boolean,
    isFormValid: boolean,
    error: any
}

class UserEducationPage extends React.Component<{}, IUserEducationPage>{
    constructor(props) {
        super(props);
        this.state = {
            educationObj: {
                id: 0,
                userBaseId: 0,
                currentSemester: '',
                schoolName: '',
                gpa: 0,
                reportCardFileUrl: '',
                completedUnits: 0,
                enrollmentDate: '',
                expGradDate: '',
                major: '',
                plan: '',
                schoolIdNum: '',
                schoolIdPhotoFileUrl: '',
                createdById: 0,
                modifiedById: 0
            },
            educationList: [],
            schoolList: [],
            isLoading: false,
            isFormValid: false,
            error: {
                userBaseId: null,
                currentSemester: '',
                schoolName: '',
                schoolId: null,
                gpa: null,
                reportCardFileUrl: '',
                completedUnits: null,
                enrollmentDate: '',
                expGradDate: '',
                major: '',
                plan: '',
                schoolIdNum: '',
                schoolIdPhotoFileUrl: ''
            }
        }
    }

    componentDidMount() {
        this.getCurrentUserEducation();
    }

    getCurrentUserEducation = () => {
        UserEducationApi.getEducationByCurrentUser()
            .then(res => {
                this.setState({
                    ...this.state,
                    educationList: res.items,
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    postEducation = (data) => {
        UserEducationApi.postEducation(data)
            .then(res => {
                this.getCurrentUserEducation();
                this.setState({
                    ...this.state,
                    educationObj: {
                        ...this.state.educationObj,
                        id: 0,
                        currentSemester: '',
                        schoolName: '',
                        gpa: 0,
                        reportCardFileUrl: '',
                        completedUnits: 0,
                        enrollmentDate: '',
                        expGradDate: '',
                        major: '',
                        plan: '',
                        schoolIdNum: '',
                        schoolIdPhotoFileUrl: ''
                    }
                });
            })
            .catch(err => console.log(err))
    }

    updateEducation = (id, data) => {
        UserEducationApi.updateEducation(id, data)
            .then(res => {
                this.getCurrentUserEducation();
            })
            .catch(err => console.log(err))
    }

    getById = (id) => {
        UserEducationApi.getById(id)
            .then(res => {
                let education = res.item;
                education.enrollmentDate = moment(education.enrollmentDate).format('YYYY-MM-DD');
                education.expGradDate = moment(education.expGradDate).format('YYYY-MM-DD');
                education.schoolName = education.schoolName.trim();
                this.setState({
                    ...this.state,
                    educationObj: education
                })
            })
            .catch(err => console.log(err))
    }

    // using user's query to search in our school database 
    getByQuery = (query: string) => {
        this.setState({ isLoading: true })
        UserEducationApi.getByQuery(query)
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

    deleteEducation = (id) => {
        UserEducationApi.deleteById(id)
            .then(res => {
                this.getCurrentUserEducation()
            })
            .catch(err => console.log(err))
    }


    // pass "selected" into this function and check if it is selected
    onTypeAheadOnChange = (selected) => {
        if (selected && selected.length > 0) {
            this.setState({
                ...this.state,
                educationObj: {
                    ...this.state.educationObj,
                    schoolName: selected[0].schoolName,
                    schoolId: selected[0].id
                }
            })
        };
    }

    onSchoolInputChange = (field: string) => {
        this.setState({
            ...this.state, educationObj: {
                ...this.state.educationObj,
                schoolName: field
            }
        });
    }

    onChange = (fieldName, fieldValue) => {
        let nextState = {
            ...this.state,
            educationObj: {
                ...this.state.educationObj,
                [fieldName]: fieldValue
            }
        }

        this.setState(nextState, () => this.validateFields(this.state.educationObj, fieldName));
    }

    onSubmit = () => {
        let id = this.state.educationObj.id;
        let data = this.state.educationObj;
        if (id) {
            this.updateEducation(id, data);
        } else {
            this.postEducation(data);
        }

        this.setState({
            ...this.state,
            isFormValid: false
        })
    }

    onEdit = (id) => {
        this.getById(id);
    }

    onDelete = (id) => {
        this.deleteEducation(id);
    }

    clearData = () => {
        this.setState({
            educationObj: {
                ...this.state.educationObj,
                id: 0,
                schoolName: '',
                schoolId: 0,
                currentSemester: '',
                gpa: 0,
                reportCardFileUrl: '',
                completedUnits: 0,
                enrollmentDate: '',
                expGradDate: '',
                major: '',
                plan: '',
                schoolIdNum: '',
                schoolIdPhotoFileUrl: ''
            }
        })
    }

    onFileUploadReportCard = (url: string) => {
        let nextState = {
            ...this.state,
            educationObj: {
                ...this.state.educationObj,
                reportCardFileUrl: url
            }
        };
        this.setState(nextState);
    }

    onFileUploadSchoolIdPhoto = (url: string) => {
        let nextState = {
            ...this.state,
            educationObj: {
                ...this.state.educationObj,
                schoolIdPhotoFileUrl: url
            }
        };
        this.setState(nextState);
    }

    validateFields = (form: any, fieldName: string) => {
        if (this.state.error[fieldName] !== undefined) {
            let tests: ITestCase[] = new Array<ITestCase>();
            for (let field in this.state.error) {
                let rules = {};
                switch (field) {
                    case "userBaseId":
                        rules = {
                            isNumber: true
                        }
                        break;
                    case "currentSemester":
                        rules = {
                            minLength: 1,
                            maxLength: 100
                        }
                        break;
                    case "schoolId":
                        rules = {
                            isNumber: true
                        }
                        break;
                    case "schoolName":
                        rules = {
                            minLength: 1,
                            maxLength: 200
                        }
                        break;
                    case "gpa":
                        rules = {
                            isNumber: true
                        }
                        break;
                    case "completedUnits":
                        rules = {
                            isNumber: true
                        }
                        break;
                    case "enrollmentDate":
                        rules = {
                            minLength: 10
                        }
                        break;
                    case "expGradDate":
                        rules = {
                            minLength: 10
                        }
                        break;
                    case "major":
                        rules = {
                            minLength: 1,
                            maxLength: 100
                        }
                    default:
                        break;
                }
                tests.push(formatTestCase(form[field], field, rules, new Array<string>()))
            }
            tests = validateFields(tests);

            let newErrMsgs = { ...this.state.error };
            let currentFieldTest = tests.find(test => test.field == fieldName);
            if (currentFieldTest.errMsg.length > 0 && currentFieldTest.value)
                newErrMsgs = { ...this.state.error, [fieldName]: currentFieldTest.errMsg[0] };
            else newErrMsgs = { ...this.state.error, [fieldName]: "" }
            this.setState({ ...this.state, isFormValid: tests.every(test => test.errMsg.length == 0), error: newErrMsgs })
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="container-fluid flex-grow-1 container-p-y">
                    <h3 className="my-3">Education</h3>
                    <ListEducation
                        educationList={this.state.educationList}
                        onClick={this.onEdit}
                        onDelete={this.onDelete}
                    />
                    <button
                        className="btn btn-primary float-right"
                        data-toggle="modal"
                        data-target="#educationForm"
                        onClick={this.clearData}
                    >Add Education</button>
                </div>

                <div>

                    <div className="modal fade" id="educationForm" style={{ display: "none", ariaHidden: "true" }}>
                        <div className="modal-dialog modal-lg card-body">
                            <div className="modal-body">

                                <UserEducationForm
                                    userEducation={this.state.educationObj}
                                    onChange={this.onChange}
                                    onClick={this.onSubmit}
                                    schoolList={this.state.schoolList}
                                    onSearch={this.getByQuery}
                                    isLoading={this.state.isLoading}
                                    onTypeAheadOnChange={this.onTypeAheadOnChange}
                                    onSchoolInputChange={this.onSchoolInputChange}
                                    onFileUploadReportCard={this.onFileUploadReportCard}
                                    onFileUploadSchoolIdPhoto={this.onFileUploadSchoolIdPhoto}
                                    error={this.state.error}
                                    isFormValid={this.state.isFormValid}
                                />

                            </div>
                        </div>
                    </div>

                </div>
            </React.Fragment >
        );
    }
}

export default UserEducationPage;