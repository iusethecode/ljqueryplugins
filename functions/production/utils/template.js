/**
* Replaces Variables in a Template String
**/
function(template, scope) {
    return template.replace(/\{\{(\w*)\}\}/g, function (m, key) { return scope[key]; })
}