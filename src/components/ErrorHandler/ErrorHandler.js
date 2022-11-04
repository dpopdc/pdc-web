import React, { Fragment} from 'react';

import InfoBanner from '../InfoBanner/InfoBanner';

const errorHandler = props => {
  return (
    <Fragment>
      {props.error && (
        <InfoBanner design="error" title="Erro" message={props.error.message} onCloseBanner={props.onHandle} />
      )}
    </Fragment>
  )
};

export default errorHandler;
