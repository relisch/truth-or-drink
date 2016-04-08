<?php

	if(isset($_POST['func'])) {
		//include all files for needed area (a)
		foreach (glob("./service/".$_POST['a'].".php") as $filename){
			include $filename;
		}
		$serviceMethod=$_POST['func'];
		$data=$_POST['data'];
		$result=@call_user_func($serviceMethod,$data,$_SERVER['REMOTE_ADDR']);
		if($result){
			//might need the header cache stuff
			header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
		    header("Cache-Control: no-store, no-cache, must-revalidate");
		    header("Cache-Control: post-check=0, pre-check=0", false);
		    header("Pragma: no-cache");
		    //MUST change the content-type
		    header("Content-Type:text/plain");
			echo $result;
		}
	}
?>