var params = {
    vh_id: 0,
    nopol: '',
    from: '',
    to: ''
};
var icon_park = 'images/park.png';
var icon_car_on = '';
var report_alarm = {
    map: null,
    polyline: null,
    marker: null,
    marker_start: null,
    marker_stop: null,
    markersPark: [],
    markersAlarm: [],
    trips: [],
    paused: false,
    changePage: false,
    timer: 0,
    tripSpeed: 500,
    xhr: null,
    tripIndex: 0,
    rowIndex: 0,
    pageSize: 5,
    pageNumber: 0,
    iw: null,
    panelPlayback: null,
    panelGrid: null,
    panelSummary: null,
    datagrid: null,
    params: params
};
report_alarm.init = function () {
    delete report_alarm.map;
    delete report_alarm.iw;
    delete report_alarm.polyline;
    delete report_alarm.marker;
    delete report_alarm.marker_start;
    delete report_alarm.marker_stop;

    delete report_alarm.datagrid;
    delete report_alarm.xhr;

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
    report_alarm.map = new google.maps.Map(document.getElementById('map_alarm'), mapOptions);
    report_alarm.datagrid = $("#tbl_alarm");

    $("#tbl_alarm").datagrid({
        onClickRow: function (index, row) {
            var currLatLng = new google.maps.LatLng(row.lat, row.lng);
            report_alarm.map.setCenter(currLatLng);
            report_alarm.map.setZoom(18);
        }
    });

};
report_alarm.init_trip = function () {
    report_alarm.trips = [];
    report_alarm.trips.length = 0;
    //Init Polyline
    if (report_alarm.polyline !== undefined) {
        report_alarm.polyline.setMap(null);
    }
    report_alarm.polyline = new google.maps.Polyline({
        strokeColor: "#80ff00",
        strokeOpacity: 0.8,
        strokeWeight: 5
    });
    report_alarm.polyline.setMap(report_alarm.map);
    report_alarm.tripIndex = 0;
    report_alarm.tripSpeed = 500;
    report_alarm.pageNumber = 1;
    report_alarm.rowIndex = 0;
    if (report_alarm.marker !== undefined) {
        report_alarm.marker.setMap(null);
    }
};
report_alarm.start_trip = function () {
    $("#btnPlay").hide();
    $("#btnPause").show();
    $("#btnStop").show();
    report_alarm.play();
};
wait = function (ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
};
report_alarm.play = function () {
    if (report_alarm.timer) {
        clearTimeout(report_alarm.timer);
    }
    if (report_alarm.tripIndex >= report_alarm.trips.length) {
        alert('Finish');
        return;
    }
    if (report_alarm.changePage === true) {
        timer = setTimeout(function () {
            var pager = report_alarm.datagrid.datagrid("getPager");
            pager.pagination('select', ++report_alarm.pageNumber);
            report_alarm.rowIndex = 0;
            report_alarm.changePage = false;
            report_alarm.datagrid.datagrid('selectRow', report_alarm.rowIndex).datagrid('highlightRow', report_alarm.rowIndex);
            report_alarm.play();
        }, 10);
        return;
    }
    var currTrack = report_alarm.trips[report_alarm.tripIndex++];
    var latlng = new google.maps.LatLng(currTrack.lat, currTrack.lng);

    report_alarm.marker.setIcon(report_alarm.create_icon(currTrack));
    report_alarm.marker.setPosition(latlng);
    report_alarm.map.setCenter(latlng);

    var info = "<table>";
    info += "<tr><td>Tanggal</td><td>:</td><td>" + currTrack.tdate + "</td></tr>";
    info += "<tr><td>Kecepatan</td><td>:</td><td>" + currTrack.speed + " Km/h</td></tr>";

    if (currTrack.park != "") {
        info += "<tr><td>Parkir</td><td>:</td><td>" + currTrack.park + "</td></tr>";
        info += "<tr><td>Dari Jam</td><td>:</td><td>" + currTrack.tdate + "</td></tr>";
        info += "<tr><td>Sampai Jam</td><td>:</td><td>" + currTrack.tdate2 + "</td></tr>";
    }
    info += "<tr><td>Lat/Lng</td><td>:</td><td>" + currTrack.lat + "/" + currTrack.lng + "</td></tr>";
    info += "<tr><td>POI</td><td>:</td><td>" + currTrack.poi + "</td></tr>";
    info += "<tr><td>Alamat</td><td>:</td><td>" + currTrack.address + "</td></tr></table>";

    if (report_alarm.iw != undefined) {
        report_alarm.iw.setContent(info);
    }
    if (report_alarm.rowIndex < (report_alarm.pageSize - 1)) { //rowIndex 4 adalah baris ke 5 karena baris diawali dari 0
        report_alarm.datagrid.datagrid('selectRow', report_alarm.rowIndex).datagrid('highlightRow', report_alarm.rowIndex);
        report_alarm.rowIndex++;
    } else if (report_alarm.rowIndex == (report_alarm.pageSize - 1)) {
        report_alarm.datagrid.datagrid('selectRow', report_alarm.rowIndex).datagrid('highlightRow', report_alarm.rowIndex);
        report_alarm.rowIndex = 0;
        report_alarm.changePage = true;
    }
    if (currTrack.park === '') {
        report_alarm.timer = setTimeout('trip_report.play();', report_alarm.tripSpeed);
    } else {
        report_alarm.timer = setTimeout('trip_report.play();', 3000);
    }
};
report_alarm.pause = function () {
    clearTimeout(report_alarm.timer);
    report_alarm.paused = true;
    $("#btnPlay").show();
    $("#btnPause").hide();
    $("#btnStop").show();
};
report_alarm.stop = function () {
    clearTimeout(report_alarm.timer);
    report_alarm.tripIndex = 0;
    report_alarm.rowIndex = 0;
    report_alarm.pageNumber = 1;
    $("#btnPlay").show();
    $("#btnPause").hide();
    $("#btnStop").hide();
    var pager = report_alarm.datagrid.datagrid("getPager");
    pager.pagination('select', report_alarm.pageNumber);
    report_alarm.datagrid.datagrid('scrollTo', report_alarm.rowIndex).datagrid('selectRow', report_alarm.rowIndex);
};
report_alarm.clear_trip = function () {
    if (report_alarm.xhr) {
        report_alarm.xhr.abort();
    }
    if (report_alarm.polyline !== undefined) {
        report_alarm.polyline.setMap(null);
        report_alarm.tripIndex = 0;
        report_alarm.pageNumber = 1;
        report_alarm.tripSpeed = 500;
    }

    if (report_alarm.marker !== undefined) {
        report_alarm.marker.setMap(null);
    }
    if (report_alarm.marker_start !== undefined) {
        report_alarm.marker_start.setMap(null);
    }
    if (report_alarm.marker_stop !== undefined) {
        report_alarm.marker_stop.setMap(null);
    }
    if (report_alarm.markersPark) {
        for (var i in report_alarm.markersPark) {
            if (report_alarm.markersPark[i] !== undefined) {
                report_alarm.markersPark[i].setMap(null);
            }
        }
        report_alarm.markersPark = [];
    }
    if (report_alarm.markersAlarm) {
        for (var i in report_alarm.markersAlarm) {
            if (report_alarm.markersAlarm[i] !== undefined) {
                report_alarm.markersAlarm[i].setMap(null);
            }
        }
        report_alarm.markersAlarm = [];
    }
    if (report_alarm.trips) {
        report_alarm.trips = [];
        report_alarm.trips.length = 0;
    }
    if (report_alarm.alarms) {
        report_alarm.alarms = [];
        report_alarm.alarms.length = 0;
    }
    report_alarm.datagrid.datagrid('loadData', {"total": 0, "rows": []});
    $("#tbl_trip_park").datagrid('loadData', {"total": 0, "rows": []});
    $("#tbl_trip_alarm").datagrid('loadData', {"total": 0, "rows": []});

};
report_alarm.trip_move = function (move) {
    switch (move) {
        case 'first':
            report_alarm.tripIndex = 0;
            break;
        case 'prev':
            if (report_alarm.tripIndex > 0) {
                report_alarm.tripIndex--;
            }
            break;
        case 'next':
            if (report_alarm.tripIndex < (report_alarm.trips.length - 1)) {
                report_alarm.tripIndex++;
            }
            break;
        case 'last':
            report_alarm.tripIndex = report_alarm.trips.length - 1;
            break;
    }
    report_alarm.datagrid.datagrid('scrollTo', report_alarm.tripIndex);
    report_alarm.datagrid.datagrid('highlightRow', report_alarm.tripIndex);
    var track = report_alarm.trips[tripIndex];

    var currLatLng = new google.maps.LatLng(track.lat, track.lng);
    report_alarm.marker.setIcon(report_alarm.create_icon(0, track));
    report_alarm.marker.setPosition(currLatLng);
    report_alarm.map.setCenter(currLatLng);

    if (report_alarm.iw !== undefined)
    {
        var content = "<div>Event:" + format_alarm(track.alarm_id) + "</br>";
        content += "Date:" + track.tdate + "</br>";
        content += "Speed:" + track.speed + " Km/jam</br>";
        content += "Lat:" + track.lat + "</br>";
        content += "Lng:" + track.lng + "</br>";
        content += "Poi:" + track.poi + "</br>";
        content += "Address:" + track.address + "</div>";
        if (report_alarm.iw !== undefined) {
            report_alarm.iw.setContent(content);
            report_alarm.iw.setPosition(currLatLng);
        }

    }
};
report_alarm.process_park = function (temps) {

};
report_alarm.download_excel = function () {
    report_alarm.get_data_form();
    window.location = "report/report_alarm_excel.php?vh_id=" + report_alarm.params.vh_id + "&nopol=" + report_alarm.params.nopol + "&from=" + report_alarm.params.from + "&to=" + report_alarm.params.to;
    return;
};
report_alarm.download = function () {
    console.log("alarm-report");
    report_alarm.clear_trip();
    report_alarm.init_trip();
    report_alarm.get_data_form();

    var batasTimeout = 1000 * 60 * 15;
    var alarms = [];

    //  var temp;
    //  var currIndex = 0;
    var total = 0;
    $.messager.progress({title: 'Download Alarm', msg: 'Silahkan Ditunggu...'});
    report_alarm.xhr = $.ajax({
        url: 'report/report_alarm.php',
        type: 'POST',
        dataType: 'json',
        timeout: batasTimeout,
        data: report_alarm.params,
        success: function (result) {
            console.log(result);
            total = parseInt(result.total, 10);
            if (total <= 0) {
                $.messager.progress('close');
                alert('Data Kosong');
            }

            var data = result.rows;
            for (var i in data) {
                var item = data[i];
                item.acc = parseInt(item.acc, 10);//item.speed >= 5 ? 1 : 0;
                item['status'] = item.acc === 0 ? 'on' : 'off';
                item.speed = parseInt(item.speed, 10);
                item.alarm = parseInt(item.alarm, 10);
                item.angle = parseInt(item.angle);
                item.lat = parseFloat(item.lat);
                item.lng = parseFloat(item.lng);
                item['park'] = '';

                alarms.push(item);
                report_alarm.markersPark.push(report_alarm.create_marker('icon/alarm.gif', item));
            }

            report_alarm.datagrid.datagrid({nowrap: false, fitColumns: false, loadFilter: pagerFilter}).datagrid('loadData', alarms);
            $.messager.progress('close');
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
report_alarm.get_data_form = function () {
    console.log('get_data_form');
    report_alarm.params.rand = Math.random();
    report_alarm.params.vh_id = $("#cboGps").combobox('getValue');
    report_alarm.params.nopol = $("#cboGps").combobox('getText');
    report_alarm.params.from = $("#alarm_fdate").datebox('getValue') + " " + $("#alarm_ftime").timespinner('getValue');
    report_alarm.params.to = $("#alarm_tdate").datebox('getValue') + " " + $("#alarm_ttime").timespinner('getValue');
    console.log(report_alarm.params);
};
var icon_type = [''];
report_alarm.create_icon = function (track)
{

    var object_type = 'mobil';
    if (object_type != 'mobile' && object_type != 'motor') {
        object_type = 'mobil';
    }
    var image = {
        url: 'icon/gps/' + object_type + '/' + track.status + '_0.png?v=1.0.0',
        // This marker is 20 pixels wide by 32 pixels tall.
        size: new google.maps.Size(20, 41),
        // The origin for this image is 0,0.
        //origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at 0,32.
        anchor: new google.maps.Point(0, 32)
    };


    if ((track.angle >= 337.0) || ((track.angle >= 0.0) && (track.angle <= 22.0))) {
        image.url = 'icon/gps/' + object_type + '/' + track.status + '_0.png?v=1.0.0';
        image.size = new google.maps.Size(20, 41);
        image.anchor = new google.maps.Point(10, 20);
    } else if ((track.angle >= 22.0) && (track.angle <= 67.0)) {
        image.url = 'icon/gps/' + object_type + '/' + track.status + '_45.png?v=1.0.0';
        image.size = new google.maps.Size(41, 41);
        image.anchor = new google.maps.Point(20, 20);
    } else if ((track.angle >= 67.0) && (track.angle <= 112.0)) {
        image.url = 'icon/gps/' + object_type + '/' + track.status + '_90.png?v=1.0.0';
        image.size = new google.maps.Size(41, 20);
        image.anchor = new google.maps.Point(20, 10);
    } else if ((track.angle >= 112.0) && (track.angle <= 157.0)) {
        image.url = 'icon/gps/' + object_type + '/' + track.status + '_135.png?v=1.0.0';
        image.size = new google.maps.Size(41, 41);
        image.anchor = new google.maps.Point(20, 20);
    } else if ((track.angle >= 157.0) && (track.angle <= 202.0)) {
        image.url = 'icon/gps/' + object_type + '/' + track.status + '_180.png?v=1.0.0';
        image.size = new google.maps.Size(20, 41);
        image.anchor = new google.maps.Point(10, 20);
    } else if ((track.angle >= 202.0) && (track.angle <= 247.0)) {
        image.url = 'icon/gps/' + object_type + '/' + track.status + '_225.png?v=1.0.0';
        image.size = new google.maps.Size(41, 41);
        image.anchor = new google.maps.Point(20, 20);
    } else if ((track.angle >= 247.0) && (track.angle <= 292.0)) {
        image.url = 'icon/gps/' + object_type + '/' + track.status + '_270.png?v=1.0.0';
        image.size = new google.maps.Size(41, 20);
        image.anchor = new google.maps.Point(20, 10);
    } else if ((track.angle >= 292.0) && (track.angle <= 337.0)) {
        image.url = 'icon/gps/' + object_type + '/' + track.status + '_315.png?v=1.0.0';
        image.size = new google.maps.Size(41, 41);
        image.anchor = new google.maps.Point(20, 20);
    }
    // console.log(image.url);
    return image.url;
};
report_alarm.create_marker = function (image, track) {
    var icon = image === '' ? report_alarm.create_icon(track) : image;
    var m = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(track.lat), parseFloat(track.lng)),
        optimized: false,
        map: report_alarm.map,
        icon: icon
    });

    var content=  "<table >";
    if (image === '') {
        content += "<tr><td>Date</td><td>:</td><td>" + track.tdate + "</td></tr>";
        content += "<tr><td>Speed</td><td>:</td><td>" + track.speed + " Km/h</td></tr>";
    } else if (image === 'icon/park.png') {
        content += "<tr><td>Start Park</td><td>:</td><td>" + track.tdate + "</td></tr>";
        content += "<tr><td>End Park</td><td>:</td><td>" + track.tdate2 + "</td></tr>";
        content += "<tr><td>Durasi</td><td>:</td><td>" + track.park + "</td></tr>";
    } else if (image === 'icon/alarm.gif') {
        content += "<tr><td>Alarm</td><td>:</td><td>" + format_alarm(track.alarm) + "</td></tr>";
    }
    content += "<tr><td>Lat/Lng</td><td>:</td><td>" + track.lat + "/" + track.lng + "</td></tr>";
    content += "<tr><td>Address</td><td>:</td><td>" + track.address + "</td></tr>";

    content += "</table>";
    google.maps.event.addListener(m, 'click', function () {
        if (report_alarm.iw === undefined) {
            report_alarm.iw = new google.maps.InfoWindow();
        }
        report_alarm.iw.setContent(content);
        report_alarm.iw.open(report_alarm.map, m);
    });
    return m;
};
zoom_alarm = function (id) {

};