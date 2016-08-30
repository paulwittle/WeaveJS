module.exports = function()
{
	const async = require("async");
	const fs = require("fs");
	const path = require("path");
	const version = "2.1.3";
	const Concat = require('concat-with-sourcemaps');

	let globalOutput:string[];
	let moduleOutput:string[];
	globalOutput = [
		'WeaveASJS/bin/js-release/WeaveJS.js',
		'WeaveASJS/src/initWeaveJS.js',
		'WeaveTSJS/bin/js/weavejs.js'
	];
	moduleOutput = ['scripts/umd-prefix.txt', 'WeaveTSJS/bin/js/libs.js'].concat(globalOutput).concat(['scripts/umd-suffix.txt']);

	function build(filesToConcat:string[], outputPath:string, moduleName:string)
	{
		var concat = new Concat(true, moduleName, '\n');
		for (var filename of filesToConcat)
		{
			var sourceMapContent:string = null;
			var content:string;

			try
			{
				sourceMapContent = fs.readFileSync(filename+".map", {encoding: "utf-8"});
			}
			catch (e)
			{
				console.log("No sourcemap found for", filename, ", skipping.");
				sourceMapContent = null;
			}

			content = fs.readFileSync(filename);

			concat.add(filename, content, sourceMapContent);
		}

		fs.writeFileSync(path.join(outputPath, moduleName), concat.content);
		fs.writeFileSync(path.join(outputPath, moduleName + ".map"), concat.sourceMap);
	}
	build(globalOutput, 'lib/', 'weavejs-global.js');
	build(moduleOutput, 'lib/', 'weavejs.js');
}