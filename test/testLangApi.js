var lang = require('api').lang();

/*var listener = function() {
  console.log('current locale changed!');
};
lang.addListener(function(ret) {
  console.log('add Listener Event:', ret);
}, listener);*/

lang.getInitInfo(function(ret) {
  console.log('localeInfo:', ret);
}, "desktop");

/*lang.getLang(function(ret) {
  console.log('Lang:', ret);
}, '');*/

/*lang.getLangByName(function(ret) {
  console.log('ret:', ret);
}, "desktop");*/

/*lang.getLangList(function(ret) {
  console.log('LangList:', ret);
});*/

/*lang.setLocale(function(ret) {
  console.log('set locale: OK');
}, "en");*/

/*lang.getLocale(function(ret) {
  console.log('Locale:', ret);
});*/

/*var langString = {
  "name": "en",
  "path": "/home/qiushi/work/app/demo-rio/service/lang/implements/langs/en"
};
lang.addLang(function(ret) {
  console.log('add Lang: OK');
}, langString);*/

/*var langString = {
  "name": "en",
  "path": "/home/qiushi/.local/share/webde/langs/en"
};
lang.removeLang(function(ret) {
  console.log('remove Lang: OK');
}, langString);*/