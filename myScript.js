/*
# file name : myScript.js
# Created by: David Joerres
# Created on: 4/7/2018
*/


$( document ).ready(function() {


    //When the page loads, make an ajax call to retrieve any data that currently exists.
    var startData = {"action": "start"};
    startData = $(this).serialize() + "&" + $.param(startData);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "myphp.php",
        data: startData, 
        success: function(data) {
            //For each element in the returned data, create a task.
            for(var i = 0; i<data.length; i++){
                createTask(data[i]['task'], data[i]['complete']);
            }
            //update so the graph and stats are correct.
            updateStats(data);
        }
    });



    //When the add task button is pressed, add a task
    $("#addTaskBtn").on('click', function(){
        var input = $('#newTaskInput').val(); //get user inputed task
        if(input == ""){ //if input is blank, alert user
            alert("You must write something!");
        }else{ //else, set data for ajax call and send it to sendData() function.
            var data = {"action": "add", "input" : input};
            sendData(data);
        }
    });

    // Add a "checked" symbol when clicking on a list item
    $('ul.taskList').on('click', 'li', function(){ 
        var li = $(this).closest("li"); //get the li element
        if(li.hasClass('checked')){ //if the element is checked
            //set ajax data action: uncheck, and input as the text of the pressed element
            var data = {"action": "uncheck", "input" : li.text()}; 
            sendData(data);
            li.removeClass('checked'); //remove checked class to uncheck the item
        }else{ //if the element is not checked
            //set ajax data action: check, and input as the text of the pressed element
            var data = {"action": "check", "input" : li.text()};
            sendData(data);
            li.addClass('checked'); //add the checked class to check the item
        }
    });


    /*
        function name       : sendData
        accepts 1 parameter : array(["action": ______, "input" : _____])
        description         : given data, makes an ajax call to the server. 
                            : depending on the return data, will either, create a new task, uncheck a task, check a task, or display an error.
        returns             : nothing
    */
    function sendData(data){
        action = data['action']; //set action for use in switch statement after ajax call
        data = $(this).serialize() + "&" + $.param(data); 
            $.ajax({
                type: "POST",
                dataType: "json",
                url: "myphp.php",
                data: data,
                success: function(data) {
                    if(data != -1){ //data will be -1 if the task is already on the list
                        updateStats(data); // update stats graph and table
                        var newData = data[data.length-1]; //since the entire array of all tasks is returned, set newData = the task just added.
                        //use the action variable created in the beggining to 
                        switch(action){
                            case "add"      : createTask(newData['task'], newData['complete']); break;
                            case "check"    : break; //the checking of the tasks is taken care of with JS when the task is clicked, so the ajax call is just to update the stats.
                            case "uncheck"  : break;
                            default : console.log("err"); break;
                        }

                    }else{ //duplicate task was entered
                        alert("That task is already on the list!");
                        $("#newTaskInput").val("");
                    }
                }
            });
    }

    /*
        function name       : createTask
        accepts 2 parameters: String- text of task to add, Boolean- weather a task is completed or not
        description         : Creates a list element and appends the input text and then appends it the the end of the task list
        returns             : nothing
    */
    function createTask(input, complete) {
        var li = document.createElement("li");
        var t = document.createTextNode(input);
        li.appendChild(t);
        document.getElementById("myUL").appendChild(li);
      
        //set value of input bar to ""
        $("#newTaskInput").val("");

        //if complete == true, gigve the task a class of checked
        if (complete){
            li.classList.toggle('checked');
        }
    }

    /*
        function name       : updateStats
        accepts 2 parameters: array(["action": ______, "input" : _____])
        description         : counts the total number of tasks and well as number of completed and incompleted tasks and updates the stats and graph at the top of the page.
        returns             : nothing
    */
    function updateStats(data){
        //set variable default vals
        var numTasks = data.length;
        var completeTasks = 0;
        var incompleteTasks = 0;

        //for each task, if comeplete == true, add 1 to completedTasks else, add 1 to incomepleteTasks
        for(var i = 0; i<numTasks; i++){ 
            if (data[i]['complete'] == true){
                completeTasks++;
            }else{
                incompleteTasks++;
            }
        }

        //set the values in the stats table
        $('#numTasks').html(numTasks);
        $('#completedTasks').html(completeTasks);
        $('#incompleteTasks').html(incompleteTasks);

        //This code handles the graph, I just found a plugin online and copied some code and adjusted the values
        $("#chartContainer").CanvasJSChart({ 
        axisY: { 
            title: "Number of Tasks" 
        }, 
        data: [ 
        { 
            type: "bar", 
            toolTipContent: "{label}: {y} ",
            dataPoints: [ 
                { label: "Completed Tasks",   y: completeTasks  }, 
                { label: "Incomplete Tasks",  y: incompleteTasks}
            ] 
        } 
        ] 
    });  

    }
});
