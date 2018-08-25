import * as React from 'react';
import { Input, Button, DropDownList } from '../common/form/index';
import { ITextValue } from '../common/form/ITextValue';
import CMDashboardApi from './cmDashboardApi';
import * as moment from 'moment';

export interface IAddressData {
    streetAddress: string
    streetAddress2: string
    city: string
    postalCode: string
    stateProvinceId: number
    martialStatusTypeId?: number
    isHomeless?: boolean
    primaryLanguageTypeId?: number
    secondLanguageTypeId?: number
    userDemoId?: number
    addressId?: number
}

interface IAddressPage {
    addressData: IAddressData
    stateOptions: ITextValue[]
    languageOptions: ITextValue[]
    homelessOptions: ITextValue[]
    maritalOptions: ITextValue[]
    isEdit: boolean
    userBaseId: number
}

interface IAddressProps {
    userBaseId: number
}

class AddressPage extends React.Component<IAddressProps, IAddressPage> {
    constructor(props) {
        super(props);
        this.state = {
            addressData: {
                userDemoId: 0,
                addressId: 0,
                streetAddress: '',
                streetAddress2: '',
                city: '',
                postalCode: '',
                stateProvinceId: 0,
                martialStatusTypeId: 0,
                isHomeless: false,
                primaryLanguageTypeId: 0,
                secondLanguageTypeId: 0
            },
            homelessOptions: [
                { value: true, text: 'Yes' },
                { value: false, text: 'No' }
            ],
            stateOptions: [],
            languageOptions: [],
            maritalOptions: [],
            isEdit: true,
            userBaseId: props.userBaseId
        }
    }

    componentDidMount() {
        this.getAddressByUserId();
        this.getAllLanguage();
        this.getAllMaritalStatus();
        this.getAllState();
    }

    getAddressByUserId = () => {
        CMDashboardApi.getAddressByUserId(this.state.userBaseId)
            .then(res => {
                if (res.item.addressId === 0) {
                    this.setState({
                        ...this.state,
                        addressData: {
                            ...this.state.addressData,
                            city: '',
                            postalCode: '',
                            streetAddress: '',
                            streetAddress2: ''
                        }
                    })
                } else {
                    this.setState({
                        addressData: res.item
                    })
                }
            })
            .catch(err => console.log(err))
    }

    getAllState = () => {
        CMDashboardApi.getAllState()
            .then(res => {
                let opts = res.items.map(item => {
                    return { value: item.id, text: item.stateProvinceCode };
                })
                this.setState({
                    stateOptions: opts
                })
            })
            .catch(err => console.log(err))
    }

    getAllMaritalStatus = () => {
        CMDashboardApi.getAllMaritalStatus()
            .then(res => {
                let opts = res.items.map(item => {
                    return { value: item.id, text: item.typeName };
                })
                this.setState({
                    maritalOptions: opts
                })
            })
            .catch(err => console.log(err))
    }

    getAllLanguage = () => {
        CMDashboardApi.getAllLanguage()
            .then(res => {
                let opts = res.items.map(item => {
                    return { value: item.id, text: item.typeName };
                })
                this.setState({
                    languageOptions: opts
                })
            })
            .catch(err => console.log(err))
    }

    updateAddress = () => {
        let addressId = this.state.addressData.addressId;
        let demoId = this.state.addressData.userDemoId;
        let model = this.state.addressData;
        CMDashboardApi.updateAddress(addressId, demoId, model)
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
            addressData: {
                ...this.state.addressData,
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
        this.updateAddress();
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
                        <Input
                            type="text"
                            name="streetAddress"
                            label="Address 1"
                            value={this.state.addressData.streetAddress}
                            onChange={this.onChange}
                        />
                        <Input
                            type="text"
                            name="streetAddress2"
                            label="Address 2"
                            value={this.state.addressData.streetAddress2}
                            onChange={this.onChange}
                        />
                        <div className="row">
                            <div className="col">
                                <Input
                                    type="text"
                                    name="city"
                                    label="City"
                                    value={this.state.addressData.city}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="col">
                                <DropDownList
                                    label="State"
                                    name="stateProvinceId"
                                    options={this.state.stateOptions}
                                    selectedValue={this.state.addressData.stateProvinceId}
                                    onChange={this.onChange}
                                />
                            </div>
                        </div>
                        <Input
                            type="text"
                            name="postalCode"
                            label="Zip"
                            value={this.state.addressData.postalCode}
                            onChange={this.onChange}
                        />
                        <DropDownList
                            label="Homeless?"
                            name="isHomeless"
                            options={this.state.homelessOptions}
                            selectedValue={this.state.addressData.isHomeless}
                            onChange={this.onChange}
                        />
                        <DropDownList
                            label="Marital Status"
                            name="martialStatusTypeId"
                            options={this.state.maritalOptions}
                            selectedValue={this.state.addressData.martialStatusTypeId}
                            onChange={this.onChange}
                        />
                        <div className="row">
                            <div className="col">
                                <DropDownList
                                    label="Primary Language"
                                    name="primaryLanguageTypeId"
                                    options={this.state.languageOptions}
                                    selectedValue={this.state.addressData.primaryLanguageTypeId}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="col">
                                <DropDownList
                                    label="Second Language"
                                    name="secondLanguageTypeId"
                                    options={this.state.languageOptions}
                                    selectedValue={this.state.addressData.secondLanguageTypeId}
                                    onChange={this.onChange}
                                />
                            </div>
                        </div>
                    </fieldset>
                </form>
            </React.Fragment>
        )
    }
}

export default AddressPage;