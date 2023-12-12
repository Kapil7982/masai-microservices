import React from "react";

function Dropdown(props: {
	children:
		| string
		| number
		| boolean
		| React.ReactElement<any, string | React.JSXElementConstructor<any>>
		| Iterable<React.ReactNode>
		| React.ReactPortal
		| null
		| undefined;
}): JSX.Element {
	return <div className="dropdown">{props.children}</div>;
}

export default Dropdown;
