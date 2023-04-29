import React from "react";

const TemplateInfo = ({ details }) => {
  return (
    <div>
      <h2 className="font-bold">
        You have received an email, check your mailbox.
      </h2>
      <div>Template name: {details.name}</div>
      <div>owner: {details.owner.userName}</div>
      <div>folder name: {details.folderName}</div>
      <div>attached document: {details.documents[0].name}</div>
    </div>
  );
};

export default TemplateInfo;
