module.exports.convertUnit = convertUnit;

function convertUnit(){
            var inputunitid = document.getElementById('input_unit_id');
            var unitid = inputunitid.options[inputunitid.selectedIndex].value;
            
            if(unitid == 'ip'){
                $(".unit").html("ft");
            }else{
                $(".unit").html("m");   
            }
            
}