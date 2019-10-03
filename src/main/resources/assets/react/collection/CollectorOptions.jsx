import {Header, Segment} from 'semantic-ui-react';
import getIn from 'get-value';

import {getEnonicContext} from 'semantic-ui-react-form/Context';


export function CollectorOptions(props) {
	//console.debug('CollectorOptions props', props);
	const {
		collectorsObj,
		contentTypeOptions,
		fields,
		siteOptions
	} = props;

	const [context, dispatch] = getEnonicContext();
	//console.debug('CollectorOptions context', context);
	const collectorName = getIn(context.values, 'collector.name');

	const isFirstRun = React.useRef(true);

	if (!collectorName) { return null; }

	if (!collectorsObj[collectorName]) { return <p>Collector {collectorName} NOT found!</p>; }

	return <Segment color='pink'>
		<Header as='h2' dividing content={collectorName} id='collector'/>
		{collectorsObj[collectorName]({
			context,
			dispatch,
			explorer: {
				contentTypeOptions,
				fields,
				siteOptions
			},
			isFirstRun
		})}
	</Segment>;
} // function CollectorOptions
