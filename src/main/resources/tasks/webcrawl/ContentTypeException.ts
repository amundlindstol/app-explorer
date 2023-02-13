export default class ContentTypeException extends Error {
	constructor(url: string, message: string, options?: ErrorOptions) {
		// Need to pass `options` as the second parameter to install the "cause" property.
		super(`${url} ${message}`, options); // 'Error' breaks prototype chain here
		this.name = 'ContentTypeException';
		if (Object.setPrototypeOf) { // Runtime might not have it
			Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
		}
	}
}
