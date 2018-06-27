var params = {
    vh_id: 0,
    nopol: '',
    from: '',
    to: '',
    pricebbm:0,
    distperliter:0
};
var icon_park = 'images/park.png';
var icon_car_on = '';
var report_trip = {
    map: null,
    polyline: null,
    marker: null,
    marker_start: null,
    marker_stop: null,
    markersPark: [],
    markersAlarm: [],
    trips: [],
    alarms: [],
    paused: false,
    changePage: false,
    timer: 0,
    tripSpeed: 500,
    xhr: null,
    pageSize: 10,
    tripIndex: 0,
    rowIndex: 0,
    pageNumber: 0,
    iw: null,
    panelPlayback: null,
    panelGrid: null,
    panelSummary: null,
    datagrid: null,
    params: params
};
report_trip.init = function () {
    console.log('report_trip.init')
    delete report_trip.map;
    delete report_trip.iw;
    delete report_trip.polyline;
    delete report_trip.marker;
    delete report_trip.marker_start;
    delete report_trip.marker_stop;
    delete report_trip.datagrid;
    delete report_trip.xhr;

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
    report_trip.map = new google.maps.Map(document.getElementById('map_trip'), mapOptions);
    console.log('init map')
    report_trip.datagrid = $("#tbl_trip");
    report_trip.datagrid.datagrid({
        onClickRow:function(index,row) {
            if(report_trip.map==null || report_trip.map==undefined) return;
            var latlng = new google.maps.LatLng(parseFloat(row.lat), parseFloat(row.lng));
            report_trip.map.setCenter(latlng);
            report_trip.map.setZoom(18);
            if (report_trip.marker != null) {
                report_trip.marker.setPosition(latlng);
                var iwContent=report_trip.create_iw_content('',row);
                if (report_trip.iw === undefined) {
                    report_trip.iw = new google.maps.InfoWindow();
                }
                report_trip.iw.setContent(iwContent);
                report_trip.iw.open(report_trip.map, report_trip.marker);
            }
        }
    });
    var pager = report_trip.datagrid.datagrid('getPager');
    if (pager !== null) {
        pager.pagination({
            onChangePageSize: function (pageSize) {
                report_trip.pageSize = pageSize;
            }
        });
    }
    $("#tbl_trip_alarm").datagrid({
        onClickRow: function (index, row) {

            var latlng = new google.maps.LatLng(row.lat, row.lng);
            report_trip.map.setCenter(latlng);
            report_trip.map.setZoom(18);
            var marker = report_trip.markersAlarm[row.index_alarm];
            if (marker !== undefined) {
                google.maps.event.trigger(marker, 'click');
            }
        }
    });
    $("#tabsTrip").tabs({
        tools: [{
                id: 'btnPlay',
                iconCls: 'icon-pb_play',
                text: 'Play',
                handler: function () {
                    report_trip.paused = false;
                    report_trip.play();
                    
                }
            }, {
                id: 'btnPause',
                iconCls: 'icon-pb_pause',
                text: 'Pause',
                handler: function () {
                    report_trip.pause();
                }
            }, {
                id: 'btnStop',
                iconCls: 'icon-pb_stop',
                text: 'Pause',
                handler: function () {
                    report_trip.stop();
                }
            }, {
                text: 'Close',
                iconCls: 'layout-button-down',
                handler: function () {
                    $('#tripLayout').layout('collapse', 'south');
                }
            }]
    });
}
;
report_trip.init_trip = function () {
    report_trip.trips = [];
    report_trip.trips.length = 0;
    //Init Polyline
    if (report_trip.polyline !== undefined) {
        report_trip.polyline.setMap(null);
    }
    report_trip.polyline = new google.maps.Polyline({
        strokeColor: "#80ff00",
        strokeOpacity: 0.8,
        strokeWeight: 5
    });
    report_trip.polyline.setMap(report_trip.map);
    report_trip.tripIndex = 0;
    report_trip.tripSpeed = 500;
    report_trip.pageNumber = 1;
    report_trip.rowIndex = 0;
    if (report_trip.marker !== undefined) {
        report_trip.marker.setMap(null);
    }
};
report_trip.start_trip = function () {
    $("#btnPlay").hide();
    $("#btnPause").show();
    $("#btnStop").show();
    report_trip.play();
};
wait = function (ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
};
report_trip.play = function () {
    if (report_trip.timer) {
        clearTimeout(report_trip.timer);
    }
    if (report_trip.tripIndex >= report_trip.trips.length) {
        alert('Finish');
        return;
    }
    if (report_trip.changePage === true) {
        timer = setTimeout(function () {
            var pager = report_trip.datagrid.datagrid("getPager");
            pager.pagination('select', ++report_trip.pageNumber);
            report_trip.rowIndex = 0;
            report_trip.changePage = false;
            report_trip.datagrid.datagrid('selectRow', report_trip.rowIndex).datagrid('highlightRow', report_trip.rowIndex);
            report_trip.play();
        }, 10);
        return;
    }
    var currTrack = report_trip.trips[report_trip.tripIndex++];
    var latlng = new google.maps.LatLng(currTrack.lat, currTrack.lng);

    report_trip.marker.setIcon(report_trip.create_icon(currTrack));
    report_trip.marker.setPosition(latlng);
    report_trip.map.setCenter(latlng);

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

    if (report_trip.iw != undefined) {
        report_trip.iw.setContent(info);
    }
    if (report_trip.rowIndex < (report_trip.pageSize - 1)) { //rowIndex 4 adalah baris ke 5 karena baris diawali dari 0
        report_trip.datagrid.datagrid('selectRow', report_trip.rowIndex).datagrid('highlightRow', report_trip.rowIndex);
        report_trip.rowIndex++;
    } else if (report_trip.rowIndex == (report_trip.pageSize - 1)) {
        report_trip.datagrid.datagrid('selectRow', report_trip.rowIndex).datagrid('highlightRow', report_trip.rowIndex);
        report_trip.rowIndex = 0;
        report_trip.changePage = true;
    }
    if (currTrack.park === '') {
        report_trip.timer = setTimeout('report_trip.play();', report_trip.tripSpeed);
    } else {
        report_trip.timer = setTimeout('report_trip.play();', 3000);
    }
};
report_trip.pause = function () {
    clearTimeout(report_trip.timer);
    report_trip.paused = true;
    $("#btnPlay").show();
    $("#btnPause").hide();
    $("#btnStop").show();
};
report_trip.stop = function () {
    clearTimeout(report_trip.timer);
    report_trip.tripIndex = 0;
    report_trip.rowIndex = 0;
    report_trip.pageNumber = 1;
    $("#btnPlay").show();
    $("#btnPause").hide();
    $("#btnStop").hide();
    var pager = report_trip.datagrid.datagrid("getPager");
    pager.pagination('select', report_trip.pageNumber);
    report_trip.datagrid.datagrid('scrollTo', report_trip.rowIndex).datagrid('selectRow', report_trip.rowIndex);
};
report_trip.clear_trip = function () {
    if (report_trip.xhr) {
        report_trip.xhr.abort();
    }
    if (report_trip.polyline !== undefined) {
        report_trip.polyline.setMap(null);
        report_trip.tripIndex = 0;
        report_trip.pageNumber = 1;
        report_trip.tripSpeed = 500;
    }

    if (report_trip.marker !== undefined) {
        report_trip.marker.setMap(null);
    }
    if (report_trip.marker_start !== undefined) {
        report_trip.marker_start.setMap(null);
    }
    if (report_trip.marker_stop !== undefined) {
        report_trip.marker_stop.setMap(null);
    }
    if (report_trip.markersPark) {
        for (var i in report_trip.markersPark) {
            if (report_trip.markersPark[i] !== undefined) {
                report_trip.markersPark[i].setMap(null);
            }
        }
        report_trip.markersPark = [];
    }
    if (report_trip.markersAlarm) {
        for (var i in report_trip.markersAlarm) {
            if (report_trip.markersAlarm[i] !== undefined) {
                report_trip.markersAlarm[i].setMap(null);
            }
        }
        report_trip.markersAlarm = [];
    }
    if (report_trip.trips) {
        report_trip.trips = [];
        report_trip.trips.length = 0;
    }
    if (report_trip.alarms) {
        report_trip.alarms = [];
        report_trip.alarms.length = 0;
    }
    report_trip.datagrid.datagrid('loadData', {"total": 0, "rows": []});
    $("#tbl_trip_park").datagrid('loadData', {"total": 0, "rows": []});
    $("#tbl_trip_alarm").datagrid('loadData', {"total": 0, "rows": []});

};
report_trip.trip_move = function (move) {
    switch (move) {
        case 'first':
            report_trip.tripIndex = 0;
            break;
        case 'prev':
            if (report_trip.tripIndex > 0) {
                report_trip.tripIndex--;
            }
            break;
        case 'next':
            if (report_trip.tripIndex < (report_trip.trips.length - 1)) {
                report_trip.tripIndex++;
            }
            break;
        case 'last':
            report_trip.tripIndex = report_trip.trips.length - 1;
            break;
    }
    report_trip.datagrid.datagrid('scrollTo', report_trip.tripIndex);
    report_trip.datagrid.datagrid('highlightRow', report_trip.tripIndex);
    var track = report_trip.trips[tripIndex];

    var currLatLng = new google.maps.LatLng(track.lat, track.lng);
    report_trip.marker.setIcon(report_trip.create_icon(0, track));
    report_trip.marker.setPosition(currLatLng);
    report_trip.map.setCenter(currLatLng);

    if (report_trip.iw !== undefined)
    {
        var content = "<div>Event:" + format_alarm(track.alarm_id) + "</br>";
        content += "Date:" + track.tdate + "</br>";
        content += "Speed:" + track.speed + " Km/jam</br>";
        content += "Lat:" + track.lat + "</br>";
        content += "Lng:" + track.lng + "</br>";
        content += "Poi:" + track.poi + "</br>";
        content += "Address:" + track.address + "</div>";
        if (report_trip.iw !== undefined) {
            report_trip.iw.setContent(content);
            report_trip.iw.setPosition(currLatLng);
        }

    }
};
report_trip.process_park = function (temps) {

};
report_trip.download_excel = function () {
    report_trip.get_data_form();
    window.location = "report/report_trip_excel.php?vh_id=" + report_trip.params.vh_id + "&nopol=" + report_trip.params.nopol + "&from=" + report_trip.params.from + "&to=" + report_trip.params.to;
    return;
};
report_trip.download = function () {
    console.log("trip_report2");
    report_trip.clear_trip();
    report_trip.init_trip();
    report_trip.get_data_form();

    var batasTimeout = 1000 * 60 * 15;
    var batas_parkir = 1000 * 600;
    var dist = 0;
    var speedTotal = 0;
    var speedCount = 0;
    var totalOff = 0;
    var avgSpeed = 0;
    var no = -1;
    var first = true;
    var temps = [];
    var parks = [];

    //  var temp;
    var currIndex = 0;
    var total = 0;
    $.messager.progress({title: 'Download Data..', msg: 'Please Wait Downloading Data....'});
    var indexAlarm = 0;
    report_trip.xhr = $.ajax({
        url: 'report/report_trip.php',
        type: 'POST',
        dataType: 'json',
        timeout: batasTimeout,
        data: report_trip.params,
        success: function (result) {
            total = parseInt(result.total, 10);
            if (total <= 0) {
                $.messager.progress('close');
                alert('Data Kosong');
            }
            //console.log(result.data);
            //console.log(result.sql !== undefined ? result.sql : 'not sql debug');
            var is_park = false;
            var data = result.data;
            for (var i in data) {
                currIndex++;

                var item = data[i];
                item.acc = parseInt(item.acc, 10);//item.speed >= 5 ? 1 : 0;
                item['status'] = item.acc === 0 ? 'on' : 'off';
                item.speed = parseInt(item.speed, 10);
                item.alarm = parseInt(item.alarm, 10);
                item.angle = parseInt(item.angle);
                item.lat = parseFloat(item.lat);
                item.lng = parseFloat(item.lng);
                item['park'] = '';

                if (item.speed >= 5) {
                    speedTotal += item.speed;
                    speedCount++;
                }
                if (item.alarm > 0) {
                    item['index_alarm'] = indexAlarm++;
                    report_trip.alarms.push(item);
                    report_trip.markersAlarm.push(report_trip.create_marker('icon/alarm.gif', item));
                }
                if (first === false) {
                    if (item.speed >= 5) {
                        if (is_park === true) {
                            is_park = false;
                            var processed = false;
                            if (temps.length >= 2) {
                                var ms = calcDiffMs(temps[0].tdate, temps[temps.length - 1].tdate);
                                if (ms >= batas_parkir) {
                                    totalOff += ms;
                                    temps[0]['status'] = 'off';
                                    temps[0]['tdate2'] = temps[temps.length - 1].tdate;
                                    temps[0]['park'] = msToTime(ms);
                                    parks.push(temps[0]);
                                    report_trip.trips.push(temps[0]);
                                    report_trip.markersPark.push(report_trip.create_marker('icon/park.png', temps[0]));
                                    processed = true;
                                }
                            }
                            if (processed === false) {
                                while (temps.length > 0) {
                                    var temp = temps.shift();
                                    temp.acc = 1;
                                    temp.status = 'on';
                                    report_trip.trips.push(temp);
                                }
                            }
                            while (temps.pop()) {
                            }
                        }
                        item['status'] = 'on';
                        item['acc'] = 1;
                        report_trip.trips.push(item);
                    } else {
                        //start park
                        item['status'] = parseInt(item['acc'], 10) === 1 ? 'on' : 'off';
                        temps.push(item);
                        is_park = true;
                    }
                } else {
                    first = false;
                    if (item.speed >= 5) {
                        item['status'] = 'on';
                        report_trip.trips.push(item);
                    } else {
                        is_park = true;
                        item['status'] = parseInt(item['acc'], 10) === 1 ? 'on' : 'off';
                        temps.push(item);
                    }
                }
            }

            if (is_park === true) {
                is_park = false;
                var processed = false;
                if (temps.length >= 2) {
                    var ms = calcDiffMs(temps[0].tdate, temps[temps.length - 1].tdate);
                    if (ms >= batas_parkir) {
                        totalOff += ms;
                        temps[0]['status'] = 'off';
                        temps[0]['tdate2'] = temps[temps.length - 1].tdate;
                        temps[0]['park'] = msToTime(ms);
                        parks.push(temps[0]);
                        report_trip.trips.push(temps[0]);
                        report_trip.markersPark.push(report_trip.create_marker('icon/park.png', temps[0]));
                        processed = true;
                    }
                }
                if (processed === false) {
                    while (temps.length > 0) {
                        var temp = temps.shift();
                        temp.acc = 1;
                        temp.status = 'on';
                        report_trip.trips.push(temp);
                    }
                }
                while (temps.pop()) {
                }
            }
            //Hitung Total Waktu

            if (report_trip.trips.length > 0) {
                var totalTime = calcDiffMs(report_trip.trips[0].tdate, report_trip.trips[report_trip.trips.length - 1].tdate);
                var totalOn = totalTime - totalOff;
                for (var i in report_trip.trips) {
                    var t = report_trip.trips[i];
                    var path = report_trip.polyline.getPath();
                    path.push(new google.maps.LatLng(parseFloat(t.lat), parseFloat(t.lng)));
                }
                if (speedCount > 0) {
                    avgSpeed = speedTotal / speedCount;
                }
                dist = google.maps.geometry.spherical.computeLength(report_trip.polyline.getPath().getArray()) / 1000;
                
            }
            if (report_trip.trips.length >= 2) {
                report_trip.marker_start = report_trip.create_marker('icon/start.png?v=1.0.0', report_trip.trips[0]);
                report_trip.marker_stop = report_trip.create_marker('icon/stop.png?v=1.0.0', report_trip.trips[report_trip.trips.length - 1]);

            }
            //var distance2=distance.toFixed(2);
            var strStatistic = "<table>";
            strStatistic += "<tr><td>Kecepatan Rata-rata</td><td>:</td><td>" + avgSpeed.toFixed(2) + "Km/Jam</td></tr>";
            strStatistic += "<tr><td>Jarak Tempuh</td><td>:</td><td>" + dist.toFixed(2) + "Km</td></tr>";
            strStatistic += "<tr><td>Total On</td><td>:</td><td>" + msToTime(totalOn) + "</td></tr>";
            strStatistic += "<tr><td>Total Off</td><td>:</td><td>" + msToTime(totalOff) + "</td></tr>";
            strStatistic += "</table>";

            var biayaBBM=0;
            if( (parseInt(report_trip.params.pricePerliter)>0) && (parseInt(report_trip.params.distPerliter)>0)){
                biayaBBM=parseInt(((dist/report_trip.params.distPerliter) * report_trip.params.pricePerliter),10);
            }
            
            var literBBM=0;
            if( parseInt(report_trip.params.distPerliter)>0){
                literBBM=parseFloat(dist/report_trip.params.distPerliter);                        
            }
            //Update table Summary
            $("#tbl_trip_summary").datagrid('loadData', {
                total: 4,
                rows: [
                    {no: 1, descr: 'Jarak Tempuh', val: dist.toFixed(2) + "Km"},
                    {no: 2, descr: 'Biaya BBM', val: "Rp."+ biayaBBM},
                    {no: 3, descr: 'Konsumsi BBM', val: literBBM.toFixed(2) +" Liter"},
                    {no: 4, descr: 'Kecepatan Rata-Rata', val: avgSpeed.toFixed(2) + "Km/jam"},
                    {no: 5, descr: 'Total On', val: msToTime(totalOn)},
                    {no: 6, descr: 'Total Off', val: msToTime(totalOff)}
                ]});
            //trip_report.panelSummary.html(strStatistic);

            report_trip.datagrid.datagrid({nowrap: false, fitColumns: false, loadFilter: pagerFilter}).datagrid('loadData', report_trip.trips);
            if (parks.length > 0) {
                $("#tbl_trip_park").datagrid({nowrap: false, fitColumns: false, loadFilter: pagerFilter}).datagrid('loadData', parks);
            }
            if (report_trip.alarms.length > 0) {
                $("#tbl_trip_alarm").datagrid({nowrap: false, fitColumns: false, loadFilter: pagerFilter}).datagrid('loadData', report_trip.alarms);
            }
            //if available data history, create marker
            console.log("total data history:" + report_trip.trips.length);
            if (report_trip.trips.length > 0)
            {
                //Create Marker Playback
                report_trip.marker = report_trip.create_marker('', report_trip.trips[0]);
                report_trip.map.setCenter(report_trip.marker.getPosition());
                report_trip.map.setZoom(12);
            }
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
report_trip.isPlayback=function(){
    var loc=window.location.href;
    return loc.indexOf('playback.php')>0?true:false;
};
report_trip.get_data_form = function () {
if(report_trip.isPlayback()){
    report_trip.params.rand = Math.random();
    report_trip.params.vh_id = $("#vh_id").val();
    report_trip.params.nopol = $("#nopol").val();
    report_trip.params.from = $("#trip_fdate").datebox('getValue') + " " + $("#trip_ftime").timespinner('getValue');
    report_trip.params.to = $("#trip_tdate").datebox('getValue') + " " + $("#trip_ttime").timespinner('getValue');
}else{
    console.log('get_data_form');
    report_trip.params.rand = Math.random();
    report_trip.params.vh_id = $("#cboGps").combobox('getValue');
    report_trip.params.nopol = $("#cboGps").combobox('getText');
    report_trip.params.from = $("#trip_fdate").datebox('getValue') + " " + $("#trip_ftime").timespinner('getValue');
    report_trip.params.to = $("#trip_tdate").datebox('getValue') + " " + $("#trip_ttime").timespinner('getValue');
    report_trip.params.pricePerliter = $("#pricePerliter").textbox('getValue');
    report_trip.params.distPerliter = $("#distPerliter").textbox('getValue');
    }
    console.log(report_trip.params);
};
var icon_type = [''];
report_trip.create_icon = function (track)
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
report_trip.create_marker = function (image, track) {
    var icon = image === '' ? report_trip.create_icon(track) : image;
    var m = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(track.lat), parseFloat(track.lng)),
        map: report_trip.map,
        optimized: false,
        icon: icon
    });

    var iwContent=report_trip.create_iw_content(image,track);
    google.maps.event.addListener(m, 'click', function () {
        if (report_trip.iw === undefined) {
            report_trip.iw = new google.maps.InfoWindow();
        }
        report_trip.iw.setContent(iwContent);
        report_trip.iw.open(report_trip.map, m);
    });
    return m;
};

report_trip.create_iw_content=function(image,track){
    var iwContent = "<table >";
    if (image === '') {
        iwContent += "<tr><td>Date</td><td>:</td><td>" + track.tdate + "</td></tr>";
        iwContent += "<tr><td>Speed</td><td>:</td><td>" + track.speed + " Km/h</td></tr>";
    } else if (image === 'icon/park.png') {
        iwContent += "<tr><td>Start Park</td><td>:</td><td>" + track.tdate + "</td></tr>";
        iwContent += "<tr><td>End Park</td><td>:</td><td>" + track.tdate2 + "</td></tr>";
        iwContent += "<tr><td>Durasi</td><td>:</td><td>" + track.park + "</td></tr>";
    } else if (image === 'icon/alarm.gif') {
        iwContent += "<tr><td>Date</td><td>:</td><td>" + track.tdate + "</td></tr>";
        iwContent += "<tr><td>Speed</td><td>:</td><td>" + track.speed + " Km/Jam</td></tr>";
        iwContent += "<tr><td>Alarm</td><td>:</td><td>" + format_alarm(track.alarm) + "</td></tr>";
    }
    iwContent += "<tr><td>POI</td><td>:</td><td>" + track.poi + "</td></tr>";
    iwContent += "<tr><td>Address</td><td>:</td><td>" + track.address + "</td></tr>";
    iwContent += "<tr><td>Lat/Lng</td><td>:</td><td>" + track.lat + "/" + track.lng + "</td></tr>";

    iwContent += "</table>";
    return iwContent;
}
