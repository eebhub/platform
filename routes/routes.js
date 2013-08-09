

module.exports = {
    getHome: function(request, response){
        response.render('home');    
    },
    getLite: function(request, response){
        response.render('lite');    
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
        response.render('comprehensive');
    },
  
};
