var params = {
    vh_id: 0,
    nopol: '',
    from: '',
    to: ''
};
var report_hour = {
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
report_hour.init = function () {
    report_hour.datagrid = $("#tbl_hour");
};
report_hour.download_excel = function () {
    report_hour.get_data_form();
    window.location = "report/report_hour_excel.php?vh_id=" + report_hour.params.vh_id + "&nopol=" + report_hour.params.nopol + "&from=" + report_hour.params.from + "&to=" + report_hour.params.to;
    return;
};
report_hour.clear_trip=function(){
    report_hour.datagrid.datagrid('loadData',[]);
    report_hour.datagrid.datagrid('loadData', {"total": 0, "rows": []});
};
report_hour.download = function () {
    console.log("hour-report");
    report_hour.clear_trip();
    report_hour.get_data_form();
    var batasTimeout = 1000 * 60 * 15;
    var total = 0;
    $.messager.progress({title: 'Download Data..', msg: 'Silahkan Ditunggu...'});
    report_hour.xhr = $.ajax({
        url: 'report/report_hour.php',
        type: 'POST',
        dataType: 'json',
        timeout: batasTimeout,
        data: report_hour.params,
        success: function (result) {
            console.log(result);
            $.messager.progress('close');
            if (parseInt(result.total, 10) <= 0) {
                $.messager.progress('close');
                alert('Data Kosong');
                return;
            }
            report_hour.datagrid.datagrid({nowrap: false, fitColumns: false, loadFilter: pagerFilter}).datagrid('loadData', result);

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
report_hour.get_data_form = function () {
    console.log('get_data_form');
    report_hour.params.rand = Math.random();
    report_hour.params.vh_id = $("#cboGps").combobox('getValue');
    report_hour.params.nopol = $("#cboGps").combobox('getText');
    report_hour.params.from = $("#hour_fdate").datebox('getValue') + " " + $("#hour_ftime").timespinner('getValue');
    report_hour.params.to = $("#hour_tdate").datebox('getValue') + " " + $("#hour_ttime").timespinner('getValue');
    console.log(report_hour.params);
};
