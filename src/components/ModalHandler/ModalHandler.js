import React, { Fragment} from 'react';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

const modalHandler = props => {
  return (
    <Fragment>
      {props.showModal && (
        <ConfirmationModal onDelete={props.onDelete} onCancel={props.onCancel} toDelete={props.toDelete} />
      )}
    </Fragment>
  )
};

export default modalHandler;
