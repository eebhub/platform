module.exports = {
    getIndex: function(request, response){
        response.render('index');    
    },
    getLite: function(request, response){
        response.render('lite');    
    },
    getLiteResults: function(request, response){
        response.render('literesults');    
    },
};
