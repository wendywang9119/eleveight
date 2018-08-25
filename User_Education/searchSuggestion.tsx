import * as React from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { IUserEducationForm } from './userEducationForm';

export interface ISchool {
    id: number,
    schoolName: string,
    studentSize: string,
}

interface ISearchBarProps {
    onTypeAheadOnChange: (selected) => void,
    schoolList: ISchool[],
    onSearch: (query: string) => void,
    isLoading: boolean,
    education: IUserEducationForm,
    onSchoolInputChange: (field: string) => void
}

export const SearchBar = (props: ISearchBarProps) => {
    return (
        <React.Fragment>
            <AsyncTypeahead
                options={props.schoolList}
                labelKey="schoolName"
                onSearch={props.onSearch}
                isLoading={props.isLoading}
                useCache={true}
                onChange={props.onTypeAheadOnChange}
                onInputChange={props.onSchoolInputChange}
                placeholder="Ex: Irvine Valley College"
                selected={props.education.schoolName !== '' ? [props.education.schoolName] : []}  // check if there is a schoolName
            />
        </React.Fragment>

    )
}