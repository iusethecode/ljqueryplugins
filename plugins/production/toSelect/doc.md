## $().toSelect(options)
### Replace an input field with a select field

#### Example


	<script type="text/javascript">
		$(document).ready(
							function (){			
										
											$('#testfield').toSelect(
												{ 
													id:'myId',
													class:'myTestClass', 
													options:		
															[
																{text:'Red',value:'Red', selected:false},
																{text:'Green',value:'Green', selected:true},
																{text:'Blue',value:'Blue', selected:false}		
															]
												}
											);			
										
										}
						);
	</script>


JQuer
	<input type="text" id="testfield" />

	<input type="button" value="Display testfield value" onclick="alert($('#testfield').val())" />



#### Options

- __id__ The ID of the generated SELECT
- __class__  The class of the generated SELECT
- __options__  (required) An array containing the information about the OPTIONs that will be generated. Each entry should have the following format
    - __text__  The text to be displayed for an OPTION.
    - __value__  The actual value of an OPTION that will be stored in the input field
    - __selected__  (true/false) determines if the current OPTION should be preselected.


	
