import * as React from 'react';
import { Input, DropDownList, Button } from '../common/form';
import { ITextValue } from '../common/form/ITextValue';
import OrgAssignApi from './OrgAssignApi';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Tab, Tabs } from '../common/tabs';
import * as moment from 'moment';
import { ScholarshipApi } from '../scholarship/scholarshipApi';
import OrgGroupsApi from '../organizationGroups/orgGroupsApi';

interface ISchoolScholarship {
    schoolName: string
    organizationId: number
    scholarshipId: number
}

interface IRelSchool {
    organizationId: number
    orgName: string
}

interface IRelScholarship {
    scholarshipId: number
    organizationId: number
    orgName: string
    name: string
    deadlineDate: Date
    amount: number
    isActive: boolean

}

interface IOrgAssignPage {
    scholarshipList: ITextValue[]
    schoolList: ITextValue[]
    relSchoolList: IRelSchool[]
    relScholarshipList: IRelScholarship[]
    schoolScholarship: ISchoolScholarship
    orgId: number
    isLoading: boolean
}

class OrgAssignPage extends React.Component<{}, IOrgAssignPage>{
    constructor(props) {
        super(props);
        this.state = {
            // For Dropdown List
            scholarshipList: [],
            // For Search Query
            schoolList: [],

            relSchoolList: [],
            relScholarshipList: [],
            schoolScholarship: {
                schoolName: '',
                organizationId: 0,
                scholarshipId: 0
            },
            orgId: props.match.params.id,
            isLoading: false
        }
    }

    componentDidMount() {
        let orgId = this.state.orgId;
        if (orgId) {
            OrgAssignApi.getScholarshipByOrgId(this.state.orgId)
                .then(res => {
                    let opts = res.items.map(item => {
                        return { value: item.id, text: item.name }
                    })
                    this.setState({
                        scholarshipList: opts,
                        schoolScholarship: {
                            ...this.state.schoolScholarship,
                            scholarshipId: res.items[0].id
                        }
                    })
                })
                .catch(err => console.log(err))
            this.getRelsByOrgId();
        } else {
            OrgAssignApi.getScholarshipByUserId()
                .then(res => {
                    let opts = res.items.map(item => {
                        return { value: item.id, text: item.name }
                    })
                    this.setState({
                        scholarshipList: opts,
                        schoolScholarship: {
                            ...this.state.schoolScholarship,
                            scholarshipId: res.items[0].id
                        }
                    })
                })
                .catch(err => console.log(err))
            this.getRelsByUserId();
        }

    }

    getByQuery = (query: string) => {
        this.setState({ isLoading: true })
        OrgAssignApi.getByQuery(query)
            .then(res => {
                this.setState({
                    schoolList: res.items,
                    isLoading: false,
                });
            })
            .catch(err => console.log(err))
    }


    onTypeAheadOnChange = (selected) => {
        if (selected && selected.length > 0) {
            this.setState({
                ...this.state,
                schoolScholarship: {
                    ...this.state.schoolScholarship,
                    schoolName: selected[0].orgName,
                    organizationId: selected[0].id
                }
            })
        };
    }

    onSchoolInputChange = (field: string) => {
        this.setState({
            ...this.state,
            schoolScholarship: {
                ...this.state.schoolScholarship,
                schoolName: field
            }
        });
    }

    onChange = (fieldName, fieldValue) => {
        let nextState = {
            ...this.state,
            schoolScholarship: {
                ...this.state.schoolScholarship,
                [fieldName]: fieldValue
            }
        }
        this.setState(nextState);
    }

    onClick = () => {
        OrgAssignApi.assignScholarship(this.state.schoolScholarship)
            .then(res => {
                // Refresh Scholarship List
                let orgId = this.state.orgId;
                if (orgId) {
                    this.getRelsByOrgId();
                } else {
                    this.getRelsByUserId();
                }

                this.setState({
                    schoolScholarship: {
                        schoolName: '',
                        organizationId: 0,
                        scholarshipId: 0
                    },
                })
            })
            .catch(err => console.log(err))
    }

    getRelsByOrgId = () => {
        OrgAssignApi.getRelsByOrgId(this.state.orgId)
            .then(res => {
                this.setState({
                    relSchoolList: res.item.schools,
                    relScholarshipList: res.item.scholarships
                })
            })
            .catch(err => console.log(err))
    }

    getRelsByUserId = () => {
        OrgAssignApi.getRelsByUserId()
            .then(res => {
                this.setState({
                    relSchoolList: res.item.schools,
                    relScholarshipList: res.item.scholarships
                })
            })
            .catch(err => console.log(err))
    }

    archiveScholarship = (scholarshipId) => {
        ScholarshipApi.archiveScholarship(scholarshipId)
            .then(response => {
                // Refresh Scholarship List 
                this.getOrgScholarshipList();
            })
            .catch(err => console.log(err));
    }

    unarchiveScholarship = (scholarshipId) => {
        ScholarshipApi.unarchiveScholarship(scholarshipId)
            .then(response => {
                // Refresh Scholarship List 
                this.getOrgScholarshipList();
            })
            .catch(err => console.log(err));
    }

    getOrgScholarshipList = () => {
        OrgAssignApi.getScholarshipByOrgId(this.state.orgId)
            .then(res => {
                let opts = res.items.map(item => {
                    return { value: item.id, text: item.name }
                })
                this.setState({
                    scholarshipList: opts,
                    schoolScholarship: {
                        ...this.state.schoolScholarship,
                        scholarshipId: res.items[0].id
                    }

                })
            })
            .catch(err => console.log(err))
        this.getRelsByOrgId();
    }

    render() {
        return (
            <React.Fragment>
                <h2>Assign Scholarship Page</h2>
                <div className="row bg-light card-deck" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                    <div className="col card">
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <label>School</label>
                                    <AsyncTypeahead
                                        options={this.state.schoolList}
                                        labelKey="orgName"
                                        onSearch={this.getByQuery}
                                        isLoading={this.state.isLoading}
                                        useCache={true}
                                        onChange={this.onTypeAheadOnChange}
                                        onInputChange={this.onSchoolInputChange}
                                        placeholder="Ex: Irvine Valley College"
                                        selected={this.state.schoolScholarship.schoolName !== '' ? [this.state.schoolScholarship.schoolName] : []}

                                    />
                                </div>
                                <DropDownList
                                    label="Scholarship"
                                    name="scholarshipId"
                                    options={this.state.scholarshipList}
                                    selectedValue={this.state.schoolScholarship.scholarshipId}
                                    onChange={this.onChange}
                                />
                                <Button
                                    className="btn btn-primary float-right"
                                    label="Assign"
                                    onClick={this.onClick}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="col-md-6 card">
                        <div className="card-body">
                            <Tabs defaultActiveTabIndex={0}>
                                {this.state.relSchoolList.map((school, schoolIndex) => {
                                    return (
                                        <Tab key={schoolIndex} linkClassName="nav-link" tabHeader={school.orgName} tabIndex={school.organizationId}>
                                            {this.state.relScholarshipList.map((scholarship, scholarshipIndex) => {
                                                let isActiveClass = scholarship.isActive ? "success" : "secondary"
                                                if (scholarship.organizationId === school.organizationId) {
                                                    return (
                                                        <div key={scholarshipIndex}>
                                                            <ul>
                                                                <li>{scholarship.name}</li>
                                                                <ul>
                                                                    <li>Deadline: {moment(scholarship.deadlineDate).format('MMMM Do YYYY')}</li>
                                                                    <li>Award: ${scholarship.amount}</li>
                                                                    <Button
                                                                        label={scholarship.isActive ? "Active" : "Inactive"}
                                                                        className={`btn  btn-xs btn-outline-${isActiveClass} waves-effect`}
                                                                        onClick={scholarship.isActive ? () => this.archiveScholarship(scholarship.scholarshipId) : () => this.unarchiveScholarship(scholarship.scholarshipId)}
                                                                    />
                                                                </ul>
                                                            </ul>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </Tab>
                                    )
                                })}
                            </Tabs>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )

    }


}

export default OrgAssignPage;