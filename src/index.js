import { getOptions} from 'loader-utils';
import { Swig } from 'swig';
import * as path from 'path';
import fs from 'fs';
import yaml from 'js-yaml'

export default function mySwigLoader(swigTemplateSourceString) {
    const options = getOptions(this) || {};

    addParamsFromLangFile(this, options);

    return processTemplate(this, swigTemplateSourceString, options);

}

function addParamsFromLangFile(plugin, options){
    if(options.lang){
        const filePath = options.includeFile ? options.includeFile : plugin.resourcePath;
        const dirname = path.dirname(filePath);
        const ymlFile = path.join(dirname, path.basename(filePath, '.html')) + '.' + options.lang + '.yml';
        if(fs.existsSync(ymlFile)){
            plugin.addDependency(ymlFile);
            Object.assign(options, yaml.safeLoad(fs.readFileSync(ymlFile, 'utf8')))
        }
    }
}

function processTemplate(plugin, swigTemplateSourceString, options){
    const swig = new Swig(options);
    monkeyPatchSwigToAddDependency(swig, plugin);
    const result = swig.render(swigTemplateSourceString,{
        locals: options,
        filename: plugin.resourcePath
    });

    if(options.raw){
        return result;
    }else {
        const json = JSON.stringify(result);
        return `export default ${json}`;
    }
}

function monkeyPatchSwigToAddDependency(swig, plugin){
    const loader = swig.options.loader,
        _load = loader.load;
    loader.load = function (filepath) {
        plugin.addDependency(filepath);
        return _load.apply(loader, arguments)
    };
}