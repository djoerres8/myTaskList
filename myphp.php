<?php 
/*
# file name : myphp.php
# Created by: David Joerres
# Created on: 4/7/2018
*/
	//start the session
	session_start();


	 //Function to check if the request is an AJAX request
    function is_ajax() {
      return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
    }


    //if an ajax request is recieved, decode the "action" value, and depending on what action is, peform the correct function.
    if (is_ajax()) {
      if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
        $action = $_POST["action"];
        switch($action) { //Switch case for value of action
        	case "add"	 : addTask($_POST); break;
        	case "check" : checkTask($_POST); break;
        	case "uncheck" : uncheckTask($_POST); break;
        	default : start(); break;
        }
      }
    }


    /*
        function name       : start
        description         : Sets the initial value of the array that will hold all of the tasks into a session variable.
        returns             : the array of all tasks.
    */
	function start(){
		//set session variable = starting values
		$_SESSION['allMyTasks'] = array(["task" => "Laundry", "complete" => false],
                        	["task" => "Take out the Trash", "complete" => true],
                        	["task" => "Homework", "complete" => false]); 

		echo json_encode($_SESSION['allMyTasks']);
	}

   
	/*
        function name       : addTask
        1 Parameter         : array(["action": ______, "input" : _____])
        description         : adds the given task to the end of the allMyTasks array which is held in a session variable
        returns             : the array of all tasks.
    */
    function addTask($taskToAdd){
    	//create a boolean variable to set to true of the new task already exists
        $copy = false;
  		
  		//check to see if the new task is in the array currently
        $newTask = ["task" => $taskToAdd["input"], "complete" => false];
        for ($i = 0; $i<count($_SESSION['allMyTasks']); $i++){
        	    if ($taskToAdd['input'] == $_SESSION['allMyTasks'][$i]['task']){
        	    	$copy = true;
        	    }
          }
  		
  		//if the new task does not already exist in the array, add it to the end and return the full array.
        if ($copy == true){
        	echo json_encode(-1);
        }else{
        	$_SESSION['allMyTasks'][] = $newTask;
        	echo json_encode($_SESSION['allMyTasks']);
        }
    }


    /*
        function name       : checkTask
        1 Parameter         : array(["action": ______, "input" : _____])
        description         : finds the correct task which is currently in the allMyTasks array and changes the complete key to true
        returns             : the array of all tasks.
    */
    function checkTask($task){
    	//find the matching task, and set complete = true
        for ($i = 0; $i<count($_SESSION['allMyTasks']); $i++){
      	    if ($task['input'] == $_SESSION['allMyTasks'][$i]['task']){
      	    	$_SESSION['allMyTasks'][$i]['complete'] = true;
      	    }
        }
        //return the complete task list
        echo json_encode($_SESSION['allMyTasks']);
    }


    /*
        function name       : uncheckTask
        1 Parameter         : array(["action": ______, "input" : _____])
        description         : finds the correct task which is currently in the allMyTasks array and changes the complete key to false
        returns             : the array of all tasks.
    */
    function uncheckTask($task){
    	//find the matching task, and set complete = false
        for ($i = 0; $i<count($_SESSION['allMyTasks']); $i++){
      	    if ($task['input'] == $_SESSION['allMyTasks'][$i]['task']){
      	    	$_SESSION['allMyTasks'][$i]['complete'] = false;
      	    }
        }
        //return the complete task list
        echo json_encode($_SESSION['allMyTasks']);
    }

?>