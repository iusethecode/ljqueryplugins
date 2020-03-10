## $().spin() and $().unspin()
### Replace an input field with a select field

#### Example


   

    <style>
        .spinning{
            background-image: url('ajax-loader.gif');
            background-repeat:no-repeat;
            background-position:50% 50%;
                }
        .spinning *{
            visibility:hidden;
        }
    </style>  
    <div id="testarea" style="border-style: solid; border-color: black; width:400px;">
        <h1>Spinning here</h1>
    </div>


    <input type="button" onclick="$('#testarea').spin()" value="spin"/>
    <input type="button" onclick="$('#testarea').unspin()" value="unspin" />




#### Options

None


	
