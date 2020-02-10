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
define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/states/Question',
    'taoQtiItem/qtiCreator/widgets/helpers/formElement',
    'taoQtiItem/qtiCreator/editor/simpleContentEditableElement',
    'taoQtiItem/qtiCreator/editor/containerEditor',
    'tpl!textAreaTimer/creator/tpl/propertiesForm',
    'lodash',
    'jquery'
], function(stateFactory, Question, formElement, simpleEditor, containerEditor, formTpl, _, $){
    'use strict';

    var textAreaTimerStateQuestion = stateFactory.extend(Question, function(){

        var $container = this.widget.$container,
            $prompt = $container.find('.prompt'),
            interaction = this.widget.element;

        containerEditor.create($prompt, {
            change : function(text){
                interaction.data('prompt', text);
                interaction.updateMarkup();
            },
            markup : interaction.markup,
            markupSelector : '.prompt',
            related : interaction
        });

    }, function(){

        var $container = this.widget.$container,
            $prompt = $container.find('.prompt');

        containerEditor.destroy($prompt);
    });

    textAreaTimerStateQuestion.prototype.initForm = function(){

        var _widget = this.widget,
            $form = _widget.$form,
            interaction = _widget.element,
            response = interaction.getResponseDeclaration(),
            timerminutes = parseInt(interaction.prop('timerminutes')) || 0,
            timerseconds = parseInt(interaction.prop('timerseconds')) || 0,
            maxlength = parseInt(interaction.prop('maxlength')) || 525,
            level = parseInt(interaction.prop('level')) || 4,
            levels = [1, 2, 3, 4],
            levelData = {};
        
        //build select option data for the template
        _.each(levels, function(lvl){
            levelData[lvl] = {
                label : lvl,
                selected : (lvl === level)
            };
        });

        //render the form using the form template
        $form.html(formTpl({
            serial : response.serial,
            identifier : interaction.attr('responseIdentifier'),
            timerminutes : timerminutes,
            timerseconds : timerseconds,
            maxlength : maxlength,
            levels : levelData
        }));

        //init form javascript
        formElement.initWidget($form);

        //init data change callbacks
        formElement.setChangeCallbacks($form, interaction, {
            identifier : function (interaction, value){
                response.id(value);
                interaction.attr('responseIdentifier', value);
            },
            timerminutes : function (interaction, value) {
                //update the pci property value:
                interaction.prop('timerminutes', value);
                //trigger change event:
                interaction.triggerPci('timerminuteschange', [parseInt(value)]);
            },
            timerseconds : function (interaction, value) {
                interaction.prop('timerseconds', value);
                interaction.triggerPci('timersecondschange', [parseInt(value)]);
            },
            maxlength : function (interaction, value) {
                interaction.prop('maxlength', value);
                interaction.triggerPci('maxlengthchange', [parseInt(value)]);
            },
            level : function level(interaction, value){
                interaction.prop('level', value);
                interaction.triggerPci('levelchange', [parseInt(value)]);
            }
        });

    };

    return textAreaTimerStateQuestion;
});
