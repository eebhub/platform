

module.exports = {
    getHome: function(request, response){
        response.render('platform/home');    
    },
    getLite: function(request, response){
        response.render('platform/lite');    
    },
    getLiteResults: function(request, response){
        response.render('platform/literesults');    
    },
    getPartial: function(request, response){
        response.render('platform/partial');    
    },
    
    getSubstantial: function(request, response) {
        response.render('platform/substantial');
    },
    
    getComprehensive: function(request, response) {
        response.render('platform/comprehensive');
    },
    
    
};
