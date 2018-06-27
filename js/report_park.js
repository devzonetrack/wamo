var params = {
    vh_id: 0,
    nopol: '',
    from: '',
    to: ''
};
var icon_park = 'images/park.png';
var icon_car_on = '';
var report_park = {
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
report_park.init = function () {
    delete report_park.map;
    delete report_park.iw;
    delete report_park.polyline;
    delete report_park.marker;
    delete report_park.marker_start;
    delete report_park.marker_stop;

    delete report_park.datagrid;
    delete report_park.xhr;

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
    report_park.map = new google.maps.Map(document.getElementById('map_park'), mapOptions);
    report_park.datagrid = $("#tbl_park");
    report_park.datagrid.datagrid({
        onClickRow: function (index, row) {
            console.log(row);
            report_park.zoom(row.id);
        }
    });
};
report_park.zoom = function (id) {
    var m = report_park.markersPark[id];
    if (m === undefined)
        return;
    report_park.map.setZoom(18);
    report_park.map.setCenter(m.getPosition());
    google.maps.event.trigger(m, 'click');
};
report_park.init_trip = function () {
    report_park.trips = [];
    report_park.trips.length = 0;
    //Init Polyline
    if (report_park.polyline !== undefined) {
        report_park.polyline.setMap(null);
    }
    report_park.polyline = new google.maps.Polyline({
        strokeColor: "#80ff00",
        strokeOpacity: 0.8,
        strokeWeight: 5
    });
    report_park.polyline.setMap(report_park.map);
    report_park.tripIndex = 0;
    report_park.tripSpeed = 500;
    report_park.pageNumber = 1;
    report_park.rowIndex = 0;
    if (report_park.marker !== undefined) {
        report_park.marker.setMap(null);
    }
};
report_park.start_trip = function () {
    $("#btnPlay").hide();
    $("#btnPause").show();
    $("#btnStop").show();
    report_park.play();
};
wait = function (ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
};
report_park.play = function () {
    if (report_park.timer) {
        clearTimeout(report_park.timer);
    }
    if (report_park.tripIndex >= report_park.trips.length) {
        alert('Finish');
        return;
    }
    if (report_park.changePage === true) {
        timer = setTimeout(function () {
            var pager = report_park.datagrid.datagrid("getPager");
            pager.pagination('select', ++report_park.pageNumber);
            report_park.rowIndex = 0;
            report_park.changePage = false;
            report_park.datagrid.datagrid('selectRow', report_park.rowIndex).datagrid('highlightRow', report_park.rowIndex);
            report_park.play();
        }, 10);
        return;
    }
    var currTrack = report_park.trips[report_park.tripIndex++];
    var latlng = new google.maps.LatLng(currTrack.lat, currTrack.lng);

    report_park.marker.setIcon(report_park.create_icon(currTrack));
    report_park.marker.setPosition(latlng);
    report_park.map.setCenter(latlng);

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

    if (report_park.iw != undefined) {
        report_park.iw.setContent(info);
    }
    if (report_park.rowIndex < (report_park.pageSize - 1)) { //rowIndex 4 adalah baris ke 5 karena baris diawali dari 0
        report_park.datagrid.datagrid('selectRow', report_park.rowIndex).datagrid('highlightRow', report_park.rowIndex);
        report_park.rowIndex++;
    } else if (report_park.rowIndex == (report_park.pageSize - 1)) {
        report_park.datagrid.datagrid('selectRow', report_park.rowIndex).datagrid('highlightRow', report_park.rowIndex);
        report_park.rowIndex = 0;
        report_park.changePage = true;
    }
    if (currTrack.park === '') {
        report_park.timer = setTimeout('trip_report.play();', report_park.tripSpeed);
    } else {
        report_park.timer = setTimeout('trip_report.play();', 3000);
    }
};
report_park.pause = function () {
    clearTimeout(report_park.timer);
    report_park.paused = true;
    $("#btnPlay").show();
    $("#btnPause").hide();
    $("#btnStop").show();
};
report_park.stop = function () {
    clearTimeout(report_park.timer);
    report_park.tripIndex = 0;
    report_park.rowIndex = 0;
    report_park.pageNumber = 1;
    $("#btnPlay").show();
    $("#btnPause").hide();
    $("#btnStop").hide();
    var pager = report_park.datagrid.datagrid("getPager");
    pager.pagination('select', report_park.pageNumber);
    report_park.datagrid.datagrid('scrollTo', report_park.rowIndex).datagrid('selectRow', report_park.rowIndex);
};
report_park.clear_trip = function () {
    if (report_park.xhr) {
        report_park.xhr.abort();
    }

    if (report_park.markersPark) {
        for (var i in report_park.markersPark) {
            if (report_park.markersPark[i] !== undefined) {
                report_park.markersPark[i].setMap(null);
            }
        }
        report_park.markersPark = [];
    }

    if (report_park.trips) {
        report_park.trips = [];
        report_park.trips.length = 0;
    }
    report_park.datagrid.datagrid('loadData', {"total": 0, "rows": []});

};
report_park.trip_move = function (move) {
    switch (move) {
        case 'first':
            report_park.tripIndex = 0;
            break;
        case 'prev':
            if (report_park.tripIndex > 0) {
                report_park.tripIndex--;
            }
            break;
        case 'next':
            if (report_park.tripIndex < (report_park.trips.length - 1)) {
                report_park.tripIndex++;
            }
            break;
        case 'last':
            report_park.tripIndex = report_park.trips.length - 1;
            break;
    }
    report_park.datagrid.datagrid('scrollTo', report_park.tripIndex);
    report_park.datagrid.datagrid('highlightRow', report_park.tripIndex);
    var track = report_park.trips[tripIndex];

    var currLatLng = new google.maps.LatLng(track.lat, track.lng);
    report_park.marker.setIcon(report_park.create_icon(0, track));
    report_park.marker.setPosition(currLatLng);
    report_park.map.setCenter(currLatLng);

    if (report_park.iw !== undefined)
    {
        var content = "<div>Event:" + format_alarm(track.alarm_id) + "</br>";
        content += "Date:" + track.tdate + "</br>";
        content += "Speed:" + track.speed + " Km/jam</br>";
        content += "Lat:" + track.lat + "</br>";
        content += "Lng:" + track.lng + "</br>";
        content += "Poi:" + track.poi + "</br>";
        content += "Address:" + track.address + "</div>";
        if (report_park.iw !== undefined) {
            report_park.iw.setContent(content);
            report_park.iw.setPosition(currLatLng);
        }

    }
};
report_park.process_park = function (temps) {

};
report_park.download_excel = function () {
    report_park.get_data_form();
    window.location = "report/report_park_excel.php?vh_id=" + report_park.params.vh_id + "&nopol=" + report_park.params.nopol + "&from=" + report_park.params.from + "&to=" + report_park.params.to;
    return;
};
report_park.download = function () {
    console.log("park_report");
    report_park.clear_trip();
    report_park.init_trip();
    report_park.get_data_form();

    var batasTimeout = 1000 * 60 * 15;
    //  var temp;
    var currIndex = 0;
    var total = 0;
    $.messager.progress({title: 'Download Data..', msg: 'Please Wait Downloading Data....'});
    report_park.xhr = $.ajax({
        url: 'report/report_park.php',
        type: 'POST',
        dataType: 'json',
        timeout: batasTimeout,
        data: report_park.params,
        success: function (result) {
            total = parseInt(result.total, 10);
            if (total <= 0) {
                $.messager.progress('close');
                alert('Data Kosong');
            }
            var index = 0;
            var data = result.rows;
            for (var i in data) {
                currIndex++;

                var item = data[i];
                item.id = index++;
                item.acc = parseInt(item.acc, 10);//item.speed >= 5 ? 1 : 0;
                item['status'] = item.acc === 0 ? 'on' : 'off';
                item.speed = parseInt(item.speed, 10);
                item.alarm = parseInt(item.alarm, 10);
                item.angle = parseInt(item.angle);
                item.lat = parseFloat(item.lat);
                item.lng = parseFloat(item.lng);
                report_park.markersPark[item.id] = report_park.create_marker('icon/park.png', item);
            }

            report_park.datagrid.datagrid({nowrap: false, fitColumns: false, loadFilter: pagerFilter}).datagrid('loadData', result);

            $.messager.progress('close');
            //$("#bottomLayout").layout('expand', 'south');
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
report_park.get_data_form = function () {
    console.log('get_data_form');
    report_park.params.rand = Math.random();
    report_park.params.vh_id = $("#cboGps").combobox('getValue');
    report_park.params.nopol = $("#cboGps").combobox('getText');
    report_park.params.from = $("#park_fdate").datebox('getValue') + " " + $("#park_ftime").timespinner('getValue');
    report_park.params.to = $("#park_tdate").datebox('getValue') + " " + $("#park_ttime").timespinner('getValue');
    console.log(report_park.params);
};
var icon_type = [''];
report_park.create_icon = function (track)
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
report_park.create_marker = function (image, track) {
    var icon = image === '' ? report_park.create_icon(track) : image;
    var m = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(track.lat), parseFloat(track.lng)),
        map: report_park.map,
        icon: icon
    });

    var contentIW = "<table >";
    if (image === '') {
        contentIW += "<tr><td>Date</td><td>:</td><td>" + track.tdate + "</td></tr>";
        contentIW += "<tr><td>Speed</td><td>:</td><td>" + track.speed + " Km/h</td></tr>";
    } else if (image === 'icon/park.png') {
        contentIW += "<tr><td>Start Park</td><td>:</td><td>" + track.tdate + "</td></tr>";
        contentIW += "<tr><td>End Park</td><td>:</td><td>" + track.tdate2 + "</td></tr>";
        contentIW += "<tr><td>Durasi</td><td>:</td><td>" + track.durasi + "</td></tr>";
    } else if (image === 'icon/alarm32.png') {
        contentIW += "<tr><td>Alarm</td><td>:</td><td>" + format_alarm(track.alarm) + "</td></tr>";
    }
    contentIW += "<tr><td>POI</td><td>:</td><td>" + track.poi + "</td></tr>";
    contentIW += "<tr><td>Address</td><td>:</td><td>" + track.address + "</td></tr>";
    contentIW += "<tr><td>Lat/Lng</td><td>:</td><td>" + track.lat + "/" + track.lng + "</td></tr>";

    contentIW += "</table>";
    google.maps.event.addListener(m, 'click', function () {
        if (report_park.iw === undefined) {
            report_park.iw = new google.maps.InfoWindow();
        }
        report_park.iw.setContent(contentIW);
        report_park.iw.open(report_park.map, m);
    });
    return m;
};