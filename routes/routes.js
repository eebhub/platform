var shell = require('shelljs');

module.exports = {
    getHome: function(request, response){
        response.sendfile('./views/home.html');    
    },
    getSignUp: function(request, response){
        response.sendfile('./views/signup.html');  
    },
    getLogIn: function(request, response){
        response.sendfile('./views/login.html');  
    },
    getLite: function(request, response){
        response.render('lite');    
    },
    getLiteConv: function(request, response){
        response.sendfile('./views/liteconversion.html');    
    },
    getLiteResults: function(request, response){
        response.render('literesults');    
    },
    getPartial: function(request, response){
        response.render('partial');    
    },
    
    getSubstantial: function(request, response) {
        response.render('substantial');
    },
    
    getComprehensive: function(request, response) {

        response.sendfile('./views/comprehensive.html');

    },
       

    
};
