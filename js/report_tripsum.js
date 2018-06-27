var params = {
    vh_id: 0,
    nopol: '',
    from: '',
    to: ''
};
var icon_park = 'images/park.png';
var icon_car_on = '';
var report_tripsum = {
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
report_tripsum.init = function () {
    delete report_tripsum.map;
    delete report_tripsum.iw;
    delete report_tripsum.polyline;
    delete report_tripsum.marker;
    delete report_tripsum.marker_start;
    delete report_tripsum.marker_stop;

    delete report_tripsum.datagrid;
    delete report_tripsum.xhr;
    report_tripsum.datagrid = $("#tbl_tripsum");
   
};
report_tripsum.init_trip = function () {
    report_tripsum.trips = [];
    report_tripsum.trips.length = 0;
};
report_tripsum.start_trip = function () {
    $("#btnPlay").hide();
    $("#btnPause").show();
    $("#btnStop").show();
    report_tripsum.play();
};
wait = function (ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
};
report_tripsum.play = function () {
    if (report_tripsum.timer) {
        clearTimeout(report_tripsum.timer);
    }
    if (report_tripsum.tripIndex >= report_tripsum.trips.length) {
        alert('Finish');
        return;
    }
    if (report_tripsum.changePage === true) {
        timer = setTimeout(function () {
            var pager = report_tripsum.datagrid.datagrid("getPager");
            pager.pagination('select', ++report_tripsum.pageNumber);
            report_tripsum.rowIndex = 0;
            report_tripsum.changePage = false;
            report_tripsum.datagrid.datagrid('selectRow', report_tripsum.rowIndex).datagrid('highlightRow', report_tripsum.rowIndex);
            report_tripsum.play();
        }, 10);
        return;
    }
    var currTrack = report_tripsum.trips[report_tripsum.tripIndex++];
    var latlng = new google.maps.LatLng(currTrack.lat, currTrack.lng);

    report_tripsum.marker.setIcon(report_tripsum.create_icon(currTrack));
    report_tripsum.marker.setPosition(latlng);
    report_tripsum.map.setCenter(latlng);

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

    if (report_tripsum.iw != undefined) {
        report_tripsum.iw.setContent(info);
    }
    if (report_tripsum.rowIndex < (report_tripsum.pageSize - 1)) { //rowIndex 4 adalah baris ke 5 karena baris diawali dari 0
        report_tripsum.datagrid.datagrid('selectRow', report_tripsum.rowIndex).datagrid('highlightRow', report_tripsum.rowIndex);
        report_tripsum.rowIndex++;
    } else if (report_tripsum.rowIndex == (report_tripsum.pageSize - 1)) {
        report_tripsum.datagrid.datagrid('selectRow', report_tripsum.rowIndex).datagrid('highlightRow', report_tripsum.rowIndex);
        report_tripsum.rowIndex = 0;
        report_tripsum.changePage = true;
    }
    if (currTrack.park === '') {
        report_tripsum.timer = setTimeout('trip_report.play();', report_tripsum.tripSpeed);
    } else {
        report_tripsum.timer = setTimeout('trip_report.play();', 3000);
    }
};
report_tripsum.pause = function () {
    clearTimeout(report_tripsum.timer);
    report_tripsum.paused = true;
    $("#btnPlay").show();
    $("#btnPause").hide();
    $("#btnStop").show();
};
report_tripsum.stop = function () {
    clearTimeout(report_tripsum.timer);
    report_tripsum.tripIndex = 0;
    report_tripsum.rowIndex = 0;
    report_tripsum.pageNumber = 1;
    $("#btnPlay").show();
    $("#btnPause").hide();
    $("#btnStop").hide();
    var pager = report_tripsum.datagrid.datagrid("getPager");
    pager.pagination('select', report_tripsum.pageNumber);
    report_tripsum.datagrid.datagrid('scrollTo', report_tripsum.rowIndex).datagrid('selectRow', report_tripsum.rowIndex);
};
report_tripsum.clear_trip = function () {
    if (report_tripsum.xhr) {
        report_tripsum.xhr.abort();
    }
   
    report_tripsum.datagrid.datagrid('loadData', {"total": 0, "rows": []});

};
report_tripsum.trip_move = function (move) {
    switch (move) {
        case 'first':
            report_tripsum.tripIndex = 0;
            break;
        case 'prev':
            if (report_tripsum.tripIndex > 0) {
                report_tripsum.tripIndex--;
            }
            break;
        case 'next':
            if (report_tripsum.tripIndex < (report_tripsum.trips.length - 1)) {
                report_tripsum.tripIndex++;
            }
            break;
        case 'last':
            report_tripsum.tripIndex = report_tripsum.trips.length - 1;
            break;
    }
    report_tripsum.datagrid.datagrid('scrollTo', report_tripsum.tripIndex);
    report_tripsum.datagrid.datagrid('highlightRow', report_tripsum.tripIndex);
    var track = report_tripsum.trips[tripIndex];

    var currLatLng = new google.maps.LatLng(track.lat, track.lng);
    report_tripsum.marker.setIcon(report_tripsum.create_icon(0, track));
    report_tripsum.marker.setPosition(currLatLng);
    report_tripsum.map.setCenter(currLatLng);

    if (report_tripsum.iw !== undefined)
    {
        var content = "<div>Event:" + format_alarm(track.alarm_id) + "</br>";
        content += "Date:" + track.tdate + "</br>";
        content += "Speed:" + track.speed + " Km/jam</br>";
        content += "Lat:" + track.lat + "</br>";
        content += "Lng:" + track.lng + "</br>";
        content += "Poi:" + track.poi + "</br>";
        content += "Address:" + track.address + "</div>";
        if (report_tripsum.iw !== undefined) {
            report_tripsum.iw.setContent(content);
            report_tripsum.iw.setPosition(currLatLng);
        }

    }
};
report_tripsum.process_park = function (temps) {

};
report_tripsum.download_excel = function () {
    report_tripsum.get_data_form();
    window.location = "report/report_trip_excel.php?vh_id=" + report_tripsum.params.vh_id + "&nopol=" + report_tripsum.params.nopol + "&from=" + report_tripsum.params.from + "&to=" + report_tripsum.params.to;
    return;
};
report_tripsum.download = function () {
    console.log("trip_report2");
    report_tripsum.clear_trip();
    report_tripsum.init_trip();
    report_tripsum.get_data_form();

    
    var total = 0;
    $.messager.progress({title: 'Download Data..', msg: 'Please Wait Downloading Data....'});
    report_tripsum.xhr = $.ajax({
        url: 'report/report_trip_summary.php',
        type: 'POST',
        dataType: 'json',
        data: report_tripsum.params,
        success: function (result) {
            total = parseInt(result.total, 10);
            if (total <= 0) {
                $.messager.progress('close');
                alert('Data Kosong');
            }
            for (var i in result.rows) {
                report_tripsum.trips.push(result.rows[i]);
            }
            report_tripsum.datagrid.datagrid({nowrap: false, fitColumns: false, loadFilter: pagerFilter}).datagrid('loadData', report_tripsum.trips);

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
report_tripsum.get_data_form = function () {
    console.log('get_data_form');
    report_tripsum.params.rand = Math.random();
    report_tripsum.params.vh_id = $("#cboGps").combobox('getValue');
    report_tripsum.params.nopol = $("#cboGps").combobox('getText');
    report_tripsum.params.from = $("#tripsum_fdate").datebox('getValue') + " " + $("#tripsum_ftime").timespinner('getValue');
    report_tripsum.params.to = $("#tripsum_tdate").datebox('getValue') + " " + $("#tripsum_ttime").timespinner('getValue');
    console.log(report_tripsum.params);
};
