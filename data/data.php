<?php

function updateVisitor($ipAddr, $city, $region, $country, $organization) {
    global $mysqli;
    
    $timestamp = round(microtime(true));
    $currTime = date('Y-m-d H:i:s', $timestamp);
    
    $sql = "SELECT visitor_id, num_visits FROM visitors WHERE ip=?";
    try {
        if($stmt=$mysqli->prepare($sql)) {
            $stmt->bind_param("s", $ipAddr);
            $stmt->execute();
            $stmt->store_result();
            $stmt->bind_result($visitor_id, $numVisits);
            if($stmt->fetch()) {
                $stmt->close();
                $sql = "UPDATE visitors SET num_visits=? WHERE ip=?";
                if($stmt=$mysqli->prepare($sql)) {
                    $updatedVisits = $numVisits + 1;
                    $stmt->bind_param("is", $updatedVisits, $ipAddr);
                    $stmt->execute();
                    $stmt->close();
                    // Think about putting this in a separate function
                    $sql = "INSERT INTO visits (visitor_id, date) VALUES (?,?)";
                    if($stmt=$mysqli->prepare($sql)) {
                        $stmt->bind_param("is", $visitor_id, $currTime);
                        $stmt->execute();
                        $stmt->close();
                        return "success2";
                    } else {
                        $stmt->close();
                        return "false 2";
                    }
                } else {
                    $stmt->close();
                    return "false 3";
                }
            } else {
                $stmt->close();
                $one = 1;
                $sql = "INSERT INTO visitors (ip, city, region, country, organization, num_visits) VALUES(?,?,?,?,?,?)";
                if($stmt=$mysqli->prepare($sql)) {
                    $stmt->bind_param("sssssi", $ipAddr, $city, $region, $country, $organization, $one);
                    $stmt->execute();
                    $stmt->close();
                    $sql = "SELECT visitor_id FROM visitors WHERE ip=?";
                    if($stmt=$mysqli->prepare($sql)) {
                        $stmt->bind_param("s", $ipAddr);
                        $stmt->execute();
                        $stmt->store_result();
                        $stmt->bind_result($visitor_id);
                        $stmt->fetch();
                        $stmt->close();
                        // Think about putting this in a separate function
                        $sql = "INSERT INTO visits (visitor_id, date) VALUES (?,?)";
                        if($stmt=$mysqli->prepare($sql)) {
                            $stmt->bind_param("is", intval($visitor_id), $currTime);
                            $stmt->execute();
                            $stmt->close();
                            return "success 5";
                        } else {
                            $stmt->close();
                            return "false 5";
                        }
                        return "success3";
                    } else {
                        $stmt->close();
                        return "false 3";
                    }
                } else {
                    $stmt->close();
                    return "false 4";
                }
            }
        } else {
            $stmt->close();
            return "false 1";
        }
    } catch(Exception $e) {
        $stmt->close();
        return ("error: ".$e->getMessage());
    }
}

?>