var shell = require('shelljs');

module.exports = {
    getHome: function(request, response){
        //response.sendfile('./views/home.html');    
        response.render('home',{
            'username': request.session.username
        });
    },
    getTeam: function(request, response){
        response.render('team');  
    },
    getSignUp: function(request, response){
        response.sendfile('./views/signup.html');  
    },
    getLogIn: function(request, response){
        response.sendfile('./views/login.html');  
    },
    getLite: function(request, response){
        response.sendfile('./views/lite.html');    
    },
    getLiteConv: function(request, response){
        response.sendfile('./views/liteconversion.html');    
    },
    getLiteResults: function(request, response){
        response.sendfile('./views/literesults.html');    
    },
    getPartial: function(request, response){
        response.sendfile('./views/partial.html');    
    },
    
    getSubstantial: function(request, response) {
        response.sendfile('./views/substantial.html');
    },
    
    getComprehensive: function(request, response) {
        response.sendfile('./views/comprehensive.html');
    },
    getNews: function(request, response){
        response.sendfile('./views/news.html');  
    }, 
    getVisits: function(request, response){
        response.sendfile('./views/visitors.html');  
    }, 
    getPresentation: function(request, response){
        response.sendfile('./views/presentation.html');  
    }, 
    getCaseStudies: function(request, response){
        response.sendfile('./views/casestudy.html');
    },
    getEngines: function(request, response){
        response.sendfile('./views/engine.html');
    }
    
};