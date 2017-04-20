class parser {
	constructor(){

	}

	parse(data){
		console.log('Parser: instructon - ',data);
		const hash = data.substr(data.length - 6);
		const json = data.substring(0, data.length - 6);
		const instructon = JSON.parse(json);
		console.log('hash: ', hash);
		console.log('instructon: ', instructon);
	}

}

module.exports = parser;