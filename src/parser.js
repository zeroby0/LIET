class parser {
	constructor(){

	}

	parse(data){
		console.log('Parser: instructon - ',data);
		let instructon = JSON.parse(data);
		console.log(instructon);
	}

}

module.exports = parser;