var lang = require('api').lang();

/*var listener = function() {
  console.log('current locale changed!');
};
lang.addListener(function(ret) {
  console.log('add Listener Event:', ret);
}, listener);*/

lang.getInitInfo(function(err, ret) {
  if (err) return console.log('getInitInfo error:', err);
  console.log('localeInfo:', ret);
}, "desktop");

/*lang.getLang(function(err, ret) {
  if (err) return console.log('getLang error:', err);
  console.log('Lang:', ret);
}, '');*/

/*lang.getLangByName(function(err, ret) {
  if (err) return console.log('getLangByName error:', err);
  console.log('ret:', ret);
}, "desktop");*/

/*lang.getLangList(function(err, ret) {
  if (err) return console.log('getLangList error:', err);
  console.log('LangList:', ret);
});*/

/*lang.setLocale(function(err, ret) {
  if (err) return console.log('setLocale error:', err);
  console.log('set locale: success!');
}, "en");*/

/*lang.getCurLocale(function(err, ret) {
  if (err) return console.log('getCurLocale error:', err);
  console.log('CurLocale:', ret);
});*/

/*var langString = {
  "name": "en",
  "path": "/home/qiushi/work/app/demo-rio/service/lang/implements/langs/en"
};
lang.addLang(function(err, ret) {
  if (err) return console.log('addLang error:', err);
  console.log('add Lang: success!');
}, langString);*/

/*var langString = {
  "name": "en",
  "path": "/home/qiushi/.local/share/webde/langs/en"
};
lang.removeLang(function(err, ret) {
  if (err) return console.log('removeLang error:', err);
  console.log('remove Lang: success!');
}, langString);*/