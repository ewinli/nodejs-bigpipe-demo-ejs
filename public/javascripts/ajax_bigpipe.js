(function(golbal){

 function bigpipeGet(url,process,success){
  
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
   
    var startIndex=0;

    var data=[];

    request.onreadystatechange=function(){

        if(request.readyState==3){
        	if(request.responseText&&request.responseText.length>0){
        		  var responseText=request.responseText;
                  var chuck=responseText.substr(startIndex);
                  chuck= chuck.substr(0,chuck.length-1);
                  data.push("["+chuck+"]");
        		  process("["+chuck+"]");
        		  startIndex=responseText.length;
        	}
        }
        else if(request.readyState==4){
            success(data);
        }

   };

   request.send(); 
 }

 function main(){
 	function process(chuck){
        console.log(chuck);
       var obj=JSON.parse(chuck);
       for(var t in obj){
          $('#'+obj[t].id).html(obj[t].html);
       }
 	}
 	function success(data){
        
 	}
  $(document).on('ready',function(){
    bigpipeGet("ajax_test",process,success);
  });
  
 }
 main();

})(window);