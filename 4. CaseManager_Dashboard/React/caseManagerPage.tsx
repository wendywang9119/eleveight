import * as React from 'react';
import AddressPage from './addressPage';
import CertificationPage from './certificationPage';
import ContactPage from './contactPage';
import EducationPage from './educationPage';
import EmploymentPage from './employmentPage';
import MilitaryPage from './militaryPage';
import ProfilePage from './profilePage';
import UserAwardPage from './userAwardPage'
import UserFinancialAidPage from './UserFinancialAidPage';
import CMDashboardApi from './cmDashboardApi';
import UserWorkExperience from '../userProfile/workExperience/UserWorkExperience';

interface ICaseManagerPage {
    userBaseId: number
    firstName: string
    lastName: string
    avatarUrl: string
}

class CaseManagerPage extends React.Component<{}, ICaseManagerPage>{
    constructor(props) {
        super(props);
        this.state = {
            userBaseId: props.match.params.id,
            firstName: '',
            lastName: '',
            avatarUrl: ''
        }
    }

    componentDidMount() {
        CMDashboardApi.getProfileByUserId(this.state.userBaseId)
            .then(res => {
                this.setState({
                    ...this.state,
                    firstName: res.item.firstName,
                    lastName: res.item.lastName,
                    avatarUrl: res.item.avatarUrl
                })
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <React.Fragment>
                <div className="row card-deck col-md-12" style={{ paddingBottom: '20px' }}>
                    <div className="col-md-1">
                        <img src={this.state.avatarUrl ? this.state.avatarUrl : "http://www.zimphysio.org.zw/wp-content/uploads/2018/01/default-avatar-2.jpg"} height="80px" width="80px" className="rounded-circle" />
                    </div>
                    <div className="col-md-4 align-bottom">
                        <div className="card-body">
                            <h4><b> {this.state.firstName} {this.state.lastName}</b></h4>
                        </div>
                    </div>
                </div>
                <div className="row bg-light card-deck" style={{ paddingBottom: '20px', paddingTop: '50px' }}>
                    <div className="card col">
                        <div className="card-body">
                            <h4>Profile</h4>
                            <ProfilePage
                                userBaseId={this.state.userBaseId}
                            />
                        </div>
                    </div>
                    <div className="card col">
                        <div className="card-body">
                            <h4>Contact</h4>
                            <ContactPage
                                userBaseId={this.state.userBaseId}
                            />
                        </div>
                    </div>
                    <div className="card col col-sm-12">
                        <div className="card-body">
                            <h4>Address</h4>
                            <AddressPage
                                userBaseId={this.state.userBaseId}
                            />
                        </div>
                    </div>

                </div>
                <div className="row bg-light card-deck" style={{ paddingBottom: '20px' }}>
                    <div className="card col">
                        <div className="card-body">
                            <h4>Education</h4>
                            <EducationPage
                                userBaseId={this.state.userBaseId}
                            />
                        </div>
                    </div>
                    <div className="card col">
                        <div className="card-body">
                            <h4>EmploymentPage</h4>
                            <EmploymentPage
                                userBaseId={this.state.userBaseId}
                            />
                        </div>
                    </div>
                    <div className="card col">
                        <div className="card-body">
                            <h4>Military</h4>
                            <MilitaryPage
                                userBaseId={this.state.userBaseId}
                            />
                        </div>
                    </div>
                </div>
                <div className="row bg-light card-deck" style={{ paddingBottom: '20px' }}>
                    <div className="card col">
                        <div className="card-body">
                            <h4>Certification</h4>
                            <CertificationPage
                                userBaseId={this.state.userBaseId}
                            />
                        </div>
                    </div>
                    <div className="card col">
                        <div className="card-body">
                            <h4>Financial Aid</h4>
                            <UserFinancialAidPage
                                userBaseId={this.state.userBaseId}
                            />
                        </div>
                    </div>
                    <div className="card col">
                        <div className="card-body">
                            <h4>Awards / Honors / Volunteer</h4>
                            <UserAwardPage
                                userBaseId={this.state.userBaseId}
                            />
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}
export default CaseManagerPage;