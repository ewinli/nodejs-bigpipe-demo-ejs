var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var getData = {
    headerCount:0,
    header:function (fn){
         setTimeout(fn, 500,null,{content:"Hello header "+(this.headerCount++) });
    },
    contentCount:0,
    content:function(fn){
       setTimeout(fn, 3500,null,{content:"Hello content "+(this.contentCount++)});
    },
    footerCount:0,
    footer:function(fn){
       setTimeout(fn, 2000,null,{content:"Hello footer "+(this.footerCount++)});
    }

};

function compileTemplate(){
	var args= Array.prototype.slice.call(arguments,0);
	var param= [__dirname,'..','views'].concat(args);
    var file=fs.readFileSync(path.join.apply(this,param)).toString('utf-8');
	return ejs.compile(file);
}


var tmpl = {
    header : compileTemplate('module','header.ejs'),
    content : compileTemplate('module','content.ejs'),
    footer : compileTemplate('module','footer.ejs')
};

var responseHtml=function(renderFunction){
        
    getData.header(function(err,headerData){
         renderFunction("header",tmpl.header(headerData));
    });
    getData.content(function(err,contentData){
         renderFunction("content",tmpl.content(contentData));
    });
    getData.footer(function(err,footerData){
         renderFunction("footer",tmpl.footer(footerData));
    });
};

/* GET home page. */
router.get('/', function(req, res) {

  var n=3;
   var renderObj={};
   function renderHtml(id,html){
       renderObj[id]=html;
       if(!(--n)){
         res.render('index',renderObj);
       }
   }
   responseHtml(renderHtml);

});

/* GET home page. */
router.get('/bigpipe', function(req, res) {

   res.render('bigpipe',function(err,str){
       if(err){
         return res.req.next(err);
       }
       res.write(str);
   });

   var n=3;
   function renderHtml(id,html){
       res.write('<script>$(\'#'+id+'\').html('+JSON.stringify(html)+')</script>');
       if(!(--n)){
         res.write('</body></html>');
         res.end();
       }
   }
   responseHtml(renderHtml);

});
router.get('/ajax_bigpipe', function(req, res) {

   res.render('ajax_bigpipe');

});
router.get('/ajax_test', function(req, res) {
   var n=3;
   res.setHeader('content-type','application/json');
    function renderHtml(id,html){

       res.write(JSON.stringify({id:id,html:html})+",");

       if((!--n)){
           res.end();
       }
    }

    responseHtml(renderHtml);

});
module.exports = router;
