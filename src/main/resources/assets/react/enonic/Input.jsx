import getIn from 'get-value';
import {
	Icon,
	Input as SemanticUiReactInput,
	Message
} from 'semantic-ui-react';

import {getEnonicContext} from './Context';
import {
	setValue,
	setVisited,
	validateField
} from './Form';


export function Input(props = {}) {
	//console.debug('Input props', props);
	const [context, dispatch] = getEnonicContext();
	//console.debug('Input context', context);
	const {
		path,
		validateOnBlur = true,
		validateOnChange = true,
		value = getIn(context.values, path),
		...rest
	} = props;


	//const changed = getIn(context.changes, path);
	const error = getIn(context.errors, path);
	const visited = getIn(context.visits, path);
	//console.debug('Input value', value);

	return <>
		<SemanticUiReactInput
			autoComplete='off'
			{...rest}
			error={!!error}
			name={path}
			onBlur={() => {
				dispatch(setVisited({path}));
				validateOnBlur && dispatch(validateField({path, value}));
			}}
			onChange={(event, {value: newValue}) => {
				dispatch(setValue({path, value: newValue}));
				dispatch(setVisited({path}));
				validateOnChange && dispatch(validateField({path, value: newValue}));
			}}
			value={value}
		/>
		{visited && error && <Message icon negative>
			<Icon name='warning'/>
			<Message.Content>
				<Message.Header>{path}</Message.Header>
				{error}
			</Message.Content>
		</Message>}
	</>;
} // Input
