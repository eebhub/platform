<?php

//START SESSION
session_start();

// basic building and user's info
$user = rand(1,999999);
$email = "EMPTY";
$buildingName = $_SESSION[building_name] = $_POST[building_name];
$city = $_SESSION[weather_epw_location] = $_POST[weather_epw_location];
$tightness = $_POST['tightness'];

//unit conversion-1
$unit = $_SESSION[unit]=$_POST[unit];
$gross_floor_area = $_POST[gross_floor_area];
if ($unit == 'ip'){$gross_floor_area_f = floatval($gross_floor_area)*0.09; $gross_floor_area = strval($gross_floor_area_f);}


$primary_spacetype = $_SESSION[activity_type] = $_POST[activity_type];
// secondary space type is based on primary space type
switch($primary_spacetype) {
    case "SmallOffice":
    case "MediumOffice":
    case "LargeOffice":
        $_POST[activity_type_specific] = 'WholeBuilding'; 
        break;
    case "Warehouse":
        $_POST[activity_type_specific] = 'Office'; 
        break;
    case "Retail":
        $_POST[activity_type_specific] = 'Core'; 
        break;
}
$secondary_spacetype = $_SESSION[activity_type_specific] = $_POST[activity_type_specific];

// material and area    
$floors = $_SESSION[number_of_floors] = $_POST[number_of_floors];
$floorArea = $_SESSION[gross_floor_area] = $gross_floor_area;   // not use yet, area is re-define from the geometric below
$roofMaterial = $_SESSION[roof_type] = $_POST[roof_type];                 
$wallMaterial = $_SESSION[exterior_wall_type] = $_POST[exterior_wall_type];
$windowPercent = $_SESSION[window_to_wall_ratio] = $_POST[window_to_wall_ratio] / 100;
$shape = $_SESSION[footprint_shape] = $_POST[footprint_shape];

$server_number = rand(0, 99);

//RUN OPENSTUDIO
$rubyCmdCreateIDF = "xvfb-run -n $server_number ruby run_eebhub.rb ".
            				$user.' '.					
							$email.' '.					
							'"'.$buildingName.'" '.	        			
							$city.' '.					
							$tightness.' '. 
                            $primary_spacetype.' '.
                            $secondary_spacetype.' '.
                            $floors.' '.
                            $floorArea.' "'.
                            $roofMaterial.'" "'. 
                            $wallMaterial.'" '.
                            $windowPercent.' '.
                            $shape;					
           
// geometric info      
// unit conversion-2           
switch($shape) {
    case "Rectangle": 
		$length = $_POST['length'];
		$width = $_POST['width'];
		if ($unit == 'ip') {$length_f = floatval($length)*0.3; $length = strval($length_f);
							$width_f = floatval($width)*0.3; $width = strval($width_f);}
        $rubyCmdCreateIDF = $rubyCmdCreateIDF.' '.
            				$length.' '.					
							$width;
        break;
        
    case "H": 
		$length = $_POST['length'];
		$left_width = $_POST['left_width'];
		$center_width = $_POST['center_width'];
		$right_width = $_POST['right_width'];
		$left_end_length = $_POST['left_end_length'];
		$right_end_length = $_POST['right_end_length'];
		$left_upper_end_offset = $_POST['left_upper_end_offset'];
		$right_upper_end_offset = $_POST['right_upper_end_offset'];
		if ($unit == 'ip') {$length_f = floatval($length)*0.3; $length = strval($length_f);
							$left_width_f = floatval($left_width)*0.3; $left_width = strval($left_width_f);
							$center_width_f = floatval($center_width)*0.3; $center_width = strval($center_width_f);
							$right_width_f = floatval($right_width)*0.3; $right_width = strval($right_width_f);
							$left_end_length_f = floatval($left_end_length)*0.3; $left_end_length = strval($left_end_length_f);
							$right_end_length_f = floatval($right_end_length)*0.3; $right_end_length = strval($right_end_length_f);
							$left_upper_end_offset_f = floatval($left_upper_end_offset)*0.3; $left_upper_end_offset = strval($left_upper_end_offset_f);
							$right_upper_end_offset_f = floatval($right_upper_end_offset)*0.3; $right_upper_end_offset = strval($right_upper_end_offset_f);
							}
        $rubyCmdCreateIDF = $rubyCmdCreateIDF.' '.
            				$length.' '.					
							$left_width.' '.
							$center_width.' '.					
							$right_width.' '.
							$left_end_length.' '.					
							$right_end_length.' '.
							$left_upper_end_offset.' '.					
							$right_upper_end_offset;
        break;
        
    case "L":  
		$length = $_POST['length'];
		$width = $_POST['width'];
		$end_1 = $_POST['end_1'];
		$end_2 = $_POST['end_2'];
		if ($unit == 'ip') {$length_f = floatval($length)*0.3; $length = strval($length_f);
							$width_f = floatval($width)*0.3; $width = strval($width_f);
							$end_1_f = floatval($end_1)*0.3; $end_1 = strval($end_1_f);
							$end_2_f = floatval($end_2)*0.3; $end_2 = strval($end_2_f);
							}
        $rubyCmdCreateIDF = $rubyCmdCreateIDF.' '.
            				$length.' '.					
							$width.' '.
							$end_1.' '.					
							$end_2;
        break;
        
    case "T": 
		$length = $_POST['length'];
		$width = $_POST['width'];
		$end_1 = $_POST['end_1'];
		$end_2 = $_POST['end_2'];
		$offset = $_POST['offset'];
		if ($unit == 'ip') {$length_f = floatval($length)*0.3; $length = strval($length_f);
						$width_f = floatval($width)*0.3; $width = strval($width_f);
						$end_1_f = floatval($end_1)*0.3; $end_1 = strval($end_1_f);
						$end_2_f = floatval($end_2)*0.3; $end_2 = strval($end_2_f);
						$offset_f = floatval($offset)*0.3; $offset = strval($offset_f);
						}
        $rubyCmdCreateIDF = $rubyCmdCreateIDF.' '.
            				$length.' '.					
							$width.' '.
							$end_1.' '.					
							$end_2.' '.
							$offset;
        break;
        
    case "U": 
		$length = $_POST['length'];
		$width_1 = $_POST['width_1'];
		$width_2 = $_POST['width_2'];
		$end_1 = $_POST['end_1'];
		$end_2 = $_POST['end_2'];
		$offset = $_POST['offset'];
		if ($unit == 'ip') {$length_f = floatval($length)*0.3; $length = strval($length_f);
					$width_1_f = floatval($width_1)*0.3; $width_1 = strval($width__1_f);
					$width_2_f = floatval($width_2)*0.3; $width_2 = strval($width__2_f);
					$end_1_f = floatval($end_1)*0.3; $end_1 = strval($end_1_f);
					$end_2_f = floatval($end_2)*0.3; $end_2 = strval($end_2_f);
					$offset_f = floatval($offset)*0.3; $offset = strval($offset_f);
					}
        $rubyCmdCreateIDF = $rubyCmdCreateIDF.' '.
            				$length.' '.					
							$width_1.' '.					
							$width_2.' '.
							$end_1.' '.
							$end_2.' '.
							$offset;
        break;
        
    case "Pie":
		$radius_a = $_POST['radius_a'];
		$radius_b = $_POST['radius_b'];
		if ($unit == 'ip') {$radius_a_f = floatval($radius_a)*0.3; $radius_a = strval($radius_a_f);
							$radius_b_f = floatval($radius_b)*0.3; $radius_b = strval($radius_b_f);}
        $rubyCmdCreateIDF = $rubyCmdCreateIDF.' '.
            				$radius_a.' '.					
							$radius_b.' '.
							$_POST['num_points'].' '.					
							$_POST['degree'];
        break;
    
}
                           
                           
//echo $rubyCmdCreateIDF;                    
//echo $tightness;
$run = shell_exec($rubyCmdCreateIDF);
//echo $run;

// baseline modelname
$_SESSION['cur_model'] = "Simulation_$user.idf";
$_SESSION['eem1_model'] = "EEM1_Simulation_$user.idf";
$_SESSION['eem2_model'] = "EEM2_EEM1_Simulation_$user.idf";
$_SESSION['eem3_model'] = "EEM3_EEM2_EEM1_Simulation_$user.idf";


// create EEM in run 2
//$run2 = shell_exec("xvfb-run -n $server_number ruby run_eem.rb ".$_SESSION['cur_model']);
//echo $run2;


header("location: http://128.118.67.241/tools.eebhub.org");
?>
