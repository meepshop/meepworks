
var casper = require('casper').create();

casper.start('http://localhost:13301', function (){
	this.echo(this.getTitle());
});

casper.then(function (){
	this.echo('CasperJS');
	this.exit();
});


casper.run();