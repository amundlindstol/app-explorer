import {
	forceArray//,
	//toStr
} from '@enonic/js-utils';

import {
	PRINCIPAL_EXPLORER_READ,
	PRINCIPAL_EXPLORER_WRITE,
	RT_JSON
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {createOrModify} from '/lib/explorer/node/createOrModify';
import {get as getNode} from '/lib/explorer/node/get';


export function get() {
	const node = getNode({
		connection: connect({
			principals: [PRINCIPAL_EXPLORER_READ]
		}),
		path: '/notifications'
	}) || {};
	//log.info(toStr({node}));

	const {emails = []} = node;
	//log.info(toStr({emails}));

	return {
		contentType: RT_JSON,
		body: {
			emails: forceArray(emails)
		}
	};
} // get


export function post({
	params: {
		json// = JSON.stringify({emails: []})
	} = {}
}) {
	//if (!json) { missing required param}
	//log.info(`json:${toStr(json)}`);

	try {
		const obj = JSON.parse(json);
		//log.info(`obj:${toStr(obj)}`);

		const {emails = []} = obj;
		//log.info(`emails:${toStr(emails)}`);

		createOrModify({
			emails,
			_name: 'notifications'
		}, {
			connection: connect({
				principals: [PRINCIPAL_EXPLORER_WRITE]
			})
		});

		return {
			contentType: RT_JSON,
			status: 200
		};
	} catch (e) {
		return {
			contentType: RT_JSON,
			status: 500
		};
	} // try ... catch
} // post
