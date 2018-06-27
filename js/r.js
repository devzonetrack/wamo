var vh_id = 0;
var nopol = '';
var fdate = '';
var tdate = '';
var alarm_id = 0;
var bbmPrice = 0;
var bbmDistance = 0;
var engineFilter = '';
var engineValue = '';
var parkFilter = '';
var parkValue = 0;
var parkDetectBy = '';

var user_id = 0;
var paused = false;
var timer;
var tripSpeed = 500;
var reportType = "trip";
var xhr;
var tripIndex = 0;
var rowIndex = 0;
var pageSize = 5;
var pageNumber = 0;
var iw;
var marker;
var map = null;
var polyline;
var trips = [];
var markers = [];
var users = [];
var panelPlayback = null;
var panelGrid = null;
var panelSummary = null;
var datagrid = null;

init_map = function () {
    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(0, 114.921327),
        panControl: true,
        zoomControl: true,
        scaleControl: true,
        streetViewControl: false,
        overviewMapControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID]
        }
    };
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
};
init_data = function () {
    $("#cboUserReport").combotree({
        id: 'id',
        text: 'real_name',
        url: 'php_script/json_tree_user.php',
        loadFilter: function (rows) {
            return convert(rows);
        },
        onLoadSuccess: function (node, data) {
            for (var i in data) {
                var d = data[i];
                $('#cboUserReport').combotree('setValue', {
                    id: d.id,
                    text: d.real_name
                });
                user_id = d.id;
                $('#cboGpsReport').combobox('reload');
                break;
            }

        },
        onClick: function (rec) {
            user_id = rec.id;
            $('#cboGpsReport').combobox('reload');
        }
    });

    $("#cboGpsReport").combobox({
        valueField: 'id',
        textField: 'nopol',
        onBeforeLoad: function (param) {
            param.user_id = user_id;
            console.log('Load Data:' + user_id);
        },
        url: 'php_script/json_combo_vehicle2.php'
    });
};
change_bbm_options = function () {
    var val = $("#checkboxbbm").prop("checked");
    switch (val) {
        case true:
            $("#priceperliter").show();
            $("#distanceperliter").show();
            break;
        case false:
            $("#priceperliter").hide();
            $("#distanceperliter").hide();
            break;
    }
};
clear_datagrid = function () {
    datagrid.datagrid('loadData', {"total": 0, "rows": []});
};
change_report = function (id) {
    console.log('Change Report:' + id);
    panelSummary.html("");
    reportType = id;
    $("#priceperliter").hide();
    $("#distanceperliter").hide();
    $("#parkoptions").hide();
    $("#parkoptions2").hide();
    $("#engineoptions").hide();
    $("#alarmoptions").hide();
    $("#speedAdjustment").hide();
    clear_datagrid();

    if (reportType === "trip") {
        datagrid.datagrid({
            fitColumns: false,
            pagination: true,
            pageSize: 5,
            pageList: [5, 10, 20, 30, 40, 50, 100],
            columns: [[
                    {field: 'tdate', title: 'Tanggal', width: 130},
                    {field: 'acc', title: 'ACC', width: 80, formatter: format_acc}, //formatter: formatACC                    
                    {field: 'speed', title: 'Kecepatan', width: 80},
                    {field: 'park', title: 'Parkir', width: 120},
                    {field: 'poi', title: 'POI', width: 150},
                    {field: 'address', title: 'Alamat', width: 300},
                    {field: 'angle', title: 'Arah', width: 100, formatter: format_angle},
                    {field: 'lat', title: 'Lat', width: 100},
                    {field: 'lng', title: 'Lng', width: 100}

                ]]
            , onClickRow: function (rowIndex, rowData) {
                //console.log(rowData);
                move_by_index(rowIndex, rowData);
            }
        });

        datagrid.datagrid('resize');
        init_map('panel_map');
    } else if (reportType === "alarm") {
        $("#alarmoptions").show();
        datagrid.datagrid({
            fitColumns: false,
            pageSize: 100,
            pageList: [10, 20, 30, 40, 50, 100],
            columns: [[
                    {field: 'tdate', title: 'Tanggal', width: 130},
                    {field: 'alarm', title: 'Alarm', width: 130, formatter: format_alarm},
                    {field: 'descr', title: 'Keterangan', width: 130},
                    {field: 'acc', title: 'ACC', width: 80, formatter: format_acc}, //formatter: formatACC                    
                    {field: 'speed', title: 'Kecepatan', width: 80},
                    {field: 'poi', title: 'POI', width: 150},
                    {field: 'address', title: 'Alamat', width: 300},
                    {field: 'lat', title: 'Lat', width: 100},
                    {field: 'lng', title: 'Lng', width: 100}

                ]]
            , onClickRow: function (rowIndex, rowData) {
                var m = markers[rowData.no];
                if (m != undefined || m != null) {
                    google.maps.event.trigger(m, 'click');
                }
                //R.row_click(rowIndex, rowData);
            }
        });
        datagrid.datagrid('resize');
        init_map('panel_map');
    } else if (reportType === "parking") {
        $("#parkoptions").show();
        $("#parkoptions2").show();
        datagrid.datagrid({
            fitColumns: false,
            pageSize: 100,
            pageList: [10, 20, 30, 40, 50, 100],
            columns: [[
                    {field: 'id', title: 'Id', hidden: true, width: 10},
                    {field: 'duration', title: 'Durasi', width: 150},
                    {field: 'tdate', title: 'Dari Tgl', width: 150},
                    {field: 'tdate2', title: 'S/D Tanggal', width: 150},
                    {field: 'acc', title: 'ACC', width: 80}, //formatter: formatACC                   
                    {field: 'poi', title: 'POI', width: 100},
                    {field: 'address', title: 'Alamat', width: 200},
                    {field: 'lat', title: 'Lat', width: 100},
                    {field: 'lng', title: 'Lng', width: 100}
                ]]
            , onClickRow: function (rowIndex, rowData) {
                //console.log(rowData);
                show_park(rowData);
            }
        });
        datagrid.datagrid('resize');
        init_map('panel_map');
    } else if (id === "fuel") {
        //Clear Grid Report
        datagrid.datagrid('loadData', []);

        //Show BBM Report Option
        $("#priceperliter").show();
        $("#distanceperliter").show();

        datagrid.datagrid({
            fitColumns: false,
            pageSize: 100,
            pageList: [10, 20, 30, 40, 50, 100],
            columns: [[
                    {field: 'tdate', title: 'Tanggal', width: 100},
                    {field: 'acc', title: 'ACC', width: 80, formatter: format_acc},
                    {field: 'speed', title: 'Speed', width: 80},
                    {field: 'distance', title: 'Jarak', width: 100},
                    {field: 'liter', title: 'Liter', width: 100},
                    {field: 'cost', title: 'Biaya', width: 100},
                    {field: 'lat', title: 'Lat', width: 100},
                    {field: 'lng', title: 'Lng', width: 100},
                    {field: 'poi', title: 'POI', width: 100},
                    {field: 'address', title: 'Alamat', width: 200}
                ]]
            , onClickRow: function (rowIndex, rowData) {
                move_by_index(rowIndex, rowData);
            }
        });
        init_map('panel_map');
    } else if (id === "workingtime") {
        $("#engineoptions").show();
        datagrid.datagrid({
            fitColumns: false,
            pageSize: 100,
            pageList: [10, 20, 30, 40, 50, 100],
            columns: [[
                    {field: 'duration', title: 'Durasi', width: 100},
                    {field: 'tdate', title: 'Start', width: 100},
                    {field: 'tdate2', title: 'Stop', width: 100},
                    {field: 'lat', title: 'Lat', width: 100},
                    {field: 'lng', title: 'Lng', width: 100},
                    {field: 'poi', title: 'POI', width: 100},
                    {field: 'address', title: 'Address', width: 200}
                ]]
            , onClickRow: function (rowIndex, rowData) {
                show_park(rowIndex, rowData);
            }
        });
        init_map('panel_map');
    } else if (id === "workingstoptime") {
        $("#engineoptions").show();
        datagrid.datagrid({
            fitColumns: false,
            pageSize: 100,
            pageList: [10, 20, 30, 40, 50, 100],
            columns: [[
                    {field: 'start', title: 'Start', width: 100},
                    {field: 'finish', title: 'Finish', width: 100},
                    {field: 'address', title: 'Start Address', width: 200},
                    {field: 'address2', title: 'Finish Address', width: 200},
                    {field: 'duration', title: 'Work Time', width: 200},
                    {field: 'duration2', title: 'Stop Time', width: 200}
                ]]
            , onClickRow: function (rowIndex, rowData) {
                show_park(rowIndex, rowData);
            }
        });
        init_map('panel_map');
    } else if ((id === "SOS_ALARM")
            || (id === "POWER_CUT_ALARM")
            || (id === "LOW_POWER")
            || (id === "SHOCK_ALARM")
            || (id === "OVER_SPEED_ALARM")
            || (id === "LOW_SPEED_ALARM")
            || (id === "GEOFENCE_IN_ALARM")
            || (id === "GEOFENCE_OUT_ALARM")
            || (id === "OVERTIME_PARK_ALARM")
            || (id === "MOVE_ALARM")) {
        datagrid.datagrid({
            fitColumns: false,
            pageSize: 100,
            pageList: [10, 20, 30, 40, 50, 100],
            columns: [[
                    {field: 'alarm', title: 'Alarm', width: 100},
                    {field: 'tdate', title: 'Tanggal', width: 100},
                    {field: 'speed', title: 'Kecepatan', width: 80},
                    {field: 'angle', title: 'Arah', width: 100, formatter: formatAngle},
                    {field: 'acc', title: 'ACC', width: 80, formatter: formatACC},
                    {field: 'lat', title: 'Lat', width: 100},
                    {field: 'lng', title: 'Lng', width: 100},
                    {field: 'poi', title: 'POI', width: 100},
                    {field: 'address', title: 'Alamat', width: 200}
                ]]
        });
        datagrid.datagrid('resize');
    } else if (id === 'enterpoi') {
        datagrid.datagrid({
            fitColumns: false,
            pageSize: 100,
            pageList: [10, 20, 30, 40, 50, 100],
            columns: [[
                    {field: 'nopol', title: 'Nopol', width: 120},
                    {field: 'poi', title: 'POI', width: 200},
                    {field: 'start', title: 'Enter', width: 130},
                    {field: 'finish', title: 'Exit', width: 130},
                    {field: 'duration', title: 'Durasi', width: 100},
                    {field: 'lat', title: 'Lat', width: 100},
                    {field: 'lng', title: 'Lng', width: 100}

                ]]
        });
        datagrid.datagrid('resize');
        //panelPlayback.hide();
    } else if (id === 'entergeofence') {
        datagrid.datagrid({
            fitColumns: false,
            pageSize: 100,
            pageList: [10, 20, 30, 40, 50, 100],
            columns: [[
                    {field: 'nopol', title: 'Nopol', width: 120},
                    {field: 'gf_name', title: 'Geofence', width: 200},
                    {field: 'start', title: 'Enter', width: 130},
                    {field: 'finish', title: 'Exit', width: 130},
                    {field: 'duration', title: 'Durasi', width: 100},
                    {field: 'lat', title: 'Lat', width: 100},
                    {field: 'lng', title: 'Lng', width: 100}

                ]]
        });
        datagrid.datagrid('resize');
        //panelPlayback.hide();
    } else if (id === 'hidrolik') {
        datagrid.datagrid({
            title: 'Rekap Bongkar Muatan(Berbasis Hidrolik))',
            iconCls: 'icon-edit',
            width: 1024,
            height: 450,
            singleSelect: true,
            idField: 'id',
            rownumbers: true,
            autoRowHeight: false,
            pagination: true,
            pageSize: 50,
            pageList: [10, 50, 100, 200, 500, 100],
            columns: [[
                    {field: 'nopol', title: 'NOPOL', width: 120},
                    {field: 'tdate', title: 'HIDROLIK ON', width: 150},
                    {field: 'tdate2', title: 'HIDROLIK OFF', width: 150},
                    {field: 'duration', title: 'DURASI HIDROLIK', width: 150},
                    {field: 'address', title: 'ALAMAT', width: 150},
                    {field: 'poi', title: 'POI', width: 150},
                    {field: 'gf_name', title: 'GEOFENCE', width: 150},
                    {field: 'spj', title: 'NO SPJ', width: 150},
                    {field: 'driver', title: 'DRIVER', width: 150}

                ]]
        });
    }
    var opts = datagrid.datagrid("options");
    opts.loadFilter = pagerFilter;

    var pager = datagrid.datagrid("getPager");
    pager.pagination({
        onSelectPage: function (pn, ps) {
            pageNumber = pn;
            pageSize = ps;
            console.log("Select Page:" + pn + ",pageSize:" + pageSize);
        },
        onChangePageSize: function (ps) {
            console.log('onChangePageSize:' + ps);
            pageSize = ps;
        }
    });
};

change_gps = function (obj) {
    vh_id = obj.value;
};
change_user = function (obj) {
    user_id = obj.value;
};
init_trip = function () {
    trips = [];
    trips.length = 0;
    //Init Polyline
    if (polyline !== undefined) {
        polyline.setMap(null);
    }
    polyline = new google.maps.Polyline({
        strokeColor: "#80ff00",
        strokeOpacity: 0.8,
        strokeWeight: 5
    });
    polyline.setMap(map);
    tripIndex = 0;
    tripSpeed = 500;
    pageNumber = 1;
    rowIndex = 0;
    if (marker !== undefined) {
        marker.setMap(null);
    }
};
start_trip = function () {
    $("#btnPlay").hide();
    $("#btnPause").show();
    $("#btnStop").show();
    play();
};
wait = function (ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
};
var changePage = false;
play = function () {
    if (timer) {
        clearTimeout(timer);
    }
    if (tripIndex >= trips.length) {
        alert('Finish');
        return;
    }
    if (changePage === true) {
        timer = setTimeout(function () {
            var pager = datagrid.datagrid("getPager");
            pager.pagination('select', ++pageNumber);
            rowIndex = 0;
            changePage = false;
            datagrid.datagrid('selectRow', rowIndex).datagrid('highlightRow', rowIndex);
            play();
        }, 10);
        return;
    }
    var track = trips[tripIndex++];
    var latlng = new google.maps.LatLng(track.lat, track.lng);
    marker.setPosition(latlng);
    map.setCenter(latlng);
    var info = "<table>";
    info += "<tr><td>Tanggal</td><td>:</td><td>" + track.tdate + "</td></tr>";
    info += "<tr><td>Kecepatan</td><td>:</td><td>" + track.speed + " Km/h</td></tr>";
    if (track.duration != "") {
        info += "<tr><td>Parkir</td><td>:</td><td>" + track.duration + "</td></tr>";
        info += "<tr><td>Dari Jam</td><td>:</td><td>" + track.tdate + "</td></tr>";
        info += "<tr><td>Sampai Jam</td><td>:</td><td>" + track.tdate2 + "</td></tr>";
    }
    info += "<tr><td>Lat/Lng</td><td>:</td><td>" + track.lat + "/" + track.lng + "</td></tr>";
    info += "<tr><td>POI</td><td>:</td><td>" + track.poi + "</td></tr>";
    info += "<tr><td>Alamat</td><td>:</td><td>" + track.address + "</td></tr></table>";

    if (iw != undefined) {
        iw.setContent(info);
    }
    if (rowIndex < (pageSize - 1)) { //rowIndex 4 adalah baris ke 5 karena baris diawali dari 0
        datagrid.datagrid('selectRow', rowIndex).datagrid('highlightRow', rowIndex);
        rowIndex++;
    } else if (rowIndex == (pageSize - 1)) {
        datagrid.datagrid('selectRow', rowIndex).datagrid('highlightRow', rowIndex);
        rowIndex = 0;
        changePage = true;
    }
    if (track.park === '') {
        timer = setTimeout('play();', tripSpeed);
    } else {
        timer = setTimeout('play();', 3000);
    }
};
pause = function () {
    clearTimeout(timer);
    paused = true;
    $("#btnPlay").show();
    $("#btnPause").hide();
    $("#btnStop").show();
};
stop = function () {
    clearTimeout(timer);
    tripIndex = 0;
    rowIndex = 0;
    pageNumber = 1;

    $("#btnPlay").show();
    $("#btnPause").show();
    $("#btnStop").show();

    var pager = datagrid.datagrid("getPager");
    pager.pagination('select', pageNumber);
    datagrid.datagrid('scrollTo', rowIndex).datagrid('selectRow', rowIndex);
};
clear_trip = function () {
    if (xhr) {
        xhr.abort();
    }
    if (polyline !== undefined) {
        polyline.setMap(null);
        tripIndex = 0;
        pageNumber = 1;
        tripSpeed = 500;
    }

    if (marker !== undefined) {
        marker.setMap(null);
    }
    if (markers) {
        for (var i in markers) {
            if (markers[i] !== undefined) {
                markers[i].setMap(null);
            }
        }
        markers = [];
    }
    if (trips) {
        trips = [];
        trips.length = 0;
    }
    datagrid.datagrid('loadData', {"total": 0, "rows": []});
};
trip_move = function (move) {
    switch (move) {
        case 'first':
            tripIndex = 0;
            break;
        case 'prev':
            if (tripIndex > 0) {
                tripIndex--;
            }
            break;
        case 'next':
            if (tripIndex < (trips.length - 1)) {
                tripIndex++;
            }
            break;
        case 'last':
            tripIndex = trips.length - 1;
            break;
    }
    datagrid.datagrid('scrollTo', tripIndex);
    datagrid.datagrid('highlightRow', tripIndex);
    var track = trips[tripIndex];
    var currLatLng = new google.maps.LatLng(track.lat, track.lng);
    var icon = create_icon(trip_object_type, track.speed, track.angle);
    marker.setIcon(icon);
    marker.setPosition(currLatLng);
    map.setCenter(currLatLng);
    if (iw !== null)
    {
        var content = "<div>Event:" + get_alarm_name(track.alarm_id) + "</br>";
        content += "Date:" + track.tdate + "</br>";
        content += "Speed:" + track.speed + " Km/jam</br>";
        content += "Lat:" + track.lat + "</br>";
        content += "Lng:" + track.lng + "</br>";
        content += "Poi:" + track.poi + "</br>";
        content += "Address:" + track.address + "</div>";
        if (iw !== null) {
            iw.setContent(content);
            iw.setPosition(currLatLng);
        }

    }
};

create_marker = function (objGps) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(objGps.lat), parseFloat(objGps.lng)),
        map: map
    });
    google.maps.event.addListener(marker, 'click', function () {
        var str = "<table >";
        str += "<tr><td>Date</td><td>:</td><td>" + objGps.tdate + "</td></tr>";
        str += "<tr><td>Speed</td><td>:</td><td>" + objGps.speed + " Km/h</td></tr>";
        str += "<tr><td>Lat/Lng</td><td>:</td><td>" + objGps.lat + "/" + objGps.lng + "</td></tr>";
        str += "<tr><td>Address</td><td>:</td><td>" + objGps.address + "</td></tr>";
        if (iw === null) {
            iw = new google.maps.InfoWindow();
        }
        iw.setContent(str);
        iw.open(map, marker);
    });
    return marker;
};
create_alarm_marker = function (objGps) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(objGps.lat), parseFloat(objGps.lng)),
        map: map
    });
    google.maps.event.addListener(marker, 'click', function () {
        var str = "<table >";
        str += "<tr><td>Alarm</td><td>:</td><td>" + alarm_name(objGps.alarm_id) + "</td></tr>";
        str += "<tr><td>Date</td><td>:</td><td>" + objGps.tdate + "</td></tr>";
        str += "<tr><td>Speed</td><td>:</td><td>" + objGps.speed + " Km/h</td></tr>";
        str += "<tr><td>Lat/Lng</td><td>:</td><td>" + objGps.lat + "/" + objGps.lng + "</td></tr>";
        str += "<tr><td>Address</td><td>:</td><td>" + objGps.address + "</td></tr>";
        if (iw === null) {
            iw = new google.maps.InfoWindow();
        }
        iw.setContent(str);
        iw.open(map, marker);
    });
    return marker;
};
create_park_marker = function (trip) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(trip.lat), parseFloat(trip.lng)),
        map: map,
        icon: 'images/park4.png'
    });
    google.maps.event.addListener(marker, 'click', function () {
        var str = "<table >";
        str += "<tr><td>Parkir</td><td>:</td><td>" + trip.park + "</td></tr>";
        str += "<tr><td>Dari Jam</td><td>:</td><td>" + trip.tdate + "</td></tr>";
        str += "<tr><td>S/D Jam</td><td>:</td><td>" + trip.tdate2 + "</td></tr>";
        str += "<tr><td>Lat/Lng</td><td>:</td><td>" + trip.lat + "/" + trip.lng + "</td></tr>";
        str += "<tr><td>Alamat</td><td>:</td><td>" + trip.address + "</td></tr>";
        if (iw === undefined) {
            iw = new google.maps.InfoWindow();
        }
        iw.setContent(str);
        iw.open(map, marker);
    });
    return marker;
};
create_alarm_marker = function (track) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(track.lat), parseFloat(track.lng)),
        map: map,
        icon: 'images/park.png'
    });
    google.maps.event.addListener(marker, 'click', function () {
        var str = "<table >";
        str += "<tr><td>Alarm</td><td>:</td><td>" + alarm_name(track.alarm) + "</td></tr>";
        str += "<tr><td>Keterangan</td><td>:</td><td>" + track.descr + "</td></tr>";
        str += "<tr><td>Tgl/Jam</td><td>:</td><td>" + track.tdate + "</td></tr>";
        str += "<tr><td>Kecepatan</td><td>:</td><td>" + track.speed + "</td></tr>";
        str += "<tr><td>Lat/Lng</td><td>:</td><td>" + track.lat + "/" + track.lng + "</td></tr>";
        str += "<tr><td>Address</td><td>:</td><td>" + track.address + "</td></tr>";
        if (iw === undefined) {
            iw = new google.maps.InfoWindow();
        }
        iw.setContent(str);
        iw.open(map, marker);
    });
    return marker;
};
function pagerFilter(data) {
    if (typeof data.length == 'number' && typeof data.splice == 'function') {    // is array
        data = {
            total: data.length,
            rows: data
        }
    }
    var dg = $(this);
    var opts = dg.datagrid('options');
    var pager = dg.datagrid('getPager');
    pager.pagination({
        onSelectPage: function (pageNum, pageSize) {
            opts.pageNumber = pageNum;
            opts.pageSize = pageSize;
            pager.pagination('refresh', {
                pageNumber: pageNum,
                pageSize: pageSize
            });
            dg.datagrid('loadData', data);
        }
    });
    if (!data.originalRows) {
        data.originalRows = (data.rows);
    }
    var start = (opts.pageNumber - 1) * parseInt(opts.pageSize);
    var end = start + parseInt(opts.pageSize);
    data.rows = (data.originalRows.slice(start, end));
    return data;
}
report_workingtime = function () {
    clear_trip();
    get_data_form();
    $.messager.progress({title: 'Download Data..', msg: 'Please Wait Downloading Data....'});
    xhr = $.ajax({
        url: 'php_script/report_workingtime.php',
        type: 'POST', dataType: 'json',
        data: {vh_id: vh_id, fdate: fdate, tdate: tdate},
        success: function (objects) {
            var no = 0;
            $.each(objects.data, function (i, item) {
                var currTrip = {
                    acc: item.acc,
                    start: item.start, finish: item.finish,
                    duration: item.duration,
                    lat: item.lat, lng: item.lng,
                    address: item.address
                };

                var marker = create_marker(currTrip);
                markers.push(marker);
                trips[no++] = currTrip;
            });

            datagrid.datagrid('loadData', trips);
            var strSummary = "<table class='tbl_list'>";
            strSummary += "<tr class='odd'><td style='background:#0f0;color:#000;'>Total Mesin Hidup</td><td style='background:#0f0;color:#000;'>" + objects.total_on + "</td></tr>";
            strSummary += "<tr class='event'><td style='background:#f00;color:#fff;'>Total Mesin Mati</td><td  style='background:#f00;color:#fff;'>" + objects.total_off + "</td></tr>";
            strSummary += "</table>";
            panelSummary.html(strSummary);
            $("#bottomLayout").layout('expand', 'south');
            $.messager.progress('close');
        }
    }).done(function () {
    }).fail(function (error, msg) {
        console.log(error);
        $.messager.progress('close');
    }).always(function () {

    });
};
report_workingtime_excel = function () {
    get_data_form();
    window.location = "php_script/report_workingtime_excel.php?vh_id=" + vh_id + "&nopol=" + nopol + "&fdate=" + fdate + "&tdate=" + tdate;
    return;
};

report_trip = function () {
    if (xhr) {
        xhr.abort();
    }
    clear_trip();
    init_trip();
    get_data_form();
    var batasTimeout = 1000 * 60 * 15;
    var speedTotal = 0;
    var speedCount = 0;
    var totalOn = 0;
    var totalOff = 0;
    $.messager.progress({title: 'Download Data..', msg: 'Please Wait Downloading Data....'});
    xhr = $.ajax({
        url: 'php_script/report/report_trip.php',
        type: 'POST',
        dataType: 'json',
        timeout: batasTimeout,
        data: {rand: Math.random(), vh_id: vh_id, fdate: fdate, tdate: tdate},
        success: function (objects) {
            if (parseInt(objects.total, 10) <= 0) {
                $.messager.progress('close');
                alert('Data Kosong');
            }
            var no = 0;
            for (var i in objects.data) {
                var item = objects.data[i];
                item['status'] = parseInt(item.acc, 10) === 1 ? 'on' : 'off';
                var speed = parseInt(item.speed);
                if (isNaN(speed) === false) {
                    if (speed >= 2) {
                        speedTotal += speed;
                        speedCount++;
                    }
                    //speedTotal += speed;
                }
                trips[no] = item;
                if (item.park !== '') {
                    totalOff += calc_diff_ms(trips[no].tdate, trips[no].tdate2);
                    var mp = create_park_marker(item);
                    markers.push(mp);
                }
                no++;
            }

            //Hitung Total Waktu
            var totalEngine = calc_diff_ms(trips[0].tdate, trips[trips.length - 1].tdate);
            var totalOn = totalEngine - totalOff;
            for (var i = 0; i < trips.length; i++) {
                var latlng = new google.maps.LatLng(parseFloat(trips[i].lat), parseFloat(trips[i].lng));
                var path = polyline.getPath();
                path.push(latlng);
            }

            var avgSpeed = speedTotal / speedCount;
            var dist = google.maps.geometry.spherical.computeLength(polyline.getPath().getArray()) / 1000;
            //var distance2=distance.toFixed(2);
            var strStatistic = "<table>";
            strStatistic += "<tr><td>Kecepatan Rata-rata</td><td>:</td><td>" + avgSpeed.toFixed(2) + "Km/Jam</td></tr>";
            strStatistic += "<tr><td>Jarak Tempuh</td><td>:</td><td>" + dist.toFixed(2) + "Km</td></tr>";
            strStatistic += "<tr><td>Total On</td><td>:</td><td>" + ms_to_time(totalOn) + "</td></tr>";
            strStatistic += "<tr><td>Total Off</td><td>:</td><td>" + ms_to_time(totalOff) + "</td></tr>";
            strStatistic += "</table>";

            panelSummary.html(strStatistic);
            datagrid.datagrid({nowrap: false, fitColumns: false, loadFilter: pagerFilter}).datagrid('loadData', trips);

            //if available data history, create marker
            console.log("total data history:" + trips.length);
            if (trips.length > 0)
            {
                //Create Marker Playback
                marker = create_marker(trips[0]);
                map.setCenter(marker.getPosition());
                map.setZoom(12);
            }
            $.messager.progress('close');
            $("#bottomLayout").layout('expand', 'south');
        }
    }).done(function () {
        console.log('get data user done!');
    }).fail(function (e1, e2, e3) {
        $.messager.progress('close');
        if (e2 === 'timeout') {
            alert('Download Data Timeout 15 Menit, Silahkan gunakan akses internet yang lebih cepat untuk menghindari timeout');
        }
    }).always(function () {

    });
};
process_park = function (start, finish, temps) {

};
report_trip2 = function () {
    console.log("report_trip2");
    if (xhr) {
        xhr.abort();
    }
    clear_trip();
    init_trip();
    get_data_form();
    var batasTimeout = 1000 * 60 * 15;
    var batasParkir = 1000 * 300;
    var dist = 0;
    var speedTotal = 0;
    var speedCount = 0;
    var totalTime = 0;
    var totalOn = 0;
    var totalOff = 0;
    var avgSpeed = 0;
    var no = -1;
    var first = true;
    var parkMS = 0; //park milisecond
    var workMS = 0; //work milisecond
    var speed = 0;
    var temps = [];
    var temp;
    var currIndex = 0;
    var total = 0;
    $.messager.progress({title: 'Download Data..', msg: 'Please Wait Downloading Data....'});
    xhr = $.ajax({
        url: 'php_script/report/report_trip2.php',
        type: 'POST',
        dataType: 'json',
        timeout: batasTimeout,
        data: {rand: Math.random(), vh_id: vh_id, fdate: fdate, tdate: tdate},
        success: function (result) {
            total = parseInt(result.total, 10);
            if (total <= 0) {
                $.messager.progress('close');
                alert('Data Kosong');
            }

            for (var i in result.data) {
                currIndex++;
                var item = result.data[i];
                //item['tdate2']=item.tdate;
                item.speed = parseInt(item.speed, 10);
                item.acc = item.speed >= 5 ? 1 : 0;
                item['status'] = item.speed >= 5 ? 'on' : 'off';
                speed = parseInt(item.speed, 10);
                if (speed >= 2) {
                    speedTotal += speed;
                    speedCount++;
                }
                if (first === false) {

                    if ((trips[no].acc == 0) && ((item.acc == 1) || (currIndex >= total))) {
                        //hitung parkir
                        //trips[no]['tdate2']=item.tdate;
                        parkMS = calc_diff_ms(trips[no].tdate, trips[no].tdate2);
                        console.log('parkMS:' + parkMS);
                        //Jika lebih dari 5Menit dianggap parkir
                        if (parkMS >= batasParkir) {
                            totalOff += parkMS;
                            trips[no]['park'] = ms_to_time(parkMS);
                            var mp = create_park_marker(trips[no]);
                            markers.push(mp);
                        } else {
                            for (var i in temps) {
                                temp = temps[i];
                                temp.acc = 1;
                                temp.status = 'on';
                                trips[++no] = temp;
                            }
                            temps = [];
                            temps.length = 0;
                        }
                        //park = false;
                        if (currIndex < total) {
                            trips[++no] = item;
                            continue;
                        }
                    }

                    if ((trips[no].acc == 0) && (item.acc == 0)) {
                        //park = true;
                        trips[no]['tdate2'] = item.tdate;
                        temps.push(item);
                        continue;
                    }

                    if ((trips[no].acc == 1) && (item.acc == 1)) {
                        trips[++no] = item;
                        continue;
                    }
                    if ((trips[no].acc == 1) && (item.acc == 0)) {
                        trips[++no] = item;
                        temps.push(item);
                        continue;
                    }
                } else {
                    first = false;
                    trips[++no] = item;
                }
            }
            //Hitung Total Waktu

            if (no >= 0) {
                var totalTime = calc_diff_ms(trips[0].tdate, trips[no].tdate2);
                var totalOn = totalTime - totalOff;
                for (var i = 0; i < no; i++) {
                    var latlng = new google.maps.LatLng(parseFloat(trips[i].lat), parseFloat(trips[i].lng));
                    var path = polyline.getPath();
                    path.push(latlng);
                }
                if (speedCount > 0) {
                    avgSpeed = speedTotal / speedCount;
                }
                dist = google.maps.geometry.spherical.computeLength(polyline.getPath().getArray()) / 1000;

            }
            //var distance2=distance.toFixed(2);
            var strStatistic = "<table>";
            strStatistic += "<tr><td>Kecepatan Rata-rata</td><td>:</td><td>" + avgSpeed.toFixed(2) + "Km/Jam</td></tr>";
            strStatistic += "<tr><td>Jarak Tempuh</td><td>:</td><td>" + dist.toFixed(2) + "Km</td></tr>";
            strStatistic += "<tr><td>Total On</td><td>:</td><td>" + ms_to_time(totalOn) + "</td></tr>";
            strStatistic += "<tr><td>Total Off</td><td>:</td><td>" + ms_to_time(totalOff) + "</td></tr>";
            strStatistic += "</table>";

            panelSummary.html(strStatistic);
            datagrid.datagrid({nowrap: false, fitColumns: false, loadFilter: pagerFilter}).datagrid('loadData', trips);

            //if available data history, create marker
            console.log("total data history:" + trips.length);
            if (trips.length > 0)
            {
                //Create Marker Playback
                marker = create_marker(trips[0]);
                map.setCenter(marker.getPosition());
                map.setZoom(12);
            }
            $.messager.progress('close');
            $("#bottomLayout").layout('expand', 'south');
        }
    }).done(function () {
        console.log('get data user done!');
    }).fail(function (e1, e2, e3) {
        $.messager.progress('close');
        if (e2 === 'timeout') {
            alert('Download Data Timeout 15 Menit, Silahkan gunakan akses internet yang lebih cepat untuk menghindari timeout');
        }
    }).always(function () {

    });
};


report_trip_byspeed = function () {
    if (xhr) {
        xhr.abort();
    }
    clear_trip();
    init_trip();
    get_data_form();
    xhr = $.ajax({
        url: 'php_script/report_trip.php',
        type: 'POST',
        dataType: 'json',
        data: {vh_id: vh_id, fdate: fdate, tdate: tdate},
        beforeSend: function () {
            $.messager.progress();
        },
        success: function (objects) {
            var no = 0;
            var tempNo = 0;
            var first = true;
            var speedTotal = 0;
            var totaldata = parseInt(objects.total);
            var numStop = 0;
            var numAccOff = 0;
            var tempTrips = [];
            var isPark = false;
            var totalOn = 0;
            var totalOff = 0;
            //console.log(objects.msg);
            //console.log("Total Data:" + totaldata);
            if (totaldata > 0)
            {
                $.each(objects.data, function (i, item) {
                    var speed = parseInt(item.speed);
                    if (isNaN(speed) === false) {
                        speedTotal += speed;
                    }
                    var currTrip = {
                        tdate: item.tdate,
                        tdate2: item.tdate,
                        lat: parseFloat(item.lat),
                        lng: parseFloat(item.lng),
                        alarm_id: item.alarm_id,
                        acc: parseInt(item.acc),
                        status: parseInt(item.acc) === 1 ? 'on' : parseInt(item.acc) === 0 ? 'stop' : 'off',
                        duration: '',
                        speed: item.speed,
                        odo: 0,
                        angle: parseFloat(item.angle),
                        poi: item.poi,
                        address: item.address
                    };
                    //trips[no++] = currTrip;
                    if (first === false)
                    {
                        var prevTrip = trips[no - 1];
                        var dist = distance(prevTrip.lat, prevTrip.lng, currTrip.lat, currTrip.lng);
                        if (dist > 5) {
                            trips[no++] = currTrip;
                        } else {
                            if (currTrip.acc === 0) {
                                numAccOff++;
                            }
                            currTrip.odo = prevTrip.odo + dist;
                            if (prevTrip.speed <= 2)
                            {
                                if (currTrip.speed < 2) {
                                    prevTrip.tdate2 = item.tdate;
                                    tempTrips[tempNo++] = currTrip;
                                    isPark = true;
                                } else if (currTrip.speed < 2) {
                                    var second = diff_ms(prevTrip.tdate, currTrip.tdate);
                                    totalOff += second;
                                    //parkir dihitung berdasarkan selisih waktu dalam menit jika lebih dari 10 menit dianggap parkir
                                    var second = diff_datetime(prevTrip.tdate, currTrip.tdate);
                                    if (second >= 10)
                                    {
                                        totalOff += second;
                                        isPark = false;
                                        prevTrip.acc = 0;
                                        prevTrip.tdate2 = currTrip.tdate;
                                        prevTrip.duration = calc_park(prevTrip.tdate, currTrip.tdate);
                                        //console.log("Park:" + prevTrip.park);
                                        trips[no++] = currTrip;
                                        //Add parking icon
                                        if (prevTrip.duration != "") {
                                            var marker = create_park_marker(prevTrip);
                                            markers.push(marker);
                                        }
                                    } else {
                                        for (var i = 0; i < tempTrips.length; i++) {
                                            trips[no++] = tempTrips[i];
                                        }
                                    }
                                    tempTrips = [];
                                    tempNo = 0;
                                }
                            } else if (prevTrip.speed > 2) {
                                if (currTrip.speed > 2) {
                                    isPark = false;
                                } else {
                                    var second = diff_ms(prevTrip.tdate, currTrip.tdate);
                                    totalOn += second;
                                    isPark = true;
                                }
                                trips[no++] = currTrip;
                            }
                        }
                    } else {
                        trips[no++] = currTrip;
                        if (currTrip.acc === 0) {
                            isPark = true;
                            tempTrips[tempNo++] = currTrip;
                        }
                        first = false;
                    }
                });
                var second = diff_ms(trips[no - 1].tdate, trips[no - 1].tdate2);
                if (isPark) {
                    trips[no - 1].acc = 0;
                    trips[no - 1].duration = calc_park(trips[no - 1].tdate, trips[no - 1].tdate2);
                    //Add parking icon
                    var marker = create_park_marker(trips[no - 1]);
                    markers.push(marker);
                    totalOff += second;
                } else {
                    totalOn += second;
                }

                //Draw Polyline, parking marker
                for (var i = 0; i < trips.length; i++)
                {
                    var lat = parseFloat(trips[i].lat);
                    var lng = parseFloat(trips[i].lng);
                    if (lat !== NaN && lng !== NaN) {
                        var latlng = new google.maps.LatLng(lat, lng);
                        var path = polyline.getPath();
                        path.push(latlng);

                        if (trips[i].park !== "") {

                        }
                    }
                }
                //Calcuate avg speed
                var avgSpeed = speedTotal / trips.length;
                //Calculate total distance; 
                var dist = google.maps.geometry.spherical.computeLength(polyline.getPath().getArray()) / 1000;
                //var distance2=distance.toFixed(2);
                var strSummary = "<table class='tbl_list'>";
                strSummary += "<tr class='even'><td>Kecepatan Rata-rata</td><td>:</td><td>" + avgSpeed.toFixed(2) + "Km/Jam</td></tr>";
                strSummary += "<tr class='odd'><td>Jarak Tempuh</td><td>:</td><td>" + dist.toFixed(2) + "Km</td></tr>";
                strSummary += "<tr class='even'><td>Lama Berhenti</td><td>:</td><td>" + sec_to_time(totalOff) + "</td></tr>";
                strSummary += "<tr class='odd'><td>Lama Berjalan</td><td>:</td><td>" + sec_to_time(totalOn) + "</td></tr>";
                strSummary += "</table>";
                panelSummary.show();
                panelSummary.html(strSummary);
                //Prepare trip Icon
                if (trips.length > 0)
                {
                    $("#btnPlay").show();
                    $("#btnPause").hide();
                    $("#btnStop").hide();

                    datagrid.datagrid('loadData', trips);
                    var latlng = trips[0];
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(parseFloat(latlng.lat), parseFloat(latlng.lng)),
                        map: map
                    });
                    google.maps.event.addListener(marker, 'click', function () {
                        var str = "<table >";
                        str += "<tr><td>Date</td><td>:</td><td>" + trips[tripIndex].tdate + "</td></tr>";

                        if (trips[tripIndex].park === "") {
                            str += "<tr><td>Speed</td><td>:</td><td>" + trips[tripIndex].speed + " Km/h</td></tr>";
                        } else {
                            str += "<tr><td>Parking</td><td>:</td><td>" + trips[tripIndex].park + "</td></tr>";
                            str += "<tr><td>From Date</td><td>:</td><td>" + trips[tripIndex].tdate + "</td></tr>";
                            str += "<tr><td>To Date</td><td>:</td><td>" + trips[tripIndex].tdate2 + "</td></tr>";
                        }
                        str += "<tr><td>Lat/Lng</td><td>:</td><td>" + trips[tripIndex].lat + "/" + trips[tripIndex].lng + "</td></tr>";
                        str += "<tr><td>Address</td><td>:</td><td>" + trips[tripIndex].address + "</td></tr>";
                        if (iw == undefined) {
                            iw = new google.maps.InfoWindow();
                        }
                        iw.setContent(str);
                        iw.open(map, marker);
                    });

                    google.maps.event.trigger(marker, 'click');
                    map.setCenter(new google.maps.LatLng(parseFloat(latlng.lat), parseFloat(latlng.lng)));
                    map.setZoom(12);
                } else {
                    alert('Data Kosong');
                }
            } else {
                alert('Keterangan: Data Kosong');
            }
        }
    }).done(function () {
        console.log('get data user done!');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
    }).always(function () {
        $.messager.progress('close');
    });
};
report_trip_excel = function () {
    get_data_form();
    window.location = "php_script/report_trip_excel.php?vh_id=" + vh_id + "&nopol=" + nopol + "&fdate=" + fdate + "&tdate=" + tdate;
    return;
};
report_parking_excel = function () {
    get_data_form();
    window.location = "php_script/report_parking_excel.php?vh_id=" + vh_id + "&nopol=" + nopol + "&fdate=" + fdate + "&tdate=" + tdate + "&park_filter=" + parkFilter + "&park_filter_value=" + parkValue + "&park_detect_by=" + parkDetectBy;
    return;
};
report_fuel_excel = function () {
    get_data_form();
    window.location = "php_script/report_fuel_excel.php?vh_id=" + vh_id + "&nopol=" + nopol + "&fdate=" + fdate + "&tdate=" + tdate + "&park_filter=" + parkFilter + "&park_filter_value=" + parkValue + "&park_detect_by=" + parkDetectBy;
    return;
};

report_entergeofence_excel = function () {
    get_data_form();
    window.location = "php_script/report_entergeofence_excel.php?vh_id=" + vh_id + "&nopol=" + nopol + "&fdate=" + fdate + "&tdate=" + tdate;
    return;
};
report_parking = function () {
    if (xhr) {
        xhr.abort();
    }
    clear_datagrid();
    clear_trip();
    get_data_form();
    $.messager.progress({title: 'Downoad Report', msg: 'Silahkan Tunggu'});
    xhr = $.ajax({
        url: 'php_script/report_parking.php',
        type: 'POST',
        dataType: 'json',
        data: {vh_id: vh_id, fdate: fdate, tdate: tdate, park_filter: parkFilter, park_filter_value: parkValue, park_detect_by: parkDetectBy},
        success: function (objects) {
            console.log(objects);
            if (parseInt(objects.total) > 0)
            {
                var bounds = new google.maps.LatLngBounds();
                $.each(objects.data, function (i, item) {
                    trips.push(item);
                    var marker = create_park_marker(item);
                    markers.push(marker);
                    bounds.extend(marker.getPosition());
                });
                map.fitBounds(bounds);
                if (trips.length > 0) {
                    datagrid.datagrid('loadData', trips);
                }
                $("#bottomLayout").layout('expand', 'south');
            } else {
                alert('Keterangan: Data Kosong');
            }
        }
    }).done(function () {
        console.log('get data user done!');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
    }).always(function () {
        $.messager.progress('close');
    });
};

report_hour = function () {
    if (xhr) {
        xhr.abort();
    }
    clear_datagrid();
    clear_trip();
    init_trip();
    get_data_form();
    jqxhr = $.ajax({
        url: 'php_script/report_trip.php',
        type: 'POST',
        dataType: 'json',
        data: {vh_id: vh_id, fdate: fdate, tdate: tdate},
        beforeSend: function () {
            $.messager.progress({
                title: 'Download Data..',
                msg: 'Please Wait Downloading Data....'
            });
        },
        success: function (objects) {
            var no = 0;
            var speedTotal = 0;
            var totaldata = parseInt(objects.total);
            var tempTrips = [];
            var engineOn = false;
            // console.log(objects);
            // console.log("Total Data:" + totaldata);
            if (totaldata > 0)
            {

                $.each(objects.data, function (i, item)
                {
                    var speed = parseInt(item.speed);
                    if (isNaN(speed) === false) {
                        speedTotal += speed;
                    }
                    var currTrip = {
                        id: 0,
                        tdate: item.tdate,
                        tdate2: item.tdate,
                        lat: parseFloat(item.lat),
                        lng: parseFloat(item.lng),
                        alarm_id: item.alarm_id,
                        acc: parseInt(item.acc),
                        duration: '',
                        diffMinute: 0,
                        speed: parseFloat(item.speed),
                        odo: 0,
                        angle: parseFloat(item.angle),
                        poi: item.poi,
                        address: item.address
                    };
                    switch (engineOn) {
                        case true:
                            var prevTrip = tempTrips[no - 1];
                            prevTrip.tdate2 = item.tdate;
                            if (currTrip.acc === 0) {
                                prevTrip.duration = calc_park(prevTrip.tdate, currTrip.tdate);
                                prevTrip.diffMinute = diff_datetime(prevTrip.tdate, currTrip.tdate);
                                engineOn = false;
                            }
                            break;
                        case false:
                            if (currTrip.acc === 1) {
                                tempTrips[no++] = currTrip;
                                engineOn = true;
                            }
                            break;
                    }
                });

                //Draw Polyline, parking marker
                var idx = 0;
                var id = 0;
                var bounds = new google.maps.LatLngBounds();
                for (var i in tempTrips)
                {
                    var trip = tempTrips[i];
                    if (engineFilter !== "")
                    {
                        switch (engineFilter) {
                            case ">=":
                                if (trip.diffMinute >= engineValue) {
                                    trip.id = id++;
                                    trips[idx++] = trip;
                                    var marker = create_park_marker(trip);
                                    markers.push(marker);
                                    bounds.extend(marker.getPosition());
                                }
                                break;
                            case "<=":
                                if (trip.diffMinute <= engineValue) {
                                    trip.id = id++;
                                    trips[idx++] = trip;
                                    var marker = create_park_marker(trip);
                                    markers.push(marker);
                                    bounds.extend(marker.getPosition());
                                }
                                break;
                            case "":
                                trip.id = id++;
                                trips[idx++] = trip;
                                var marker = create_park_marker(trip);
                                markers.push(marker);
                                bounds.extend(marker.getPosition());
                                break;
                        }
                    }
                }
                map.fitBounds(bounds);
                //Prepare trip Icon
                if (trips.length > 0)
                {
                    datagrid.datagrid('loadData', trips);
                } else {
                    alert('Data Kosong');
                }
            } else {
                alert('Keterangan: Data Kosong');
            }
        }
    }).done(function () {
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
    }).always(function () {
        $.messager.progress('close');
    });
};

report_workingstop = function () {
    if (xhr) {
        xhr.abort();
    }
    clear_datagrid();
    clear_trip();
    init_trip();
    get_data_form();
    jqxhr = $.ajax({
        url: 'php_script/report_workingstoptime.php',
        type: 'POST',
        dataType: 'json',
        data: {vh_id: vh_id, fdate: fdate, tdate: tdate},
        beforeSend: function () {
            $.messager.progress();
        },
        success: function (objects) {
            console.log(objects);
            var totaldata = parseInt(objects.total);
            var tempTrips = [];
            if (totaldata > 0)
            {
                $.each(objects.data, function (i, item)
                {
                    tempTrips.push(item);
                });
                datagrid.datagrid('loadData', tempTrips);
            } else {
                alert('Keterangan: Data Kosong');
            }
        }
    }).done(function () {
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
    }).always(function () {
        $.messager.progress('close');
    });
};

move_by_index = function (index, track) {
    var currLatLng = new google.maps.LatLng(track.lat, track.lng);
    map.setCenter(currLatLng);
    marker.setPosition(currLatLng);

    var content = "<table>"; //<div>Event:" + alarm_name(track.alarm_id) + "</br>        
    if (track.duration === "") {
        content += "<tr><td>Tanggal</td><td>:</td><td>" + track.tdate + "</td></tr>";
        content += "<tr><td>Kecepatan</td><td>:</td><td>" + track.speed + " Km/jam</td></tr>";

    } else {
        content += "<tr><td>Parkir</td><td>:</td><td>" + track.duration + "</td></tr>";
        content += "<tr><td>Dari Jam</td><td>:</td><td>" + track.tdate + "</td></tr>";
        content += "<tr><td>Sampai Jam</td><td>:</td><td>" + track.tdate2 + "</td></tr>";
    }
    content += "<tr><td>Lat/Lng</td><td>:</td><td>" + track.lat + "/" + track.lng + "</td></tr>";
    content += "<tr><td>POI</td><td>:</td><td>" + track.poi + "</td></tr>";
    content += "<tr><td>Alamat</td><td>:</td><td>" + track.address + "</td></tr>";
    content += "</table>";
    if (iw !== undefined)
    {
        iw.setContent(content);
        iw.setPosition(currLatLng);
    }
    google.maps.event.trigger(iw, 'click');
};
process_row_click = function (index, track) {
    var currLatLng = new google.maps.LatLng(track.lat, track.lng);
    map.setCenter(currLatLng);
    marker.setPosition(currLatLng);

    var content = "<table>"; //<div>Event:" + alarm_name(track.alarm_id) + "</br>        
    if (track.duration === "") {
        content += "<tr><td>Tanggal</td><td>:</td><td>" + track.tdate + "</td></tr>";
        content += "<tr><td>Kecepatan</td><td>:</td><td>" + track.speed + " Km/jam</td></tr>";

    } else {
        content += "<tr><td>Parkir</td><td>:</td><td>" + track.duration + "</td></tr>";
        content += "<tr><td>Dari Jam</td><td>:</td><td>" + track.tdate + "</td></tr>";
        content += "<tr><td>Sampai Jam</td><td>:</td><td>" + track.tdate2 + "</td></tr>";
    }
    content += "<tr><td>Lat/Lng</td><td>:</td><td>" + track.lat + "/" + track.lng + "</td></tr>";
    content += "<tr><td>POI</td><td>:</td><td>" + track.poi + "</td></tr>";
    content += "<tr><td>Alamat</td><td>:</td><td>" + track.address + "</td></tr>";
    content += "</table>";
    if (iw !== null)
    {
        iw.setContent(content);
        iw.setPosition(currLatLng);
    }
    google.maps.event.trigger(iw, 'click');
};
show_park = function (track) {
    var marker = markers[track.id];
    google.maps.event.trigger(marker, 'click');
};
report_fuel = function () {
    console.log('R.download_distance_report');
    if (xhr) {
        xhr.abort();
    }
    clear_datagrid();
    get_data_form();
    var speedTotal = 0;
    console.log('Trip Distance GPS ID:' + vh_id + ', fdate:' + fdate + ',tdate:' + tdate + ', Price:' + bbmPrice + ', Distance:' + bbmDistance);

    xhr = $.ajax({
        url: 'php_script/report_distance.php',
        type: 'POST', dataType: 'json',
        data: {vh_id: vh_id, fdate: fdate, tdate: tdate, bbmPrice: bbmPrice, bbmDistance: bbmDistance},
        beforeSend: function () {
            clear_trip();
            init_trip();
            panelSummary.html("");
            $.messager.progress();
        },
        success: function (objects) {
            //console.log(objects.sql);
            var no = 0;
            var first = true;
            var total_distance = 0;
            var total_cost = 0;
            trips = [];
            $.each(objects.data, function (i, item) {
                item.distance = item.distance.toFixed(2);
                item.cost = item.cost.toFixed(2);
                item.liter = item.liter.toFixed(2);
                trips.push(item);
            });
            //Draw Polyline
            var bounds = new google.maps.LatLngBounds();
            for (i in trips) {
                var latlng = new google.maps.LatLng(parseFloat(trips[i].lat), parseFloat(trips[i].lng));
                var path = polyline.getPath();
                path.push(latlng);
                bounds.extend(latlng);
            }
            map.fitBounds(bounds);
            //Calcuate avg speed
            var avgSpeed = speedTotal / trips.length;
            //Calculate total distance; 
            var dist = google.maps.geometry.spherical.computeLength(polyline.getPath().getArray()) / 1000;
            //var distance2=distance.toFixed(2);
            var strSummary = "<table class='tbl_list'>";
            strSummary += "<tr class='odd'><td>Jarak Tempuh</td><td>:</td><td>" + dist.toFixed(2) + "Km</td></tr>";
            strSummary += "<tr class='even'><td>Jarak Tempuh2</td><td>:</td><td>" + objects.totalDistance.toFixed(2) + "Km</td></tr>";
            strSummary += "<tr class='odd'><td>Jumlah Liter</td><td>:</td><td>Rp " + objects.totalLiter.toFixed(2) + " Liter</td></tr>";
            strSummary += "<tr class='even'><td>Total Biaya</td><td>:</td><td>Rp " + objects.totalCost.toFixed(2) + "</td></tr>";
            strSummary += "</table>";
            panelSummary.html(strSummary);
            //Prepare trip Icon
            if (trips.length > 0)
            {
                //Create Marker Playback
                var latlng = trips[0];
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(parseFloat(latlng.lat), parseFloat(latlng.lng)),
                    map: map
                });
                google.maps.event.addListener(marker, 'click', function () {
                    var str = "<table>";
                    str += "<tr><td>Date</td><td>:</td><td>" + trips[tripIndex].tdate + "</td></tr>";
                    str += "<tr><td>Speed</td><td>:</td><td>" + trips[tripIndex].speed + " Km/h</td></tr>";
                    str += "<tr><td>Lat/Lng</td><td>:</td><td>" + trips[tripIndex].lat + "/" + trips[tripIndex].lng + "</td></tr>";
                    str += "<tr><td>Address</td><td>:</td><td>" + trips[tripIndex].address + "</td></tr>";
                    if (iw === undefined) {
                        iw = new google.maps.InfoWindow();
                    }
                    iw.setContent(str);
                    iw.open(map, marker);
                });
                map.setCenter(new google.maps.LatLng(parseFloat(latlng.lat), parseFloat(latlng.lng)));
                map.setZoom(12);
                datagrid.datagrid('loadData', trips);
                console.log("trips = " + trips.length);
                //panelPlayback.show();
            } else {
                alert('Data Kosong');
                //console.log("trips <= 0 ");
            }
            console.log("Download trip report finish!");
        }
    }).done(function () {
        if (trips.length > 0) {
            // panelPlayback.show();
        }
    }).fail(function () {
        console.log("error");
    }).always(function () {
        $.messager.progress('close');
    });
};
report_alarm = function () {
    if (xhr) {
        xhr.abort();
    }
    clear_trip();
    init_trip();
    get_data_form();
    $.messager.progress({title: 'Download', msg: 'Sedang Download....'});
    xhr = $.ajax({
        url: 'php_script/report_alarm.php',
        type: 'POST',
        dataType: 'json',
        data: {vh_id: vh_id, fdate: fdate, tdate: tdate, alarm_id: alarm_id},
        success: function (objects) {
            console.log(objects);
            var no = 0;
            if (parseInt(objects.total, 10) > 0)
            {
                $.each(objects.data, function (i, item) {
                    item['no'] = no;
                    trips[no] = item;
                    var marker = create_alarm_marker(item);
                    markers[no] = marker;
                    no++;
                });
                $("#tblReport").datagrid('loadData', trips);
            } else {
                alert('Keterangan: Data Kosong');
            }
        }
    }).done(function () {
        console.log('get data user done!');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
    }).always(function () {
        $.messager.progress('close');
    });
};
calcDuration = function (_from, _to) {
    var from = parseDateTime(_from);
    var to = parseDateTime(_to);
    var dt = "";
    var delay = 0;
    //detil
    var second = parseInt(to - from) / 1000;
    if (second >= (30 * 24 * 60 * 60)) {  //2 jam
        //console.log("second:"+second +" - diff :"+diff2);
        delay = second / 60 / 60 / 24 / 30;
        delay = delay.toFixed(0);
        dt = 'Bulan';
    } else if (second >= (24 * 60 * 60)) {  //2 jam
        delay = second / 60 / 60 / 24;
        delay = delay.toFixed(0);
        dt = 'Hari';
    } else if (second >= (1 * 60 * 60)) {  //2 jam
        //console.log("second:"+second +" - diff :"+diff2);
        delay = second / 60 / 60;
        delay = delay.toFixed(0);
        dt = 'Jam';
    } else if (second >= 60) {
        dt = 'Menit';
        delay = second / 60;
        delay = delay.toFixed(0);
    }
    if (delay > 0) {
        return delay + " " + dt;
    } else {
        return "";
    }
};
report_enterpoi = function () {
    if (xhr !== undefined) {
        xhr.abort();
    }
    clear_datagrid();
    get_data_form();
    xhr = $.ajax({
        url: 'php_script/report_enterpoi.php',
        type: 'POST', dataType: 'json',
        data: {vh_id: vh_id, fdate: fdate, tdate: tdate},
        beforeSend: function () {
            clear_marker();
            trips = [];
            //Clear data grid
            datagrid.datagrid('load', [{}]);
            $.messager.progress();
        },
        success: function (objects) {
            //console.log(objects.msg);
            if (parseInt(objects.total) > 0) {
                //console.log(objects.data);
                $.each(objects.data, function (i, item) {
                    item['nopol'] = nopol;
                    trips.push(item);
                });
                datagrid.datagrid('loadData', trips);
            } else {
                alert('Tidak Ada Data Laporan Keluar/Masuk POI Pada Periode :' + fdate + ' S/D ' + tdate);
            }
        }
    }).done(function () {
    }).fail(function (error, msg) {
        console.log(error);
        $.messager.progress('close');
    }).always(function () {
        $.messager.progress('close');
    });
};
report_entergeofence = function () {
    if (xhr !== undefined) {
        xhr.abort();
    }
    clear_datagrid();
    get_data_form();
    xhr = $.ajax({
        url: 'php_script/report_entergeofence.php',
        type: 'POST', dataType: 'json',
        data: {vh_id: vh_id, fdate: fdate, tdate: tdate},
        beforeSend: function () {
            clear_marker();
            trips = [];
            datagrid.datagrid('load', [{}]);
            $.messager.progress();
        },
        success: function (objects) {
            //console.log(objects.msg);
            if (parseInt(objects.total) > 0) {
                //console.log(objects.data);
                $.each(objects.data, function (i, item) {
                    item['nopol'] = nopol;
                    trips.push(item);
                });
                datagrid.datagrid('loadData', trips);
            } else {
                alert('Tidak Ada Data Laporan Keluar/Masuk POI Pada Periode :' + fdate + ' S/D ' + tdate);
            }
        }
    }).done(function () {
    }).fail(function (error, msg) {
        console.log(error);
        $.messager.progress('close');
    }).always(function () {
        $.messager.progress('close');
    });
};
get_data_form = function () {
    vh_id = $("#cboGpsReport").combobox('getValue');
    nopol = $("#cboGpsReport").combobox('getText');
    fdate = $("#fdate").datebox('getValue') + " " + $("#ftime").timespinner('getValue');
    tdate = $("#tdate").datebox('getValue') + " " + $("#ttime").timespinner('getValue');
    alarm_id = $("#alarmType").combobox('getValue');
    bbmPrice = $("#bbmPrice").val();
    bbmDistance = $("#bbmDistance").val();
    engineFilter = $("#engineFilter").combobox('getValue');
    engineValue = parseInt($("#engineValue").val());
    parkFilter = $("#parkFilter").combobox('getValue');
    parkValue = parseInt($("#parkValue").val());
    parkDetectBy = $("#parkDetect").combobox('getValue');

};
report_hidrolik = function () {
    get_data_form();
    datagrid.datagrid('loading');
    datagrid.datagrid('loadData', {"total": 0, "rows": []});
    jqxhr = $.ajax({
        url: 'php_script/report_hidrolik.php',
        type: 'POST',
        dataType: 'json',
        data: {vh_id: vh_id, fdate: fdate, tdate: tdate},
        success: function (result) {
            //console.log(result);
            if (parseInt(result.total, 10) > 0) {
                $.each(result.data, function (i, item) {
                    item['nopol'] = nopol;
                });
                datagrid.datagrid('loadData', result.data);
            }
        }
    }).always(function () {
        datagrid.datagrid('loaded');
    }).fail(function (e1, e2, e3) {
        console.log(e1);
    });
};
download_report = function () {
    datagrid.datagrid('loadData', {"total": 0, "rows": []});
    reportType = $("#treeReport").combobox('getValue');
    console.log("Report Type:" + reportType);
    if (reportType === "trip") {
        report_trip2();
    } else if (reportType === "parking") {
        report_parking();
    } else if (reportType === "fuel") {
        report_fuel();
    } else if (reportType === "workingtime") {
        report_hour();
    } else if (reportType === "workingstoptime") {
        report_workingstop();
    } else if (reportType === "enterpoi") {
        report_enterpoi();
    } else if (reportType === "entergeofence") {
        report_entergeofence();
    } else if (reportType === "alarm") {
        report_alarm();
    } else if (reportType === "hidrolik") {
        report_hidrolik();
    }
};
download_report_excel = function () {
    console.log("Report Excel:" + reportType);
    switch (reportType) {
        case "trip":
            report_trip_excel();
            break;
        case "workingtime":
            report_workingtime_excel();
            break;
        case "parking":
            report_parking_excel();
            break;
        case "fuel":
            report_fuel_excel();
            break;
        case "entergeofence":
            report_entergeofence_excel();
            break;
    }
};
function MyReport() {
    var r = this;
    var from = '';
    var to = '';
    var vh_id = '';
    var nopol = '';
    r.init = function () {

    };
    r.get_form = function () {

    };
    /*
     * Combobox change event
     * 
     */
    r.change_report = function () {
        var rpt_type = $("#treeReport").combobox('getValue');

    };
}
