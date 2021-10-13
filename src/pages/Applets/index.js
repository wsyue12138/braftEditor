import React from 'react';

const Applets = (props) => {
	const { children } = props;
	return <div style={{width:'100%'}}>{children}</div>
}

export default Applets;