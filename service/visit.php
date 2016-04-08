<?php

 require "./data/data.php";
 
$mysqli=new mysqli("localhost","uname","pw",'db');

// Check if this person has visited the site. If they have, increment their count by one. 
    function logVisit($d, $ipAddr) {
        // $d is organied: city region country organization
        $visitData = explode('|', $d);
        $result = updateVisitor($ipAddr, $visitData[0], $visitData[1], $visitData[2], $visitData[3]);
        return '{"result":"'.$result.'"}';
    }

?>