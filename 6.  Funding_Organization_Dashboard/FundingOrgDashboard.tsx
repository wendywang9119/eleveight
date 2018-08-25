import *  as React from 'react';
import OrgAssignApi from './OrgAssignApi';
import FundingOrgApi from './FundingOrgApi';
import { Button } from '../common/form';
import * as moment from 'moment';
import { ScholarshipApi } from '../scholarship/scholarshipApi';



interface IState {
    orgId: number
    orgName: string
    schools: any
    scholarships: any
    schoolName: any
    totalAmount: any
    orgLogo: any
}



class FundingOrgPage extends React.Component<any, IState> {
    constructor(props) {
        super(props);
        this.state = {
            orgId: 0,
            orgName: '',
            orgLogo: '',
            schools: [],
            scholarships: [],
            schoolName: '',
            totalAmount: 0
        }
    }


    componentDidMount() {
        this.getSchoolsByUserId();
        this.getCurrentOrgName();
    }

    getSchoolsByUserId = () => {
        FundingOrgApi.getSchoolsByUserId()
            .then(res => {
                this.setState({
                    schools: res.item.schools,
                    scholarships: res.item.scholarships
                })
            })
            .catch(err => console.log(err))
    }

    getCurrentOrgName = () => {
        FundingOrgApi.getOrgName()
            .then(res => {
                let logo = res.item.logoUrl;
                this.setState({
                    orgName: res.item.orgName,
                    orgLogo: res.item.logoUrl,
                    orgId: res.item.id
                })
            })
            .catch(err => console.log(err))
    }

    getScholarshipsBySchool = (id) => {
        FundingOrgApi.getScholarshipsBySchool(this.state.orgId, id)
            .then(res => {
                // Calculate total amount for this school
                let sum = 0;
                let scholarships = res.items;
                for (let i = 0; i < scholarships.length; i++) {
                    sum += scholarships[i].amount
                }
                this.setState({
                    scholarships: res.items,
                    schoolName: res.items[0].orgName,
                    totalAmount: sum
                })
            })
            .catch(err => console.log(err))
    }

    onChartClick = (id) => {
        this.props.history.push(`/funding/scholarships/charts/${id}`)
    }

    onSchoolClick = id => {
        this.getScholarshipsBySchool(id);
    }

    archiveScholarship = (scholarshipId, schoolId) => {
        ScholarshipApi.archiveScholarship(scholarshipId)
            .then(response => {
                this.getScholarshipsBySchool(schoolId);
            })
            .catch(err => console.log(err));
    }

    unarchiveScholarship = (scholarshipId, schoolId) => {
        ScholarshipApi.unarchiveScholarship(scholarshipId)
            .then(response => {
                this.getScholarshipsBySchool(schoolId);
            })
            .catch(err => console.log(err));
    }


    render() {
        return (
            <React.Fragment>
                <div className="row card-deck col-md-12" style={{ paddingBottom: '20px' }}>
                    <div className="col-md-1">
                        <img src={this.state.orgLogo != null ? this.state.orgLogo : 'http://www.zimphysio.org.zw/wp-content/uploads/2018/01/default-avatar-2.jpg'} height="80px" width="80px" className="rounded-circle" />
                    </div>
                    <div className="col-md-6 align-bottom">
                        <div className="card-body">
                            <h2 className="mb-1">{this.state.orgName}</h2>
                        </div>
                    </div>
                </div>
                <div className="table-responsive ui-bordered">
                    <table className="clients-table table table-hover m-0">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Grantee Name</th>
                                <th scope="col">Bio</th>
                                <th scope="col">Website</th>
                                <th scope="col">Contact Name</th>
                                <th scope="col">Grant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.schools.map((school, index) => {
                                return (

                                    <tr key={index} >
                                        <td>
                                            <img src={school.logoUrl} height="60px" width="60px" className="rounded-circle" />
                                        </td>
                                        <td style={{ cursor: 'pointer' }}
                                            data-toggle="modal"
                                            data-target="#schoolDetail"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                this.onSchoolClick(school.organizationId)
                                            }
                                            }>{school.orgName} ({school.count})</td>
                                        <td>{school.organizationBio}</td>
                                        <td>
                                            <a href={school.websiteUrl}>{school.websiteUrl}</a>
                                        </td>
                                        <td>{school.contactName}</td>
                                        <td>{this.state.orgName}</td>
                                    </tr>

                                )
                            })}
                        </tbody>
                    </table>
                </div>


                <div className="modal fade" id="schoolDetail" style={{ display: "none", ariaHidden: "true" }}>
                    <div className="modal-dialog modal-lg card-body">
                        <div className="container modal-content">
                            <div className="modal-header">
                                <h3>{this.state.schoolName}   ${this.state.totalAmount}</h3>
                                <button
                                    type="button"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    className="close float-right"
                                >
                                    x
                                </button>
                            </div>
                            <div className="modal-body">
                                <table className="table table-striped table-bordered dataTable no-footer" role="grid">
                                    <thead>
                                        <tr>
                                            <th>Scholarship Name</th>
                                            <th>Amount</th>
                                            <th>Deadline</th>
                                            <th>Chart</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.scholarships.map((itm, index) => {
                                            let isActiveClass = itm.isActive ? "success" : "secondary"
                                            return (
                                                <tr key={index}>
                                                    <td >{itm.name}</td>
                                                    <td>{itm.amount}</td>
                                                    <td>{moment(itm.deadlineDate).format('MMMM Do YYYY')}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            data-dismiss="modal"
                                                            aria-label="Close"
                                                            className="btn  btn-xs btn-warning"
                                                            onClick={() => this.onChartClick(itm.scholarshipId)}
                                                        >
                                                            View Chart
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            label={itm.isActive ? "Active" : "Inactive"}
                                                            className={`btn  btn-xs btn-outline-${isActiveClass} waves-effect`}
                                                            onClick={itm.isActive ? () => this.archiveScholarship(itm.scholarshipId, itm.organizationId) : () => this.unarchiveScholarship(itm.scholarshipId, itm.organizationId)}
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

export default FundingOrgPage;
