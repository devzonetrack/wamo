<?php require_once 'php_script/session.php'; ?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>GPS Tracking System</title>
        <link rel="stylesheet" type="text/css" href="js/easyui/themes/bootstrap/easyui.css?v=2">
        <link rel="stylesheet" type="text/css" href="icon/icon.css?v=16">
        <link rel="stylesheet" type="text/css" href="css/style.css?v=16">
        <link rel="stylesheet" type="text/css" href="js/toast/toastr.min.css?v=1">
        <style>
            /* Basics */
            html, body {
                font-family: "Helvetica Neue", Helvetica, sans-serif;
                color: #000;
                text-decoration:none;
                -webkit-font-smoothing: antialiased;
            }
            .boxpoi label {
                color: #555;
                display: inline-block;
                margin-left: 30px;
                margin-top:10px;
                font-size: 14px;
                float:left;
            }
            .boxpoi img{
                float:left;
                border-radius:50%;
            }

            div.sticky {
                position: -webkit-sticky;
                position: sticky;
                top: 0;
                background-color: white;
                /*                padding-bottom: 50px;*/
                font-size: 20px;
            }
            div.alarm {
                overflow:hidden;
                border-bottom: 0px solid #ddd;
                margin-bottom: 5px;
            }
            div.alarm > img {
                width:50px;
                height:50px;                
                display:inline-block;
                vertical-align:top;
                border-radius: 50%;
                margin:5px;
                margin-bottom: 30px;
            }
            div.alarm > span {
                width:90%;
                margin-right:-100px;
                padding-right:100px;
                display:inline-block;
                vertical-align:middle;
                box-sizing:border-box;
                -moz-box-sizing:border-box;
                -webkit-box-sizing:border-box;
                border: 0px solid #ddd;
            }
            div.alarm > h3 {
                margin:3px;
                font-weight: bold;
                vertical-align:middle;
            }
            div.alarm b {
                font-weight: normal;
                position: relative;
                float: right;
                color:#f00;
                width: 100px;
                margin-left: 5px;
            }
            a.btnred{
                background-color: #f00;
                color:#fff;
                border:1px solid #000;
                padding: 2px 5px;
                margin: 5px 0px;
                border-radius: 0px 15px 15px 0px;
                margin-left: 2px;
            }
            a.btnyel{
                background-color: #ff0;
                border:1px solid #000;
                padding: 2px 5px;
                margin: 5px 0px;
                border-radius: 0px 15px 15px 0px;
                margin-left: 2px;
            }
            a.btnblue{
                background-color: #00f;
                color:#fff;

                padding: 2px 5px;
                margin: 5px 0px;
                border-radius: 0px 15px 15px 0px;
                border:1px solid #000;
                margin-left: 2px;

            }
            a.btnedit{
                float:right;
                background-color: #ff0;
                color:#000;
                padding: 2px 5px;
                margin: 5px 0px;
                border-radius: 0px 15px 15px 0px;
                border:1px solid #000;
                margin-left: 2px;                
            }
            .nopol{
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
            }
            .box{
                border-bottom:1px solid #ddd;
                margin:0px 3px 3px 3px;
                font-size: 11px;
                font-family: Arial, Helvetica, sans-serif;
                padding-bottom:5px;
            }
            .boxiw{
                width:200px;
                overflow-x: hidden;
                font-size: 11px;
                font-family: Arial, Helvetica, sans-serif;
            }


            /* Custom Checkbox */
            /* The container */
            .mycheckbox {
                display: block;
                /*                position: relative;*/
                padding-left: 5px;
                margin-bottom: 12px;
                cursor: pointer;
                font-size: 22px;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }

            /* Hide the browser's default checkbox */
            .mycheckbox input {
                position: absolute;
                opacity: 0;
                cursor: pointer;
            }

            /* Create a custom checkbox */
            .checkmark {
                position: absolute;
                top: 0;
                left: 0;
                height: 25px;
                width: 25px;
                background-color: #eee;
            }

            /* On mouse-over, add a grey background color */
            .mycheckbox:hover input ~ .checkmark {
                background-color: #ccc;
            }

            /* When the checkbox is checked, add a blue background */
            .mycheckbox input:checked ~ .checkmark {
                background-color: #2196F3;
            }

            /* Create the checkmark/indicator (hidden when not checked) */
            .checkmark:after {
                content: "";
                position: absolute;
                display: none;
            }

            /* Show the checkmark when checked */
            .mycheckbox input:checked ~ .checkmark:after {
                display: block;
            }

            /* Style the checkmark/indicator */
            .mycheckbox .checkmark:after {
                left: 9px;
                top: 5px;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 3px 3px 0;
                -webkit-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                transform: rotate(45deg);
            }
            .btnedit{
                float: right;
                background-color: #ff0;
                color:#000;
                border-radius: 0px 15px 15px 0px;
                border:1px solid #000;
                margin-left: 2px;     
            }
            .btndel{
                float: right;
                display:block;
                width:16px;
                height:16px;
                margin:3px;
                background:url('icon/app/delete16.png') no-repeat center center;
            }                
            .btnzoom{
                float: right;
                display:block;
                width:16px;
                height:16px;
                margin:3px;
                background:url('icon/app/zoom16.png') no-repeat center center;
            }
            .iconpoi{
                float:right;
                margin:1px;
            }
            #formPoi > #poi{
                float:left;
                width:140px;
                height:40px;
            }
            #formPoi > img{
                float:right;
                border:1px solid #ddd;
            }

            .controls {
                margin-top: 0px;
                border: 1px solid transparent;
                border-radius: 2px 0 0 2px;
                box-sizing: border-box;
                -moz-box-sizing: border-box;
                height: 25px;
                outline: none;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            }

            #pac-input {
                color: #000;
                padding: 4px 5px;
                border: 1px solid #ddd;        
                width: 200px;
                font-family: Roboto;
                font-size: 12px;
                text-overflow: ellipsis;
            }

            #pac-input:focus {
                border-color: #000;
                margin-left: -1px;
                padding-left: 14px;  
                width: 200px;
                font-weight: bold;
            }

            .pac-container {
                font-family: Roboto;
            }

            ::-webkit-input-placeholder {
                color: red;
            }

            :-moz-placeholder { /* Firefox 18- */
                color: red;  
            }

            ::-moz-placeholder {  /* Firefox 19+ */
                color: red;  
            }

            :-ms-input-placeholder {  
                color: red;  
            }

            ul.gridicon {
                list-style-type: none;
            }

            ul.gridicon > li img {
                width:50px;
                height:50px;
                float: left;
                margin: 10px;
                border: 5px solid #fff;

                -webkit-transition: box-shadow 0.5s ease;
                -moz-transition: box-shadow 0.5s ease;
                -o-transition: box-shadow 0.5s ease;
                -ms-transition: box-shadow 0.5s ease;
                transition: box-shadow 0.5s ease;
            }

            ul.gridicon > li img:hover {
                -webkit-box-shadow: 0px 0px 7px rgba(255,255,255,0.9);
                box-shadow: 0px 0px 7px rgba(255,255,255,0.9);
            }

            /*Alarm */

            div.formalarm > label.descr {
                margin-top: 2px;
                margin-bottom: 2px;
                display:inline-block;
                *display: inline;     /* for IE7*/
                zoom:1;              /* for IE7*/
                vertical-align:middle;
                margin-left:30px
            }

            div.formalarm > label.title {
                display:inline-block;
                *display: inline;     /* for IE7*/
                zoom:1;              /* for IE7*/
                float: left;
                padding-top: 5px;
                text-align: right;
                width: 140px;
            }
            /*formatViewAlarm*/

            .viewpoi td{                
                border:0px;
            }
            .viewgeofence{
                width:100%;
            }
            .viewgeofence td:first-child{
                border:0px;
                min-width:100px;
                max-width:100px;
                text-align: left;
            }
            .viewgeofence td:last-child{
                border:0px;
                width:100%;
                text-align: left;
            }

            .redblock {
                display:block;
                font-weight: bold;
                color:#f00;
            }
        </style>     

        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCc-sw8SR_DBoqIQ1LB27w3cGks1S9EBB4&v=3&libraries=geometry,places"></script>
        <script type="text/javascript" src="js/easyui/jquery.min.js?v=7"></script>
        <script type="text/javascript" src="js/easyui/jquery.easyui.min.js?v=7"></script>
        <script type="text/javascript" src="js/easyui/jquery.color.js"></script>        
        <script type="text/javascript" src="js/toast/toastr.min.js"></script>
        <script type="text/javascript" src="js/f.js?v=21"></script>
        <script type="text/javascript" src="js/map_label.js?v=18"></script>
        <script type="text/javascript" src="js/vars.js?v=18"></script>
        <script type="text/javascript" src="js/MyServices.js?v=18"></script>
        <script type="text/javascript" src="js/desa.js?v=18"></script>
        <script type="text/javascript" src="js/mapV4.js?v=24"></script>

    </head>

    <body id="main" class="easyui-layout">
        <div style="height:55px;" data-options="region:'north', bodyCls: 'topCss',href:'php_script/menu.php'"></div>
        <div data-options="region:'south'" style="height:35px;padding:1px 10px;overflow: hidden;">
            <a id="btnNotifyInvoice" href="#" class="easyui-linkbutton" iconCls="icon-ok16">Invoice:0</a>
            <a id="btnNotifyAlarm" href="#" class="easyui-linkbutton" iconCls="icon-ok16">Alarm:0</a>
        </div>
        <div data-options="
             region:'center', 
             href:'php_script/map/page_map.php?v=1.0.50',
             onLoad: function () {
             init();
             }
             "></div>
    </body>
</html>
