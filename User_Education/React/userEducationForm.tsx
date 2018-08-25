import * as React from 'react';
import { Input, Button } from '../common/form';
import { SearchBar, ISchool } from './searchSuggestion';
import { FileUpload } from '../common/form/fileUpload';

export interface IUserEducationForm {
    id: number
    userBaseId: number,
    currentSemester: string,
    schoolName: string,
    gpa: number,
    reportCardFileUrl: string,
    completedUnits: number,
    enrollmentDate: string,
    expGradDate: string,
    major: string,
    plan: string,
    schoolIdNum: string,
    schoolIdPhotoFileUrl: string,
    createdById: number,
    modifiedById: number
}

interface IUserEducationFormProps {
    userEducation: IUserEducationForm,
    onChange: (fieldName: string, value: string) => void;
    onTypeAheadOnChange: (selected) => void;
    onClick: () => void;
    schoolList: ISchool[];
    onSearch: (query) => void,
    isLoading: boolean,
    onSchoolInputChange: (field: string) => void,
    onFileUploadReportCard: (url: string) => void,
    onFileUploadSchoolIdPhoto: (url: string) => void
    isFormValid: boolean,
    error: any
}

export const UserEducationForm = (props: IUserEducationFormProps) => (
    <React.Fragment>
        <div className="container">
            <form className="modal-content">
                <div className="modal-header">
                    <h2>Education Form</h2>
                    <button
                        type="button"
                        data-dismiss="modal"
                        aria-label="Close"
                        className="close"
                    >
                        x
                    </button>
                </div>
                <div className="modal-body">
                    <label>School</label>
                    <SearchBar
                        schoolList={props.schoolList}
                        onSearch={props.onSearch}
                        isLoading={props.isLoading}
                        onTypeAheadOnChange={props.onTypeAheadOnChange}
                        education={props.userEducation}
                        onSchoolInputChange={props.onSchoolInputChange}
                    />
                    <Input
                        type="text"
                        name="currentSemester"
                        label="Current Semester"
                        placeholder="Current Semester"
                        value={props.userEducation.currentSemester}
                        onChange={props.onChange}
                        error={props.error.currentSemester}
                    />
                    <Input
                        type="number"
                        name="gpa"
                        label="GPA"
                        placeholder="GPA"
                        value={props.userEducation.gpa}
                        onChange={props.onChange}
                        error={props.error.gpa}
                    />
                    <label>Report Card File Url</label>
                    <div className="row">
                        <FileUpload
                            onUploadComplete={props.onFileUploadReportCard}
                        />
                    </div>
                    <Input
                        type="number"
                        name="completedUnits"
                        label="Completed Units"
                        placeholder="Completed Units"
                        value={props.userEducation.completedUnits}
                        onChange={props.onChange}
                        error={props.error.completedUnits}
                    />
                    <Input
                        type="date"
                        name="enrollmentDate"
                        label="Enrollment Date"
                        placeholder="MM/DD/YYYY"
                        value={props.userEducation.enrollmentDate}
                        onChange={props.onChange}
                        error={props.error.enrollmentDate}
                    />
                    <Input
                        type="date"
                        name="expGradDate"
                        label="ExpGradudate Date"
                        placeholder="MM/DD/YYYY"
                        value={props.userEducation.expGradDate}
                        onChange={props.onChange}
                        error={props.error.expGradDate}
                    />
                    <Input
                        type="text"
                        name="major"
                        label="Major"
                        placeholder="Major"
                        value={props.userEducation.major}
                        onChange={props.onChange}
                        error={props.error.major}
                    />
                    <Input
                        type="text"
                        name="plan"
                        label="Plan"
                        placeholder="Plan"
                        value={props.userEducation.plan}
                        onChange={props.onChange}
                        error={props.error.plan}
                    />
                    <Input
                        type="text"
                        name="schoolIdNum"
                        label="School Id Num"
                        placeholder="School Id Num"
                        value={props.userEducation.schoolIdNum}
                        onChange={props.onChange}
                        error={props.error.schoolIdNum}
                    />
                    <label>School Id Photo File Url</label>
                    <div className="row">
                        <FileUpload
                            onUploadComplete={props.onFileUploadSchoolIdPhoto}
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-primary"
                            onClick={props.onClick}
                            data-dismiss="modal"
                            disabled={!props.isFormValid}
                        >Submit
                        </button>
                    </div>
                </div>
            </form>

        </div>
    </React.Fragment>
)