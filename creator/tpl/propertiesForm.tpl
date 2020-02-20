<div class="panel">
    <label for="" class="has-icon">{{__ "Response identifier"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <div class="tooltip-content">{{__ 'The identifier of the choice. This identifier must not be used by any other response or item variable. An identifier is a string of characters that must start with a Letter or an underscore ("_") and contain only Letters, underscores, hyphens ("-"), period (".", a.k.a. full-stop), Digits, CombiningChars and Extenders.'}}</div>

    <input type="text" 
           name="identifier" 
           value="{{identifier}}" 
           placeholder="e.g. RESPONSE" 
           data-validate="$notEmpty; $qtiIdentifier; $availableIdentifier(serial={{serial}});">
</div>

<div class="panel">
    <label for="level">{{__ "Number of text fields"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Number of text fields to display"}}</span>
    <select name="level" class="select2" data-has-search="false">
        {{#each levels}}
        <option value="{{@key}}" {{#if selected}}selected="selected"{{/if}}>{{label}}</option>
        {{/each}}
    </select>
</div>

<div class="panel">
    <label for="" class="has-icon">{{__ "Label for text fields"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <div class="tooltip-content">{{__ 'Enter a label'}}</div>
    <input name="textfieldlabel" type="text" value="{{textfieldlabel}}">
</div>

<div class="panel">
    <h3 class="full-width">{{__ "Constraints"}}</h3>
    <div>
        <label class="spinner">
            {{__ "Timer minutes"}}
        </label>
        <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
        <span class="tooltip-content">{{__ "Timer value in minutes"}}</span>
        <input type="text" data-min="0" data-max="15" data-increment="1" class="incrementer" name="timerminutes" value="{{timerminutes}}" />
    </div>

    <div>
        <label class="spinner">
            {{__ "Timer seconds"}}
        </label>
        <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
        <span class="tooltip-content">{{__ "Timer value in seconds"}}</span>
        <input type="text" data-min="0" data-max="59" data-increment="1" class="incrementer" name="timerseconds" value="{{timerseconds}}" />
    </div>

    <div>
        <label class="spinner">
            {{__ "Maximum length"}}
        </label>
        <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
        <span class="tooltip-content">{{__ "Limits the number of allowed chars"}}</span>
        <input type="text" data-min="1" data-increment="1" class="incrementer" name="maxlength" {{#if maxlength}}value="{{maxlength}}"{{/if}} />
    </div>

</div>

