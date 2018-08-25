import * as React from 'react';
import { Button, Input } from '../common/form';

export interface IUser {
	userBaseId: number
	firstName: string
	lastName: string
	email: string
	isEmailConfirmed: boolean
	roleName: string
	isAccountLocked: boolean
	orgName: string
	paymentFail: boolean
}

interface IUsersProps {
    users: IUser[];
    searchText: string;
    onClick: (id, isLocked) => void;
    onChange: (fieldName: string, value: string) => void;
}

export const ListAllUsers = (props: IUsersProps) => {
	const userRow = (user, index) => {
		return (
			<tr key={user.userBaseId}>
				<td>{user.orgName}</td>
				<td>{user.firstName}</td>
				<td>{user.lastName}</td>
				<td>{user.email}</td>
				<td>{user.isEmailConfirmed ? "Yes" : "No"}</td>
				<td>{user.roleName}</td>
				<td><button
					className="btn btn-primary waves-effect"
					onClick={() => props.onClick(user.userBaseId, user.isAccountLocked)}
				>{user.isAccountLocked ? <i className="fas fa-lock"></i>
					: <i className="fas fa-lock-open"></i>
					}</button>{user.paymentFail == false ? "" : "Payment Failed"}
				</td>
			</tr>
		)
	}

    const buildRows = (user, index) => {
        if (props.searchText) {
            if (user.firstName.toLowerCase().includes(props.searchText)
                || user.lastName.toLowerCase().includes(props.searchText)
                || user.email.toLowerCase().includes(props.searchText)
                || user.roleName.toLowerCase().includes(props.searchText)
            ) {
                return userRow(user, index);
            }
        } else {
            return userRow(user, index);
        }
    }

	return (
		<React.Fragment>
			<div className="row">
				<div className="col-sm-12 col-md-6">
				</div>
				<div className="col-md-2 offset-md-4" style={{ paddingRight: "20px" }}>
					<Input
						type="search"
						label=''
						name="searchText"
						placeholder="Please search"
						value={props.searchText}
						onChange={props.onChange}
						className="form-control form-control-sm"
					/>
				</div>
			</div>

			<table className="table table-striped table-bordered dataTable no-footer" role="grid">
				<tbody>
					<tr>
						<th>Organization Name</th>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Email</th>
						<th>Email Confirmed</th>
						<th>Role Name</th>
						<th>Account Locked</th>
					</tr>
				</tbody>
				<tbody>
					{props.users.map(buildRows)}
				</tbody>
			</table>

		</React.Fragment>
	);
}