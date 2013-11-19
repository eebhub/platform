<?php

session_start();

// initialize the game variables
if($_SESSION['current_yr'] == '') {
    $_SESSION['current_yr'] = 0;
    $_SESSION['installationCost'][0] = 0;
    $_SESSION['newCost'][0] = 0;
    $_SESSION['availableCap'][0] = 0;  
    $_SESSION['availableCap'][1] = 50000;
    $_SESSION['availableCap2'][1] = 50000;
    $_SESSION['remainingCap'][0] = 0;
    $_SESSION['cumulatedSaving'][0] = 0;  
    $_SESSION['3PercentInterestRate'][0] = 0;
    $_SESSION['remainingCapPlusCumulatedSaving'][0] = 0;
    $_SESSION['percentageSaving'][0]=0;
}

// create a user folder that is based on the client ip address and the timestamp
if($_SESSION['user_dir'] == '') {
  // the name of the user dir
  $user_dir = $_SESSION['user_dir'] = md5($_SERVER['REMOTE_ADDR'].time());
  mkdir("EEMs/$user_dir", 0775);
}

$current_yr = &$_SESSION['current_yr'];
$eem_version = &$_SESSION['eem_cnt'];

/*
 *  the function resets the finishedMeasures from the current year to the restarted year
 *  the function has side effect to the sessions variable such that
 *      current_yr is set to restart_yr, both yrs are greater than 0
 *      im is the installedMeasures list that will be reset
 *      fm is the finishedMeasures list that will be reset
 *      eem_cnt is the counter for the file of eem version, will be set to current_yr
 */
function resetMeasureYear($restart_yr, &$current_yr, &$im, &$fm) {

   $im = &$_SESSION['installed_measures'];   // installed measures list in each year (the index is int) 
   $fm = &$_SESSION['measureFinished'];      // finished measures list shows the available of measures

   if($restart_yr < 0 || $current_yr < 0) {
      echo "cant reset the year < 0";
      return 1;
   } else {
      // undo finishedMeasures from the fm list, so user can re-select the finishedMeasures 
      for($y = $current_yr-1;  $y > $restart_yr-1; $y--) {
         foreach($im[$y] as &$m) {
            $fm[$m] ='';
         }
  
         // remove eem model from the session model
         unset($_SESSION['Model'][$y+1]);		 
		 
         // delete eem_#.idf file-dir		 
		 removeEEM($y+1);
		 $yy = $y+1;
		 `rm EEMs/{$_SESSION['user_dir']}/eem_{$yy}.idf`;
      }
      
      // reset the current year to restart_yr
      $current_yr = $restart_yr; 
      $_SESSION['eem_cnt'] = $current_yr;
	  $_SESSION['cur_model'] = $_SESSION['Model'][$current_yr];
   }
}

function removeEEM($eem_version) {
   $dir = "./ENERGYPLUS/EEMs/{$_SESSION['user_dir']}/eem_{$eem_version}.idf";
   echo `rm -r $dir`;
}

// Do resetMeasureYear
if(isset($_POST['reset'])) resetMeasureYear($_POST['reset'], $current_yr, $_SESSION['installed_measures'], $_SESSION['measureFinished']);

function selectedList($current_yr, $year, $finieshedMeasure, $measures, $measure_i) {
$MeasureIndex =array("none"=>"none","bmsSBChecked"=>"Building Management System","energyStarEquipmentChecked"=>"EnergyStar Equipment","plugLoadChecked"=>"Plug Load Control", "oblsChecked"=>"Occupancy-Based Lighting Sensors","daylightDimmingChecked"=>"Daylight-Based Dimming","OfficefixturedChecked"=> "Office Lighting Fixture Upgrade", "bathroomFixturedChecked"=>"Bathroom Lighting Fixture Upgrade","emergencyLightingChecked"=>"Emergency Lighting Upgrade", "roofInsulationChecked" => "Increase Roof Insulation by R-10", "wallInsulation1Checked" => "Increase Wall Insulation by R-10", "wallInsulation2Checked" => "Increase Wall Insulation by R-20", "windowsUpgradelChecked" => "Window Upgrade", "windowsFilmChecked" => "Window Film", "doorWeatherizationChecked" => "Door Weatherization", "enclosureRecommisChecked" => "Exterior Wall Weatherization*", "airEconChecked" => "Outdoor Air Economizer", "condensingBoilerChecked" => "Condensing Boiler", "sysEffChecked" => "Condensing Unit Replacement");
    if($current_yr > $year) {
        echo "<b>".$MeasureIndex[$finieshedMeasure]."</b>";
    }
    else if($current_yr == $year) {
        echo "<select name='selected[]' id='install_".$current_yr."_".$measure_i."' onchange='installCostValidate(this, ".$current_yr.");'>
            <option value='none'>-none-</option>";
            if($measures['bmsSBChecked'] != 'finished') echo "<option value='bmsSBChecked'>Building Management System ($50,000)</option>";
            if($measures['energyStarEquipmentChecked'] != 'finished') echo "<option value='energyStarEquipmentChecked'>EnergyStar Equipment ($15,000)</option>";
            if($measures['plugLoadChecked'] != 'finished') echo "<option value='plugLoadChecked'>Plug Load Control ($60,000)</option>";
            if($measures['oblsChecked'] != 'finished') echo "<option value='oblsChecked'>Occupancy-Based Lighting Sensors ($50,000)</option>";
            if($measures['daylightDimmingChecked'] != 'finished') echo "<option value='daylightDimmingChecked' disabled>Daylight-Based Dimming ($75,000)</option>";
            if($measures['OfficefixturedChecked'] != 'finished') echo "<option value='OfficefixturedChecked'>Office Lighting Fixture Upgrade ($200,000)</option>";
            if($measures['bathroomFixturedChecked'] != 'finished') echo "<option value='bathroomFixturedChecked'>Bathroom Lighting Fixture Upgrade ($8,000)</option>";
            if($measures['emergencyLightingChecked'] != 'finished') echo "<option value='emergencyLightingChecked'>Emergency Lighting Upgrade ($40,000)</option>";
            if($measures['roofInsulationChecked'] != 'finished') echo "<option value='roofInsulationChecked'>Increase Roof Insulation by R-10 ($50,000)</option>";
            if($measures['wallInsulation1Checked'] != 'finished') echo "<option value='wallInsulation1Checked'>Increase Wall Insulation by R-10 ($100,000)</option>";
            if($measures['wallInsulation2Checked'] != 'finished') echo "<option value='wallInsulation2Checked'>Increase Wall Insulation by R-20 ($130,000)</option>";
            if($measures['windowsUpgradelChecked'] != 'finished') echo "<option value='windowsUpgradelChecked'>Window Upgrade ($100,000)</option>";
            if($measures['windowsFilmChecked'] != 'finished') echo "<option value='windowsFilmChecked'>Window Film ($25,000)</option>";
            if($measures['doorWeatherizationChecked'] != 'finished') echo "<option value='doorWeatherizationChecked'>Door Weatherization ($5,000)</option>";
            if($measures['enclosureRecommisChecked'] != 'finished') echo "<option value='enclosureRecommisChecked'>Exterior Wall Weatherization* ($25,000)</option>";
            if($measures['airEconChecked'] != 'finished') echo "<option value='airEconChecked' disabled>Outdoor Air Economizer ($26,620 at most)</option>";
            if($measures['condensingBoilerChecked'] != 'finished') echo "<option value='condensingBoilerChecked'>Condensing Boiler ($51,225 at most)</option>";
            if($measures['sysEffChecked'] != 'finished') echo "<option value='sysEffChecked'>Condensing Unit Replacement ($195,000 at most)</option>";
        echo "</select>";
    } else {
        echo "";
    }
}
?>


<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>EEB Hub Simulation Tools: Comprehensive</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap-responsive.css" rel="stylesheet">
    <link href="css/docs.css" rel="stylesheet">

    <style>
      body {
        width: 2500px;
        background: linear-gradient(to bottom, #999, #fff);
        padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
      }
      .label-name{
      color:rgb(135, 174, 154);
      /*font-size:14px*/
      }
      .container{
        width: 2400px;
      }

      .table-striped{
        background: #eee;
      }
	  
      .table{
        text-align: center;
        box-shadow: 0px 3px 5px #999;
      }

      .table-striped th {
         color: #333;
         font-size: 16px;
         text-align: center;
      }
    .table-striped td {
		 text-align: center;
		 font-size: 14px;
      }
      b {
		color: green;
      }
      table button {
		width: 100%;
		color: red;
      }
	  #restart-button{
	     background: #295;
		 color:white;
	     position: absolute;
		 left: 50px;
		 width: 115px;
	     opacity: 0;
	  }
	  button:disabled{
		color: #999;
      }
	  #restart-button:hover {
	     opacity: 1;
	  }
	  #restart-game-button{
		padding: 8px;
		font-size: 20px;
		background: #669933;
		color: white;
		margin-bottom: 5px; 
	  }
	  #restart-game-button:hover {
	     background: #666633;
	  }
          th[data-title]:hover{
        background-color: yellow;
        position: relative;
      }

      th[data-title]:hover:after {
  content: attr(data-title);
  padding: 4px 8px;
  color: #333;
  position: absolute;
  left: 0;
  top: 100%;
  white-space: nowrap;
  z-index: 20px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-box-shadow: 0px 0px 4px #222;
  -webkit-box-shadow: 0px 0px 4px #222;
  box-shadow: 0px 0px 4px #222;
  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);
  background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0, #eeeeee),color-stop(1, #cccccc));
  background-image: -webkit-linear-gradient(top, #eeeeee, #cccccc);
  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);
  background-image: -ms-linear-gradient(top, #eeeeee, #cccccc);
  background-image: -o-linear-gradient(top, #eeeeee, #cccccc);
}
    </style>

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="../assets/js/html5shiv.js"></script>
    <![endif]-->
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
  <script src="http://code.jquery.com/jquery-1.7.js"></script>
  <script>
  $(document).ready(function(){
  $("#install_cost1").focusout(function() {
    //alert($("#install_cost1").val());
  });
  });
  </script>
  <script>
  function install_cost1_cal(){
    var temp=parseInt($("#install1_1").val())+ parseInt($("#install1_2").val())+parseInt($("#install1_3").val())+parseInt($("#install1_4").val())+parseInt($("#install1_5").val());
    temp=temp.toString(); 
    var temp1 = temp.substring(0, temp.length-3);var temp2 = temp.substring(temp.length-3, temp.length);
    if((temp.length-3)>0){$("#install_cost1").html("$ "+temp1 +","+temp2);}else{$("#install_cost1").html("$ "+temp2);}
  }
  
  </script>

  <script type="text/javascript">
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

   var installation_costs = {none: 0, bmsSBChecked: 50000, energyStarEquipmentChecked: 15000,plugLoadChecked: 60000, oblsChecked: 50000,daylightDimmingChecked: 75000,OfficefixturedChecked: 200000,bathroomFixturedChecked:8000,emergencyLightingChecked:40000,roofInsulationChecked:50000,wallInsulation1Checked:100000,wallInsulation2Checked: 130000,windowsUpgradelChecked:100000,windowsFilmChecked:25000,doorWeatherizationChecked:5000,enclosureRecommisChecked:25000,airEconChecked:26620,condensingBoilerChecked:51225,sysEffChecked:195000};

  function installCostValidate(this_measure, year){
    var install_cost1 = installation_costs[$("#install_"+year+"_0").val()];
    var install_cost2 = installation_costs[$("#install_"+year+"_1").val()];
    var install_cost3 = installation_costs[$("#install_"+year+"_2").val()];
    var install_cost4 = installation_costs[$("#install_"+year+"_3").val()];
    var install_cost5 = installation_costs[$("#install_"+year+"_4").val()];
    
    var total_cost = install_cost1 + install_cost2 + install_cost3 + install_cost4 + install_cost5;
    //alert(install_cost1+install_cost2+ install_cost3+ install_cost4+ install_cost5);

   available_cap = <?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) print($_SESSION['availableCap2'][1]); 
   else {$currentyear = $_SESSION['current_yr'];$temp = $_SESSION['availableCap2'][$currentyear]-$_SESSION['installationCost'][$currentyear]+132968-$_SESSION['newCost'][$currentyear]+ 50000; print($temp);} ?>;

     //alert(available_cap);
     available_cap = Math.ceil(available_cap);
     if (available_cap - total_cost<0){
       alert("You do not have enough money right now to install this measure.");
       //reset this measure option to be none
       $(this_measure).val('none');
     } else {
      $("#install_cost"+(year+1)).html("$ "+numberWithCommas(total_cost));
     }
  }

  </script>

  </head>

  <body>
        <!-- Navbar
    ================================================== -->
    <div class="navbar navbar-inverse navbar-fixed-top">
            <div class="navbar-inner">
                <div class="container-fluid">
                    <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="brand pull-left" href="tracking-sheet18.php">EEB Hub Energy Retrofit Game</a>
                    <div class="nav-collapse collapse">
                        <ul class="nav">
                            <li>
                                <a href="about.php">About</a>
                            </li>
                            <li>
                                <a href="#tutorial">Tutorial</a>
                            </li>
                            <li>
                                <a href="building-fact.php">Building101</a>
                            </li>
                            <li>
                                <a href="feedback.php">Feedback</a>
                            </li>
                        </ul>
                    </div>
                    <!--/.nav-collapse -->
                </div>
            </div>
        </div>
    <!--
    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container" >
          <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="brand pull-left" href="./">EEB Hub Simulation Platform</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
              <li class="">
                <a href="http://tools.eebhub.org/">Home</a>
              </li>
              <li class="">
                <a href="http://tools.eebhub.org/">Lite</a>
              </li>
              <li class="">
                <a href="http://tools.eebhub.org/">Partial</a>
              </li>
              <li class="">
                <a href="http://tools.eebhub.org/substantial">Substantial</a>
              </li>
              <li class="active">
                <a href="http://tools.eebhub.org/comprehensive">Comprehensive</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
-->
    <!-- Container -->
    <div class="container">
     <h5>You have an annual budget of $50,000 to install energy retrofit measures onto <a href="building-fact.php">Building 101</a>, plus any capital you choose to invest from the energy cost savings from prior years.  You can install up to three measures per year.  Once you’ve selected your measures, click the "1st year" button under the Simulate column to calculate the energy and cost savings from the newly installed measures.  Once you’ve simulated the building, you can compare your results against your % energy savings and investment return goals.  All simulations are powered by DOE's OpenStudio SDK & EnergyPlus Engine.</h5>

        <!-- Sub-Nav-bar -->
        <div class="navbar">
          <div class="navbar-inner">
            <a class="brand" href="#">Tracking Sheet</a>
            <ul class="nav">
              <li><a href="eem_measure.php">Measures</a></li>
              <li><a href="./energy-use.php">Energy</a></li>
              <li><a href="./energy-cost.php">Energy Costs</a></li>
              <li><a href="./zone-component-load.php">Zone Loads</a></li>
              <li><a href="eem_scheduler.php">Measure Planning</a></li>
              <li>NEED COMBINED>></li>
              <li><a href="./energy-intensity.php">Energy Intensity</a></li>
              <li><a href="all-site-energy.php">EEM Model Example</a></li>
              <li><a href="./summary.php">Summary</a></li>
            </ul>
          </div>
        </div>

     <!--<h1 style="text-shadow: 0px 1px 5px golden; color: #fff;"><center>Energy Retrofit Game - Building 101 Tracking Sheet</center></h1>-->
     <h4>$<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) print(number_format($_SESSION['availableCap2'][1])); 
   else {$currentyear = $_SESSION['current_yr'];$temp = $_SESSION['availableCap2'][$currentyear]-$_SESSION['installationCost'][$currentyear]+132968-$_SESSION['newCost'][$currentyear]+ 50000;echo number_format($temp);} ?>
     <span style="color: rgb(45, 149, 143);"> Current Available Capital  |  </span> 
     $132,968 <span style="color: rgb(45, 149, 143);"> Baseline Annual Energy Costs</span> </h4>
	 
<form>
<button type="submit" name="reset" value="0" formaction="" formmethod="post" id="restart-game-button" style="">RESTART</button>
<!--button type="submit" name="buy-audit-button" value="0" formaction="" formmethod="post" id="restart-game-button" style="">BUY AUDIT</button-->
<!--button type="submit" name="end-game" formaction="feedback.php" formethod="post" id="restart-game-button" style=""> END GAME</button-->

<table border='1' class="table table-bordered table-striped">
<tr>
  <th rowspan="2" data-title="The year when you will install the retrofit measure(s)" style="vertical-align:middle;">Year</th>
  <th colspan="5">ENERGY EFFICIENCY MEASURES</th>
  <th colspan="3">COSTS</th>
  <th colspan="4">SAVINGS</th>
<tr>
<th data-title="A list of available retrofit measures. You can install one or more at any year.">Install Measure #1</th>
<th data-title="A list of available retrofit measures. You can install one or more at any year.">Install Measure #2</th>
<th data-title="A list of available retrofit measures. You can install one or more at any year.">Install Measure #3</th>
<th data-title="A list of available retrofit measures. You can install one or more at any year.">Installed 4</th>
<th data-title="A list of available retrofit measures. You can install one or more at any year.">Installed 5</th>
<th data-title="The total cost of the chosen measure(s) to be installed">Installation Cost*</th>
<th data-title="Simulation button to determine the new annual energy use of the building after installing measure(s)">Simulate</th>
<th data-title="New annual energy cost after installing all measures from the beginning of the game">New Annual Energy Cost</th>
<th data-title="Cumulative energy cost savings for simulation years">Cumulative Savings</th>
<th data-title="The remaining capital plus the cumulative energy cost savings">$ Remaining Capital + Saving</th>
<th data-title="Interest if invested at 3% real return">3% real interest rate comparison</th>
<th data-title="%energy cost savings">% Energy Savings</th>
</tr>

<?php

$percent_interest_rate = array(50000, 101500, 154545, 209181, 265457, 323420, 383123, 444617, 507955, 573194);

for($year = 2015; $year < 2025; $year++) {

$j = $year - 2014;

echo " <tr><th style='width: 100px;'>$year";
if($current_yr > $j-1){
  echo "<button id='restart-button' type='submit' name='reset' value='".($j-1)."' formaction='' formmethod='post'>Restart Here</button>";
}
echo "</th>";

for($i=0; $i < 5; $i++) {
    echo '<td>';
    selectedList($current_yr, $j-1, $_SESSION['installed_measures'][$j-1][$i], $_SESSION['measureFinished'],$i);
    echo '</td>';
}

echo '
<td><span id="install_cost'.$j.'">$ ';

if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '-';}else if($j<=$_SESSION['current_yr']){
echo number_format($_SESSION['installationCost'][$j]);} else {echo '-';}
echo '</span></td>
<td><button onClick="load();" type="submit" formmethod="post" formaction="measure_list.php" ';
 
  if($current_yr != $j-1) echo "disabled";

if($j == 1) {
  echo ">1st year</button></td>";
} else if ($j == 2) {
  echo ">2nd year</button></td>";
} else if ($j == 3) {
  echo ">3rd year</button></td>";
} else {
  $num = $j;  
  echo ">{$num}th year</button></td>";
}
  
echo "<td>
$ ";
if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '132,968';}else if($j<=$_SESSION['current_yr']){
echo number_format($_SESSION['newCost'][$j]);} else {$currentyear = $_SESSION['current_yr'];echo number_format($_SESSION['newCost'][$currentyear]);}

echo "</td>
<td>$ ";
if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '0';}else if($j<=$_SESSION['current_yr']){
echo number_format($_SESSION['cumulatedSaving'][$j]);}else {$currentyear = $_SESSION['current_yr'];echo number_format((132968-$_SESSION['newCost'][$currentyear])*($j-$currentyear)+$_SESSION['cumulatedSaving'][$currentyear]);}

echo " </td>
<td>";
if ($j==10) echo "<strong>";
echo "$ ";

//add remainingCapPlusSaving and availableCap2 session if $j = $currentyear
if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo number_format($j*50000);}else if($j<$_SESSION['current_yr']){
echo number_format($_SESSION['remainingCapPlusSaving'][$j]);} else if ($j==$_SESSION['current_yr']){$currentyear = $_SESSION['current_yr'];$_SESSION['remainingCapPlusSaving'][$currentyear]=$_SESSION['availableCap2'][$currentyear]-$_SESSION['installationCost'][$currentyear]+132968-$_SESSION['newCost'][$currentyear];$_SESSION['availableCap2'][$currentyear+1] = $_SESSION['remainingCapPlusSaving'][$currentyear]+50000;echo number_format($_SESSION['remainingCapPlusSaving'][$currentyear]);}
else {$currentyear = $_SESSION['current_yr'];$temp = $_SESSION['availableCap2'][$currentyear]-$_SESSION['installationCost'][$currentyear]+($j+1-$currentyear)*(132968-$_SESSION['newCost'][$currentyear])+($j-$currentyear)*50000;echo number_format($temp);}

if ($j==10) echo "</strong>";
echo "</td>
<td>";
if ($j==10) echo "<strong>";
echo "$ ".number_format($percent_interest_rate[$j-1]);
if ($j==10) echo "</strong>";
echo "</td>
<td>";
if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '-';}else if($j<=$_SESSION['current_yr']){
echo $_SESSION['percentageSaving'][$j];} else {$currentyear = $_SESSION['current_yr'];echo $_SESSION['percentageSaving'][$currentyear];}

echo " %</td>
</tr>";

}
?>


<tr>
<td colspan="13">
<strong>If the game ran 5 more years...</strong>
</td>
</tr>
<tr>
<th>2025</th>
<td colspan="7" style="border: 0px"></td>
<td>$ 
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '132,968';}else {$currentyear = $_SESSION['current_yr'];echo number_format($_SESSION['newCost'][$currentyear]);}
?>
</td>
<td>$ 
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '0';}else {$currentyear = $_SESSION['current_yr'];echo number_format((132968-$_SESSION['newCost'][$currentyear])*(11-$currentyear)+$_SESSION['cumulatedSaving'][$currentyear]);}
?>
</td>
<td>$ 
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0){echo number_format(50000*11);}else {$currentyear = $_SESSION['current_yr'];$temp = $_SESSION['availableCap2'][$currentyear]-$_SESSION['installationCost'][$currentyear]+(11+1-$currentyear)*(132968-$_SESSION['newCost'][$currentyear])+(11-$currentyear)*50000;echo number_format($temp);}
?>
</td>
<td>$ 590,390</td>
<td>
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '-';}else {$currentyear = $_SESSION['current_yr'];echo $_SESSION['percentageSaving'][$currentyear];}
?>  
 %</td>
</tr>
<tr>
<th>2026</th>
<td colspan="7" style="border: 0px"></td>

<td>
$ 
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '132,968';}else {$currentyear = $_SESSION['current_yr'];echo number_format($_SESSION['newCost'][$currentyear]);}
?>
</td>
<td>$ 
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '0';}else {$currentyear = $_SESSION['current_yr'];echo number_format((132968-$_SESSION['newCost'][$currentyear])*(12-$currentyear)+$_SESSION['cumulatedSaving'][$currentyear]);}
?>
</td>
<td>$ 
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0){echo number_format(50000*12);}else {$currentyear = $_SESSION['current_yr'];$temp = $_SESSION['availableCap2'][$currentyear]-$_SESSION['installationCost'][$currentyear]+(12+1-$currentyear)*(132968-$_SESSION['newCost'][$currentyear])+(12-$currentyear)*50000;echo number_format($temp);}
?>
</td>
<td>$ 608,101</td>
<td><?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '-';}else {$currentyear = $_SESSION['current_yr'];echo $_SESSION['percentageSaving'][$currentyear];}
?>
 %</td>
</tr>
<tr>
<th>2027</th>
<td colspan="7" style="border: 0px"></td>

<td>
$ 
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '132,968';}else {$currentyear = $_SESSION['current_yr'];echo number_format($_SESSION['newCost'][$currentyear]);}
?>
</td>
<td>$ 
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '0';}else {$currentyear = $_SESSION['current_yr'];echo number_format((132968-$_SESSION['newCost'][$currentyear])*(13-$currentyear)+$_SESSION['cumulatedSaving'][$currentyear]);}
?>
</td>
<td>$ 
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0){echo number_format(50000*13);}else {$currentyear = $_SESSION['current_yr'];$temp = $_SESSION['availableCap2'][$currentyear]-$_SESSION['installationCost'][$currentyear]+(13+1-$currentyear)*(132968-$_SESSION['newCost'][$currentyear])+(13-$currentyear)*50000;echo number_format($temp);}
?>
</td>
<td>$ 626,345</td>
<td><?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '-';}else {$currentyear = $_SESSION['current_yr'];echo $_SESSION['percentageSaving'][$currentyear];}
?>
 %</td>
</tr>
<tr>
<th>2028</th>
<td colspan="7" style="border: 0px"></td>

<td>
$ 
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '132,968';}else {$currentyear = $_SESSION['current_yr'];echo number_format($_SESSION['newCost'][$currentyear]);}
?>
</td>
<td>$ 
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '0';}else {$currentyear = $_SESSION['current_yr'];echo number_format((132968-$_SESSION['newCost'][$currentyear])*(14-$currentyear)+$_SESSION['cumulatedSaving'][$currentyear]);}
?>
</td>
<td>$ 
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0){echo number_format(50000*14);}else {$currentyear = $_SESSION['current_yr'];$temp = $_SESSION['availableCap2'][$currentyear]-$_SESSION['installationCost'][$currentyear]+(14+1-$currentyear)*(132968-$_SESSION['newCost'][$currentyear])+(14-$currentyear)*50000;echo number_format($temp);}
?>
</td>
<td>$ 645,135</td>
<td><?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '-';}else {$currentyear = $_SESSION['current_yr'];echo $_SESSION['percentageSaving'][$currentyear];}
?>
 %</td>
</tr>
<tr>
<th>2029</th>
<td colspan="7" style="border: 0px"></td>

<td>
$ 
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '132,968';}else {$currentyear = $_SESSION['current_yr'];echo number_format($_SESSION['newCost'][$currentyear]);}
?>
</td>
<td>$ 
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '0';}else {$currentyear = $_SESSION['current_yr'];echo number_format((132968-$_SESSION['newCost'][$currentyear])*(15-$currentyear)+$_SESSION['cumulatedSaving'][$currentyear]);}
?>
</td>
<td>$ 
<?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0){echo number_format(50000*15);}else {$currentyear = $_SESSION['current_yr'];$temp = $_SESSION['availableCap2'][$currentyear]-$_SESSION['installationCost'][$currentyear]+(15+1-$currentyear)*(132968-$_SESSION['newCost'][$currentyear])+(15-$currentyear)*50000;echo number_format($temp);}
?>
</td>
<td>$ 664,489</td>
<td><?php if($_SESSION['current_yr']==''||$_SESSION['current_yr']==0) {echo '-';}else {$currentyear = $_SESSION['current_yr'];echo $_SESSION['percentageSaving'][$currentyear];}
?>
 %</td>
</tr>


</table>
</form>

<div class="pull-right">
  <a href="feedback.php" class="btn btn-large btn-success"> End Game</a>
</div> 
<br>
<h3 id="tutorial">Tutorial</h3>
 <dl>
<h4><dt class="label-name">1. Building 101 Data Pre-Loaded</dt></h4>
<dd>The current version of the game is pre-loaded with baseline energy data from Building101 (the EEB Hub Headquarters at the Philadelphia Navy Yard).  <a href="building-fact.php">Building 101 Statistics & System Details linked here</a> may give you clues on which strategy to pursue.</dd>

 <h4><dt class="label-name">2. Steps to Simulate Building Energy Each Year</dt></h4>
  <dd>
  <ol type="a">
    <li>Set your cost-% savings target (say you want to accomplish 20% energy savings over the whole period of the game which is 10 years)</li>
    <li>In the Row of 2015, you have starting capital for investment of $50,000</li>
    <li>Within your capital budget, choose the retrofit measure(s) that you would like to install from retrofit-list in columns 3-7 (say Bathroom Lighting Upgrade)</li> 
    <li>There are two measures – the metered interval data and the energy audit – which are not installed in the building.   Instead, these provide you with more information to make strategic investment decisions.</li>  
    <li>After choosing the retrofit measure(s) , Column 8 “Installation Cost” will automatically change to the total cost of installation</li>
    <li>Click the “1st year” button to run the simulation (Note the pink tacking line at the top of the screen indicating whether the simulation is complete or not)</li>
    <li>When simulation is complete, columns 10-15 are automatically populated with simulation cost results</li>
    <li>Now you can compare the “remaining capital and cumulative savings” (Column 13) if it is higher than Column 14 and the “% savings” (Column 15) if it meets your target savings percentage that you set at the beginning</li>
  </ol>
  </dd>
 <h4><dt class="label-name">3. Play for 10 Years</dt></h4>
  <dd>To win this game, you need to have the value of Column 13 of the 10th year to be larger than the value in Column 14, and have the value in Column 15 to be the same or higher than your target percent savings.  You can also go for a higher savings target and see how the game would change if you track energy savings out to 15 years instead.  Enjoy!</dd>
</dl>
<p><i>* Installation Cost Disclaimer: Measure costs are not actual estimates, rather, they are generalized cost figures based on author judgments.</i></p>
<br>
<!--
<h3 id="factsheet">Building101 Details</h3>
<p><strong class="label-name">PROPERTY HISTORY: </strong>Building 101 at the Philadelphia Navy Yard was built in 1911 as a barracks, and underwent renovation in 1999.  It now serves an office for the Energy Efficient Buildings Hub and other businesses.  The third floor and parts of the basement and second floor south wing were unoccupied in 2012, except for occasional large events.</p>   
<p><strong class="label-name">OWNER GOALS: </strong>The building owner has three goals: 
  <ol>
<li>Reduce energy costs by at least <strong>20% by 2020</strong>.</li>
<li>Project expenditures do not exceed <strong>$50,000</strong> in any one year, but capital can roll-over from previous years.</li>
<li>Total cumulative energy efficiency program investment perform better than if the capital where invested at a 3% real interest rate.</li>   
</ol>
</p>
<p>
<strong class="label-name">SIZE: </strong>78,000 ft&#178; (61,000 ft&#178; Conditioned)     
</p>
<p><strong class="label-name">SPACES: </strong>3 floors of office space (42,000 ft&#178;), bathrooms (2,000 ft&#178;), lobby areas and stairs (12,000 ft&#178;), a basement (5,000 ft&#178;), and an attic area (unconditioned, 17,000 ft&#178;)
</p>
<p><strong class="label-name">CONSTRUCTION: </strong>18” uninsulated brick exterior walls, 6” concrete ground floor, clay tile roof with R-30 rated fiberglass batt insulation underneath, clear, air-filled, double-panes windows.
</p><p><strong class="label-name">VENTILATION: </strong>Variable-air-volume (VAV) air handling units (AHUs), providing <strong>53,240 CFM (ft&#179;/min)</strong> design capacity to 25 VAV terminal units each equipped with a hot water reheat coil.       
</p><p><strong class="label-name">COOLING: </strong>Air-cooled condensing units (CUs) with a combined cooling capacity of <strong>156 tons</strong> serve direct-expansion (DX) cooling coils in each AHU.  
</p><p><strong class="label-name">HEATING: </strong><strong>2,049 gross MBH</strong>, 83% rated-efficiency natural-gas boiler supplies 180°F water to the AHU heating coils, VAV terminal units, and to hot water radiators that serve the west-facing offices on the second floor. 
</p><p><strong class="label-name">HOT WATER: </strong>199 MBH natural-gas water heaters.
</p><p><strong class="label-name">LIGHTING: </strong> A typical 2,000 ft&#178; office in Building 101 contains 16 fixtures, each with eight 40-watt CFLs.  
</p><p><strong class="label-name">PLUGS:  </strong> The office spaces contain a computer and dual monitors at each workstation, photocopiers, projectors, teleconference equipment, a small server room, and kitchen appliances.
</p><p><strong class="label-name">CONTROLS: </strong>The heating and cooling thermostat set points are 70°F and 75°F, respectively.  The control sequence for the ventilation system is currently unknown, but a custodian has reported hearing the system running during the Sunday evening shift.  The heating system is shut off early-May through mid-October.   
</p>
<br>
-->
<h5 class="text-left">Built by the <a href="http://www.eebhub.org">Energy Efficient Buildings HUB</a>, a <a href="http://energy.gov/science-innovation/innovation/hubs">U.S. Department of Energy Innovation HUB</a>.  Powered by DOE's OpenStudio SDK & EnergyPlus Engine.  </h5>
<h5 class="text-left">Our Retrofit Manager Tool team includes PSU, UMaryland, & NREL.  <a href="https://github.com/eebhub/platform/blob/master/ACKNOWLEDGEMENT_DISCLAIMER">DOE Acknowledgement & Disclaimer</a>.</h5>
<br>
</div> <!-- /container -->
  
  <div id="loading-bar" style="left: 0%; z-index: 99999; box-shadow: 0px 1px 3px #999; height: 3px; width: 0px; background: red; position: fixed; top: 0%;"> </div>
  </body>
  
  <script>  
  
  /* 
   *  the function shows the loading status
   */
  function load() {

      // top screen layer 
      var screen = document.createElement("div");
      screen.style.width = "100%";
      screen.style.height = "100%";
      screen.style.position = "absolute";
      screen.style.top="0";
      screen.style.background="#aaa";
      screen.style.opacity="0.5";
      screen.style.left="0";
      screen.style.zindex="5";
      document.body.appendChild(screen);
  
      var progress = 0;
      var int=self.setInterval(function(){
        loading("loading-bar", progress+"%");
        progress += Math.random()*3; 
        if(progress >= 100) {
           loading("loading-bar", "100%");
           clearInterval(int);
        }
      },750);

     function loading(id, progress) {
     
       //console.log(id);
       //console.log(document.getElementById(id).style.width);
       var width = document.getElementById(id).style.width = progress;
       //console.log(width);
     }
  } 
</script>
</html>





