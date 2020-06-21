const fs = require('fs');
const Handlebars = require("handlebars");
const Generator = require('lb.generator.handlebars');

// You can load any JSON file to use as a model
const globalModel = require("./my-first-project-templates/global-model.json");

// Handlebars.registerHelper('global', function(block) {
    // return displayLastnames; //just return global variable value
// });

// By default, the templates will be generated with the following default global static values:
// Generator.TemplateSettings.DefaultTarget = "Model";
// Generator.TemplateSettings.DefaultTargetItem = "item";
// Generator.TemplateSettings.DefaultTargetProperty = "target";
// Generator.TemplateSettings.DefaultModelProperty = "model";
// Generator.TemplateSettings.DefaultTargetItemNameProperty = "Name";

// The TemplateSettings.Target value will be loaded from the template settings file (".hbs.settings.json")
//   If the value is not included in the template settings, the TemplateSettings.DefaultTarget is used.  

// The exported file path is prepared for each file during the generation process.
//   The following code displays the default implementation but can be overriden by replacing the static function.
/*
Template.prepareExportPath = function(settings, fileName, model) {
    const itemModelProperty = settings.targetItem || 'item';
    const targetItemNameProperty = settings.targetItemNameProperty || 'Name';
    const nameReplacement = `{${itemModelProperty}.${targetItemNameProperty}}`;

    var exportPath = settings.exportPath;

    if (settings.prepareExportPathUsingReplace) {
        if (fileName && !Helpers.isEmpty(fileName))
            exportPath = exportPath.replace("{FileName}", fileName);

        if (model && model[targetItemNameProperty] && !Helpers.isEmpty(model[targetItemNameProperty]))
            exportPath = exportPath.replace(nameReplacement, model[targetItemNameProperty]);
    }

    if (settings.prepareExportPathUsingTemplate) {
        if (!model || model === null)
            model = {};

        var exportPathTemplate = Handlebars.compile(exportPath);

        if (fileName && !Helpers.isEmpty(fileName))
            model.FileName = fileName;
        
        exportPath = exportPathTemplate(model);
    }

    return exportPath;
}
*/

// Create a Template Loader and pass it the directory containing the templates.
// The loader will automatically load all template files ending in ".hbs" and their corresponding settings ".hbs.settings.json"
var loader = new Generator.TemplateLoader('./my-first-project-templates');

// Load the templates with a callback containing the list of loaded templates
loader.load(function (templates) {
    
    // Integrate the templates and generate each with the supplied model
    for (const template of templates) {
        console.log(`Generating template: ${template.name}`)

		// get default template model
        let defaultModelPath = template._templatePath + '.model.json';
        
        fs.access(defaultModelPath, fs.F_OK, (err) => {
            let model = JSON.parse(JSON.stringify(globalModel));
            let templateModel;

            if (!err) {
                templateModel = require(defaultModelPath);
            }

            if (templateModel){
                model['$'] = templateModel;
            }            

            //console.log(model);

            // Generate the template
            template.generate(model);
            
            // Write the generated template to file
            template.write();
          });
    }
});
