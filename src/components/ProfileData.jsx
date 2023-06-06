import React from "react";

export const ProfileData = ({graphData, dataverseData}) => {
    const {givenName, surname, userPrincipalName, id} = graphData || {};
    const {BusinessUnitId, OrganizationId, UserId} = dataverseData || {};
    return (
        <div>
            <h3>MS Graph Data</h3>
            <p><strong>First Name: </strong> {givenName}</p>
            <p><strong>Last Name: </strong> {surname}</p>
            <p><strong>Email: </strong> {userPrincipalName}</p>
            <p><strong>Id: </strong> {id}</p>
            <br />
            <h3>Dataverse Data</h3>
            <p><strong>Business Unit ID: </strong> {BusinessUnitId}</p>
            <p><strong>Organization ID: </strong> {OrganizationId}</p>
            <p><strong>User ID: </strong> {UserId}</p>
        </div>
    );
};