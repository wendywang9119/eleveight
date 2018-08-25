import * as React from 'react';
import { Input, Button, DropDownList } from '../common/form/index';
import { ITextValue } from '../common/form/ITextValue';
import CMDashboardApi from './cmDashboardApi';
import * as moment from 'moment';

interface IContactPage {
    contactData: IContactData
    isEdit: boolean
    userBaseId: number
}

interface IContactData {
    phones: IPhone[]
    emails: IEmail[]
    socialMedias: ISocial[]
}

interface IContactProps {
    userBaseId: number
}

interface IPhone {
    userPhoneId: number
    phoneNumber: string
    typeName: string
}

interface IEmail {
    userEmailId: number
    email: string
    isPrimary: boolean
}

interface ISocial {
    userSocialId: number
    socialMediaName: string
    userName: string
}

class ContactPage extends React.Component<IContactProps, IContactPage>{
    constructor(props) {
        super(props);
        this.state = {
            contactData: {
                emails: [],
                socialMedias: [],
                phones: []
            },
            isEdit: true,
            userBaseId: props.userBaseId
        }
    }

    componentDidMount() {
        this.getContactByUserId();
    }

    getContactByUserId = () => {
        CMDashboardApi.getContactByUserId(this.state.userBaseId)
            .then(res => {
                this.setState({
                    contactData: {
                        ...this.state.contactData,
                        emails: res.item.contactEmail,
                        phones: res.item.contactPhone,
                        socialMedias: res.item.contactSocialMedia
                    }
                })
            })
            .catch(err => console.log(err))
    }

    updateContact = () => {
        CMDashboardApi.updateContact(this.state.contactData)
            .then(res => {
                this.setState({
                    isEdit: true
                })
            })
            .catch(err => console.log(err))
    }

    onPhoneChange = (index) => (fieldName, fieldValue) => {
        let curentPhone = this.state.contactData.phones;
        curentPhone[index] = {
            ...curentPhone[index],
            [fieldName]: fieldValue
        }

        let nextState = {
            contactData: {
                ...this.state.contactData,
                phone: curentPhone
            }
        }

        this.setState(nextState);
    }

    onEmailChange = (index) => (fieldName, fieldValue) => {
        let curentEmail = this.state.contactData.emails;
        curentEmail[index] = {
            ...curentEmail[index],
            [fieldName]: fieldValue
        }

        let nextState = {
            contactData: {
                ...this.state.contactData,
                email: curentEmail
            }
        }

        this.setState(nextState);
    }

    onSocialChange = (index) => (fieldName, fieldValue) => {
        let curentSocial = this.state.contactData.socialMedias;
        curentSocial[index] = {
            ...curentSocial[index],
            [fieldName]: fieldValue
        }

        let nextState = {
            contactData: {
                ...this.state.contactData,
                social: curentSocial
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
        this.updateContact();
    }

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
                        {this.state.contactData.phones.map((item, index) => {
                            return (
                                <Input key={index}
                                    type="text"
                                    name="phoneNumber"
                                    label={item.typeName}
                                    value={item.phoneNumber}
                                    onChange={this.onPhoneChange(index)}
                                />
                            )
                        }
                        )}
                        {this.state.contactData.emails.map((item, index) => {
                            return (
                                <Input key={index}
                                    type="text"
                                    name="email"
                                    label={item.isPrimary ? 'Email 1' : 'Email 2'}
                                    value={item.email}
                                    onChange={this.onEmailChange(index)}
                                />
                            )
                        }
                        )}
                        {this.state.contactData.socialMedias.map((item, index) => {
                            return (
                                <Input key={index}
                                    type="text"
                                    name="userName"
                                    label={item.socialMediaName}
                                    value={item.userName}
                                    onChange={this.onSocialChange(index)}
                                />
                            )
                        }
                        )}

                    </fieldset>
                </form>

            </React.Fragment>
        )
    }
}

export default ContactPage;