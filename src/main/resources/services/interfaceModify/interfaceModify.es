//import {toStr} from '@enonic/js-utils';

import {sanitize} from '/lib/xp/common';

import {
	PRINCIPAL_EXPLORER_WRITE,
	RT_JSON
} from '/lib/explorer/model/2/constants';
import {modify} from '/lib/explorer/node/modify';
import {connect} from '/lib/explorer/repo/connect';
import {interfaceModel} from '/lib/explorer/model/2/nodeTypes/interface';
import {jsonError} from '/lib/explorer/jsonError';
import {mapResultMappings} from '../graphQL/interface';


export function post({
	body: json,
	params: {
		id
	}
}) {
	if (!id) {
		return jsonError('Missing required parameter id!');
	}
	if (!json) {
		return jsonError('Empty body!');
	}
	const obj = JSON.parse(json);
	//log.info(`obj:${toStr(obj)}`);

	const writeConnection = connect({
		principals: [PRINCIPAL_EXPLORER_WRITE]
	});

	const origNode = writeConnection.get(id);
	if (!origNode) {
		throw new Error(`Could not get original interface node to modify! id:${id}`);
	}

	obj._name = sanitize(obj.displayName);

	if (obj._name !== origNode._name) { // _name changed
		const moveParams = {
			source: origNode._path,
			target: obj._name
		};
		//log.info(`moveParams:${toStr({moveParams})}`);
		const boolMoved = writeConnection.move(moveParams);
		if (!boolMoved) {
			throw new Error(`Unable to rename interface from ${origNode._name} to ${obj._name}!`);
		}
	}

	obj.resultMappings = mapResultMappings(obj.resultMappings);

	const node = modify(interfaceModel(obj), {
		connection: writeConnection
	});
	const body = {};
	let status = 200;
	if (node) {
		body.message = `Interface ${obj._name} updated.`;
	} else {
		body.error = `Something went wrong when trying to update interface ${obj._name}!`;
	}
	return {
		body,
		contentType: RT_JSON,
		status
	};
} // post
