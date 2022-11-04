import React, { Fragment } from 'react';

import './Layout.css';

const layout = props => (
  <Fragment>
    <header className="main-header">{props.header}</header>
    {props.mobileNav}
    <main className="content">{props.main}</main>
  </Fragment>
);

export default layout;
