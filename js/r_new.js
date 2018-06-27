/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var user_id = 0;
var vh_id = 0;
var tabsReport;
var cboUser;
var cboGps;
//download_page=function(file,title){
//  $.ajax({
//     url:'report/'+ file,
//     type:'post',
//     success:function(result){
//         tabsReport.tabs('add',{
//            title:title,
//            content:result,
//            closeable:true
//        });
//        report_trip.init();
//     }
//  });  
//};
init = function () {
    cboUser = $("#cboUser");
    cboGps = $("#cboGps");
    tabsReport = $("#tabsReport");
    tabsReport.tabs({
        onLoad: function (panel) {
            var opts = panel.panel('options');
            console.log(opts);
            var title = opts.title;
            switch (title) {
                case "Laporan Perjalanan":
                    report_trip.init();
                    break;
                case "Laporan Perjalanan(Ringkas)":
                    report_tripsum.init();
                    break;
                case "Laporan Jam Kerja":
                    report_hour.init();
                    break;
                case "Laporan Parkir":
                    report_park.init();
                    break;
                case "Laporan Alarm":
                    report_alarm.init();
                    break;
            }
        }
    });
    cboUser.combobox({
        onBeforeLoad: function (param) {
            $.messager.progress({title: 'Loading Data User', msg: 'Silahkan Ditunggu'});
        },
        onLoadSuccess: function () {
            var data = $("#cboUser").combobox('getData');
            //console.log(data);
            for (var i in data) {
                user_id = data[i].id;
                cboUser.combobox('setValue', user_id);
                cboGps.combobox('reload');
                break;
            }
            $.messager.progress('close');
        }, onError: function () {
            $.messager.progress('close');
        }, onSelect: function (rec) {
            user_id = rec.id;
            cboGps.combobox('reload');
        }
    });
    cboGps.combobox({
        onSelect: function (rec) {
        },
        onBeforeLoad: function (param) {

            param.user_id = user_id;
            console.log('Load GPS:' + user_id);
            $.messager.progress({title: 'Loading Data Gps', msg: 'Silahkan Ditunggu'});
        },
        onLoadSuccess: function () {
            $.messager.progress('close');
        }, onError: function () {
            $.messager.progress('close');
        }
    });
    //open_report('trip');
};
add_tab = function (title, file) {
    var panel = tabsReport.tabs('getTab', title);
    console.log(panel);
    if (panel === null) {
        tabsReport.tabs('add', {
            title: title,
            href: 'report/' + file,
            closable: true
        });
    }
    tabsReport.tabs('select', title);
};
open_report = function (report) {
    switch (report) {
        case 'trip':
            add_tab('Laporan Perjalanan', 'tab_trip.php?v=1.0.0');
            break;
        case 'tripsum':
            add_tab('Laporan Perjalanan(Ringkas)', 'tab_trip_summary.php?v=1.0.0');
            break;
        case 'hour':
            add_tab('Laporan Jam Kerja', 'tab_hour.php?v=1.0.0');
            break;
        case 'park':
            add_tab('Laporan Parkir', 'tab_park.php?v=1.0.0');
            break;
        case 'alarm':
            add_tab('Laporan Alarm', 'tab_alarm.php?v=1.0.0');
            break;
    }
};
$(document).ready(function () {
    if (google === undefined) {
        alert('Periksa Koneksi Internet Anda');
        return;
    }
    init();
    add_tab('Laporan Perjalanan','tab_trip.php');
});

