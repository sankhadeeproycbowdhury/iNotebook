import React from "react";

const Alert = (props) => {
  return (
    <>
      {props.alert && (
        <div
          className={`alert alert-${props.alert.type} alert-dismissible fade show`}
          role="alert" style={{ height: "50px" }}
        >
          {props.alert.message}
        </div>
      )}
    </>
  );
};

export default Alert;
