import * as React from 'react';
import { Input, Button, DropDownList } from '../common/form';
import { ITextValue } from '../common/form/ITextValue';
import CMDashboardApi from './cmDashboardApi';
import * as moment from 'moment';
import { FileUpload } from '../common/form/fileUpload';
import { ModalWindow } from '../common/modal';

interface ICertificationData {
    id: number
    userBaseId: number
    certificationName: string
    status: boolean
    startDate: string
    expDate: string
    certificationId: number
    issudedCity: string
    description: string
    createdById: number
    modifiedById: number
    certUrl: string
}

interface ICertificationPage {
    certificationData: ICertificationData
    statusOptions: ITextValue[]
    isEdit: boolean
    userBaseId: number
    modalStateCert: boolean
}

interface ICertificationProps {
    userBaseId: number
}

class CertificationPage extends React.Component<ICertificationProps, ICertificationPage>{
    constructor(props) {
        super(props);
        this.state = {
            certificationData: {
                id: 0,
                userBaseId: props.userBaseId,
                certificationName: '',
                status: false,
                startDate: moment().format('YYYY-MM-DD'),
                expDate: moment().format('YYYY-MM-DD'),
                certificationId: 0,
                issudedCity: '',
                description: '',
                createdById: props.userBaseId,
                modifiedById: props.userBaseId,
                certUrl: ''
            },
            statusOptions: [
                { value: true, text: 'Active' },
                { value: false, text: 'InActive' }
            ],
            isEdit: true,
            userBaseId: props.userBaseId,
            modalStateCert: false
        }
    }

    componentDidMount() {
        this.getCertificationByUserId();
    }

    getCertificationByUserId = () => {
        CMDashboardApi.getCertificationByUserId(this.state.userBaseId)
            .then(res => {
                if (res.items.length > 0) {
                    this.setState({
                        certificationData: res.items[0]
                    })
                }
            })
            .catch(err => console.log(err))
    }

    updateCertification = () => {
        let id = this.state.certificationData.id;
        let model = this.state.certificationData;
        if (id) {
            CMDashboardApi.updateCertification(id, model)
                .then(res => {
                    this.setState({
                        isEdit: true
                    })
                })
                .catch(err => console.log(err))
        } else {
            CMDashboardApi.postCertification(model)
                .then(res => {
                    this.setState({
                        isEdit: true,
                        certificationData: {
                            ...this.state.certificationData,
                            id: res.item
                        }

                    })
                })
                .catch(err => console.log(err))
        }

    }

    onChange = (fieldName, fieldValue) => {
        let nextState = {
            ...this.state,
            certificationData: {
                ...this.state.certificationData,
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

    onUpdate = () => {
        this.updateCertification();
    }

    onCertModalClose = () => this.setState({ modalStateCert: false });

    certUpload = (url) => {
        this.setState({
            ...this.state,
            certificationData: {
                ...this.state.certificationData,
                certUrl: url
            }
        })
    }

    certClick = () => {
        this.setState({
            modalStateCert: true
        })
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
                        <Input
                            type="text"
                            name="certificationName"
                            label="Certification"
                            value={this.state.certificationData.certificationName}
                            onChange={this.onChange}
                        />
                        <DropDownList
                            label="Status"
                            name="status"
                            options={this.state.statusOptions}
                            selectedValue={this.state.certificationData.status}
                            onChange={this.onChange}
                        />
                        <div className="row">
                            <div className="col">
                                <Input
                                    type="date"
                                    name="startDate"
                                    label="Start Date "
                                    value={moment(this.state.certificationData.startDate).format('YYYY-MM-DD')}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="col">
                                <Input
                                    type="date"
                                    name="expDate"
                                    label="Expiration Date"
                                    value={moment(this.state.certificationData.expDate).format('YYYY-MM-DD')}
                                    onChange={this.onChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <Input
                                    type="number"
                                    name="certificationId"
                                    label="ID#"
                                    value={this.state.certificationData.certificationId}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="col">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={this.certClick}
                                >Certification</button>
                            </div>
                        </div>
                        <Input
                            type="text"
                            name="issudedCity"
                            label="Issuded City"
                            value={this.state.certificationData.issudedCity}
                            onChange={this.onChange}
                        />
                        <Input
                            type="text"
                            name="description"
                            label="Notes"
                            value={this.state.certificationData.description}
                            onChange={this.onChange}
                        />
                    </fieldset>
                </form>

                <div>
                    <ModalWindow
                        showModal={this.state.modalStateCert}
                        onClose={this.onCertModalClose}
                    >
                        <ModalWrapper
                            title="Birth Certificate"
                            src={this.state.certificationData.certUrl}
                            onUpload={this.certUpload}
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

export default CertificationPage;