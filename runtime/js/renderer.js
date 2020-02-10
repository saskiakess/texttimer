/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2019 DEPP, Ministère de l'Education Nationale;
 * Developed by Saskia Keskpaik (DEPP), Jean-Philippe Rivière (Wiquid)
 */
define(['IMSGlobal/jquery_2_1_1', 'OAT/util/html'], function($, html){
    'use strict';

    
    // Keep track of timers for different IDs
    var timers = [];


    function getTimeRemaining(endtime){
        var millisec = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor( (millisec/1000) % 60 );
        var minutes = Math.floor( (millisec/1000/60) % 60 );
        return {
          'millisec': millisec,
          'minutes': minutes,
          'seconds': seconds
        };
    }


    function pushToArray(arr, obj) {
        const index = arr.findIndex((e) => e.id === obj.id);
    
        if (index === -1) {
            arr.push(obj);
        } else {
            arr[index] = obj;
        }
    }


    function countDown(id, $container, endtime) {

        $container.find('.timesUp').remove();
        $container.find('.clock').show();
        $container.find('textarea').prop('disabled', false);
        $container.find('.addTxtarea').prop('disabled', false);
        
        // Create an object to collect the responses (timervalues + textvalues)
        var timerstartoutput = getTimeRemaining(endtime).millisec;
        var timerendoutput;
        var allProptxt = [];
        var responseobj;
        var textvaluesoutput = [];

        // Set timeinterval (1 sec)
        var timeinterval = setInterval(function(){

            // Display time remaining
            var t = getTimeRemaining(endtime);
            $container.find('.clock').html('Temps restant : &nbsp&nbsp' + t.minutes + 'min : ' + t.seconds + 's ');
            
            // Get value from each textarea
            $container.find('.tarea').each(function (index) {
                
                // Create an object with id and value of the textarea
                var obj = {'id':index, 'value':$container.find(this).val()};
                
                // Check if textarea id exists: if TRUE => udpate response array, if FALSE => add to response array
                pushToArray(allProptxt, obj);
                // Extract only values
                allProptxt.forEach(element => textvaluesoutput[element.id] = element.value);

                // Timer end value for output
                timerendoutput = getTimeRemaining(endtime).millisec;
                
                responseobj = {"timerstart": timerstartoutput, "timerend": timerendoutput, "propositions": textvaluesoutput};

                // Write the response to a hidden div
                $container.find('.responsediv').html(JSON.stringify(responseobj));
                

            });

            // If the countdown is finished, clear interval, hide clock, disable textareas
            if(t.millisec < 2){   
                clearInterval(timeinterval);
                $container.find('.globalWrapper').prepend("<div class='timesUp'>Temps écoulé !</div>");
                // if second clock exists, add second timesup
                if ($container.find('.clock:eq( 1 )').length) {
                    $container.find('.clock').last().before("<div class='timesUp'>Temps écoulé !</div>");
                }
                $container.find('.clock').hide();
                $container.find('textarea').prop('disabled',true);
                $container.find('.addTxtarea').prop('disabled', true);
            }
        },1000);
        return timeinterval;
    }
       

    function addTextArea(id, $container, propNumber, maxlength) {

        $container.find('.proptxt').append("<div class='prop prop" + propNumber + "'>Proposition n°" + propNumber + "</div><div><textarea class='tarea tarea" + propNumber + "' cols='500' rows='5' maxlength='" + maxlength + "'></textarea></div>");
    }


    function renderItem(id, $container, config){

        $container.find('.globalWrapper').html("<div class='clock'><span class='minutes'>00</span>:<span class='seconde'>00</span></div><div class='proptxt'></div><div class='clock'><span class='minutes'>00</span>:<span class='seconde'>00</span></div>");
        $container.append("<div class='responsediv hiddenRep'></div>"); 
    }


    function renderPropositions(id, $container, config){

        var propNumber = 1;
        var level = parseInt(config.level) || 4;
        
        // Clear the previous congfiguration
        $container.find('.addTxtarea').remove();
        $container.find('.proptxt').empty();

        // If timer has run out => reactivate
        if($container.find('.timesUp')){
            renderTimerValue(id, $container, config);
        }
        
        if (level == 1){
            // Only one proposition
            $container.find('.proptxt').append("<div class='prop prop" + propNumber + "'>Proposition :" + "</div><div><textarea class='tarea tarea" + propNumber + "' cols='500' rows='5' maxlength='" + renderMaxLength(id, $container, config) + "'></textarea></div>");         
            // Hide the second clock
            $container.find('.clock:eq( 1 )').remove();
        }

        else {

            // Add the second clock, if does not yet exist
            if ($container.find('.clock:eq( 1 )').length == 0) {
                $container.find('.globalWrapper').append("<div class='clock'><span class='minutes'>00</span>:<span class='seconde'>00</span></div>");
            } 

            // Add propositions
            $container.find('.clock:eq( 1 )').before("<button class='addTxtarea'>Ajouter une nouvelle proposition</button>")

            for (let i = 0; i < level; i++) {
                addTextArea(id, $container, propNumber, renderMaxLength(id, $container, config));
                propNumber++;
            }

            $container.find('.addTxtarea').on('click', function () {
                addTextArea(id, $container, propNumber, renderMaxLength(id, $container, config));
                propNumber++;
           })
        }

    }


    function renderTimerValue(id, $container, config){
       
        var timerminutes = parseInt(config.timerminutes) || 0;  
        var timerseconds = parseInt(config.timerseconds) || 0; 
        var currentTime = Date.parse(new Date());
        var endtime = new Date(currentTime + timerminutes*60*1000 + timerseconds*1000);
        var i = 0;

        //  First call
        if (timers.length == 0) {
            var timeinterval  = countDown(id, $container, endtime);
            timers.push({'id':id, 'timeinterval':timeinterval});
        } else {

            while (i < timers.length) { 
               
                // If same id, overwrite the existing timeinterval
                if (timers[i].id == id) {
                    clearInterval(timers[i].timeinterval);
                    var timeinterval = countDown(id, $container, endtime);
                    timers[i].timeinterval = timeinterval;
                    break;
                };             
                i++;
            }
            
            // If new id, add to the timeintervals 
            if (i == timers.length) {
                var timeinterval = countDown(id, $container, endtime);
                timers.push({'id':id, 'timeinterval':timeinterval});
            }
        }
    }


    function renderMaxLength(id, $container, config){

        var maxlength = parseInt(config.maxlength) || 525;

        $container.find('.tarea').attr('maxlength',maxlength.toString());

        return maxlength;
    }


    return {
        render : function(id, container, config){

            var $container = $(container);
            renderItem(id, $container, config);
            renderTimerValue(id, $container, config);
            renderPropositions(id, $container, config);
            
            //render rich text content in prompt
            html.render($container.find('.prompt'));
        },
        renderTimerValue : function(id, container, config){
            renderTimerValue(id, $(container), config);
        },
        renderMaxLength : function(id, container, config){
            renderMaxLength(id, $(container), config);
        },
        renderPropositions : function(id, container, config){
            renderPropositions(id, $(container), config);
        } 
    };
});