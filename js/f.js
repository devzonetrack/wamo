function create_date() {
    var offset = 7;
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000 * offset));
    return nd;
}
/* Date Object to YYYY-mm-dd HH:nn:ss*/
function datetimeFromString(d) {
    if (d !== undefined) {
        var p = d.split(' ');
        var q = p[0].split('-');
        var r = p[1].split(':');
        return new Date(q[0], q[1] - 1, q[2], r[0], r[1], r[2]);
    } else {
        return new Date();
    }
}
function dateFromString(d)
{
    var q = d.split('-');
    return new Date(q[0], q[1] - 1, q[2]);
}
function addZero(val)
{
    var tmp = val;
    if (val <= 9)
        tmp = "0" + val;
    return tmp;
}
function datetimeToString(d) {
    var dateStr = d.getFullYear() + "-"
            + addZero(d.getMonth() + 1) + "-"
            + addZero(d.getDate()) + " "
            + addZero(d.getHours()) + ":"
            + addZero(d.getMinutes()) + ":"
            + addZero(d.getSeconds());
    return dateStr;
}
function dateToString(d) {
    var dateStr = d.getFullYear() + "-"
            + addZero(d.getMonth() + 1) + "-"
            + addZero(d.getDate());
    return dateStr;
}
function delayTimeFromMS(ms) {
    var temp = ms;
    var day = (1000 * 3600 * 24);
    var hour = (1000 * 3600);
    var minute = (1000 * 60);
    var str = "";
    if (ms >= day) {
        str += (ms / day).toFixed(0) + " Hari ";
        ms = ms % day;
    }
    if (ms >= hour) {
        str += (ms / hour).toFixed(0) + " Jam ";
        ms = ms % hour;
    }
    if (ms >= minute) {
        str += (minute / minute).toFixed(0) + " Menit ";
    }
    return str;
}
function formatValidateUser(val, row) {
    console.log(val);
    if (val == '' || val == 'null' || val == null) {
        return '<span class="kosong">Kosong</span>';
    }
    return val;
}
function formatdate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}
function paserdate(s) {
    if (!s || s == undefined)
        return new Date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0], 10);
    var m = parseInt(ss[1], 10);
    var d = parseInt(ss[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m - 1, d);
    } else {
        return new Date();
    }
}
function convert(rows) {
    function parentExist(parents, child_id) {
        for (var i in parents) {
            if (parents[i].id === child_id)
                return parents[i];
        }
        return null;
    }

    var nodes = [];
    var childrens = [];
    // get the top level nodes
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        row.id = parseInt(row.id, 10);
        row.reseller_id = parseInt(row.reseller_id, 10);
        row.level_id = parseInt(row.level_id, 10);
        row['text'] = row.real_name;
        if (row.level_id === 1 || row.level_id === 4) {
            nodes.push(row);
        } else {
            childrens.push(row);
        }
    }

    while (childrens.length > 0) {
        var children = childrens.shift();
        var parent = parentExist(nodes, children.reseller_id);
        if (parent !== null) {
            if (parent.children) {
                parent.children.push(children);
            } else {
                parent.children = [children];
                parent['state'] = 'closed';
            }
        } else {
            nodes.push(children);
        }
    }
    return nodes;
}
function convert2(rows) {
    console.log(rows);
    function exists(rows, reseller_id) {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].id === reseller_id)
                return true;
        }
        return false;
    }

    var nodes = [];
    var resellers = [];
    var childrens = [];
    var ungroups = [];

    // Add reseller
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        row.id = parseInt(row.id, 10);
        row.reseller_id = parseInt(row.reseller_id, 10);
        row.level_id = parseInt(row.level_id, 10);
        row['text'] = row.real_name;
        if ((row.level_id === 4) || (row.level_id === 1)) {
            resellers.push({
                id: row.id,
                //state: 'closed',
                text: row.text,
                children: []
            });
        } else if ((row.level_id === 2) && (row.reseller_id > 0)) {
            childrens.push(row);
        } else {
            ungroups.push(row);
        }
    }

    while (resellers.length > 0) {
        var reseller = resellers.shift();
        var found = false;

        for (var j in childrens) {
            if (reseller.id === childrens[j].reseller_id) {
                reseller.children.push(childrens[j]);
                found = true;
            }
        }
        nodes.push(reseller);
    }
    for (var i in ungroups) {
        nodes.push(ungroups[i]);
    }
    return nodes;
}

function formatDO(val, row) {
    if (val === 0) {
        return "Progress";
    }
    if (val === 1) {
        return "Finish";
    }
    if (val === 2) {
        return "Delay";
    }
    return "Unknow";
}
function formatAlarm(val, row) {
    var str = val;
    var alarm = parseInt(val, 10);
    switch (alarm) {
        case 1:
            str = "SOS ALARM";
            break;
        case 2:
            str = "POWER CUT ALARM";
            break;
        case 3:
            str = "LOW POWER";
            break;
        case 4:
            str = "SHOCK ALARM";
            break;
        case 5:
            str = "OVER SPEED ALARM";
            break;
        case 6:
            str = "LOW SPEED ALARM";
            break;
        case 7:
            str = "GEOFENCE IN";
            break;
        case 8:
            str = "GEOFENCE OUT";
            break;
        case 9:
            str = "OVERTIME PARK";
            break;
        case 10:
            str = "MOVE ALARM";
            break;
        case 11:
            str = "OVERTIME ALARM";
            break;
        case 12:
            str = "OVERTIME ALARM";
            break;
        case 13:
            str = "OUT OF ROUTE";
            break;
        case 14:
            str = "IO1_ACTIVE";
            break;
        case 15:
            str = "IO1_INACTIVE";
            break;
        case 16:
            str = "IO2_ACTIVE";
            break;
        case 17:
            str = "IO2_INACTIVE";
            break;
        case 18:
            str = "IO3_ACTIVE";
            break;
        case 19:
            str = "IO3_INACTIVE";
            break;
        case 20:
            str = "IO4_ACTIVE";
            break;
        case 21:
            str = "IO4_INACTIVE";
            break;
        case 22:
            str = "IO5_INACTIVE";
            break;
        case 23:
            str = "IO5_ACTIVE";
            break;
        case 24:
            str = "IO6_INACTIVE";
            break;
        case 25:
            str = "IO6_ACTIVE";
            break;
        case 26:
            str = "GSM_ANTENA_CUT";
            break;
        case 27:
            str = "GPS_ANTENA_CUT";
            break;
        case 28:
            str = "GPS_JAMMED";
            break;
        case 29:
            str = "GSM_JAMMED";
            break;
        case 30:
            str = "GSM_JAMMED_RELEASE";
            break;
        case 31:
            str = "GPS_JAMMED_RELEASE";
            break;
        case 32:
            str = "FATIGUE_DRIVING";
            break;
        case 33:
            str = "FATIGUE_RELIEVE";
            break;
        case 34:
            str = "ENTER_SLEEP_MODE";
            break;
        case 35:
            str = "EXIT_SLEEP_MODE";
            break;
        case 36:
            str = "HARS_ACCELERATION";
            break;
        case 37:
            str = "HARS_BREAKING";
            break;
        case 38:
            str = "EXTERNAL_POWER_RECONNECT";
            break;
        case 39:
            str = "EXTERNAL_POWER_LOW";
            break;
        case 40:
            str = "DOOR_OPEN";
            break;
        case 41:
            str = "DOOR_CLOSE";
            break;
        case 42:
            str = "OVERTIME SHIPMENT";
            break;
        case 43:
            str = "ARRIVAL SHIPMENT";
            break;
    }
    return str;
}

function formatBatt(level) {
    var str = "";
    switch (level) {
        case - 1:
            str = "N/A";
            break;
        case 0:
            str = "Power Shutdown";
            break;
        case 1:
            str = "Extremly Low Batt";
            break;
        case 2:
            str = "Very Low Batt";
            break;
        case 3:
            str = "Low Batt";
            break;
        case 4:
            str = "Medium Batt";
            break;
        case 5:
            str = "High Batt";
            break;
        case 6:
            str = "Full Batt";
            break;
    }
    return str;
}
function formatGsm(level) {
    var str = "No Signal";
    switch (level) {
        case - 1:
            str = "Info Tidak Tersedia";
            break;
        case 0:
            str = "No Signal";
            break;
        case 1:
            str = "Very Weak Signal";
            break;
        case 2:
            str = "Weak Signal";
            break;
        case 3:
            str = "Good Signal";
            break;
        case 4:
            str = "Strong Signal";
            break;
        case 5:
            break;
        case 6:
            break;
    }
    return str;
}
function formatAngle(val, row) {
    if (((val >= 0) && (val < 22)) || (val >= 337))
        return "Utara";
    if ((val >= 22) && (val < 67))
        return "Timur Laut";
    if ((val >= 67) && (val < 112))
        return "Timur";
    if ((val >= 112) && (val < 157))
        return "Tenggara";
    if ((val >= 157) && (val < 202))
        return "Selatan";
    if ((val >= 202) && (val < 247))
        return "Barat Daya";
    if ((val >= 247) && (val < 292))
        return "Barat";
    if ((val >= 292) && (val < 337))
        return "Barat Laut";
    return val;
}
function formatYesNo(val, row) {
    if (val == 1) {
        return "Yes";
    }
    return "No";
}
function formatAcc(val, row) {
    return parseInt(val, 10) === 1 ? "<a href='#' class='green'>ON</a>" : "<a href='#' class='red'>OFF</a>";
}
function formatSpeed(val, row) {
    if (val !== undefined) {
        return val + "Km/j";
    }
    return val + " Km/j";
}
function formatStatus(val, row) {
    var str = "";
    switch (val) {
        case "on":
            str = "<div style='background:#0F0'>ACC ON</div>";
            break;
        case "stop":
            str = "<div style='background:yellow'>ACC OFF</div>";
            break;
        case "off":
            str = "<div style='background:orange;'>OFFLINE</div>";
            break;
    }
    return str;
}
function formatLinkMap(val, row) {
    return '<a href="#" onClick="viewMap(' + row.id + ');">View Map</a>';
}
function formatCharger(val, row) {
    return parseInt(val, 10) === 1 ? "<a href='#' class='green'>ON</a>" : "<a href='#' class='red'>OFF</a>";
}
function formatActive(val, row) {
    return parseInt(val, 10) === 1 ? "<a href='#' class='green'>AKTIF</a>" : "<a href='#' class='red'>NOT AKTIF</a>";
}
function formatIcon(val, row) {
    return '<img src="images/poi/' + row.icon + '"/>';
}
function formatCommand(row) {
    var s = '<span style="font-weight:bold">' + row.cmd + '</span><br/>' +
            '<span style="color:#888">' + row.descr + '</span>';
    return s;
}
function logout() {
    if (confirm("Logout ?"))
        window.location = "php_script/do_logout.php";
}
function distance(lat1, lng1, lat2, lng2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
function calcDiffMS(d1, d2) {
    if (d1 == undefined || d2 == undefined) {
        return "";
    }
    var arr = d1.split(" ");
    var arrDate = arr[0].split("-");
    var arrTime = arr[1].split(":");
    var arr2 = d2.split(" ");
    var arrDate2 = arr2[0].split("-");
    var arrTime2 = arr2[1].split(":");
    var t1 = new Date(arrDate[0], arrDate[1], arrDate[2], arrTime[0], arrTime[1], arrTime[2]);
    var t2 = new Date(arrDate2[0], arrDate2[1], arrDate2[2], arrTime2[0], arrTime2[1], arrTime2[2]);
    return  t2 - t1;
}
function get_park_second(park_date) {
    var arr = park_date.split(" ");
    var arrDate = arr[0].split("-");
    var arrTime = arr[1].split(":");
    var t1 = new Date(arrDate[0], arrDate[1], arrDate[2], arrTime[0], arrTime[1], arrTime[2]);
    var t2 = create_date();
    return  (t2 - t1) / 1000;
}
;
////Milisecond to time
function msToTime(diff) {
    var diffTemp = diff;
    var str = "";
    if (diff > 0)
    {
        //tobe minute
        diff = diff / 1000 / 60;
        //Get Days
        if (diff >= (60 * 24)) {
            var hari = (diff / (60 * 24));
            diff = diff % (60 * 24);
            str = parseInt(hari, 10) + " Hari ";
        }
        //Get Hour
        if (diff >= 60) {
            var jam = diff / 60;
            diff = diff % 60;
            str = str + " " + parseInt(jam, 10) + " Jam ";
        }
        //Get Minute
        if (diff >= 1) {
            var menit = diff;
            str = str + " " + parseInt(menit, 10) + " Menit ";
        }
    }
    if (diffTemp > (1000 * 60 * 10)) {
        return str;
    } else {
        return "";
    }
}
;
function secToTime(second) {
    console.log(second);
    var str = "";
    var diff = parseInt(second, 10);
    if (diff > 0) {
        //tobe minute
        diff = diff / 1000 / 60;

        //Get Days
        if (diff >= (60 * 24)) {
            diff = (diff / (60 * 24));
            str = parseInt(diff, 10) + " Hari ";
        }
        //Get Hour
        if (diff >= 60) {
            diff = diff / 60;
            str = str + " " + parseInt(diff) + " Jam ";
        }
        //Get Minute
        if (diff >= 1) {
            str = str + " " + parseInt(diff) + " Menit ";
        }
    }
    return str;
}
;
function diffDateTime(d1, d2) {
    var arr = d1.split(" ");
    var arrDate = arr[0].split("-");
    var arrTime = arr[1].split(":");
    var arr2 = d2.split(" ");
    var arrDate2 = arr2[0].split("-");
    var arrTime2 = arr2[1].split(":");
    var t1 = new Date(arrDate[0], arrDate[1], arrDate[2], arrTime[0], arrTime[1], arrTime[2]);
    var t2 = new Date(arrDate2[0], arrDate2[1], arrDate2[2], arrTime2[0], arrTime2[1], arrTime2[2]);
    var ms = parseInt(t2 - t1) / 1000 / 60;
    return parseInt(ms);
}
;
function formatdate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}
function parserdate(s) {
    if (!s || s == undefined)
        return create_date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0], 10);
    var m = parseInt(ss[1], 10);
    var d = parseInt(ss[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m - 1, d);
    } else {
        return new create_date();
    }
}

function TileToQuadKey(x, y, zoom) {
    var quad = "";
    for (var i = zoom; i > 0; i--) {
        var mask = 1 << (i - 1);
        var cell = 0;
        if ((x & mask) != 0)
            cell++;
        if ((y & mask) != 0)
            cell += 2;
        quad += cell;
    }
    return quad;
}
function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function pagerFilter(data) {
    if ($.isArray(data)) {	// is array
        data = {
            total: data.length,
            rows: data
        }
    }
    var target = this;
    var dg = $(target);
    var state = dg.data('datagrid');
    var opts = dg.datagrid('options');
    if (!state.allRows) {
        state.allRows = (data.rows);
    }
    if (!opts.remoteSort && opts.sortName) {
        var names = opts.sortName.split(',');
        var orders = opts.sortOrder.split(',');
        state.allRows.sort(function (r1, r2) {
            var r = 0;
            for (var i = 0; i < names.length; i++) {
                var sn = names[i];
                var so = orders[i];
                var col = $(target).datagrid('getColumnOption', sn);
                var sortFunc = col.sorter || function (a, b) {
                    return a == b ? 0 : (a > b ? 1 : -1);
                };
                r = sortFunc(r1[sn], r2[sn]) * (so == 'asc' ? 1 : -1);
                if (r != 0) {
                    return r;
                }
            }
            return r;
        });
    }
    var start = (opts.pageNumber - 1) * parseInt(opts.pageSize);
    var end = start + parseInt(opts.pageSize);
    data.rows = state.allRows.slice(start, end);
    return data;
}
/* Create Info */

function create_info(v) {
    var odo = parseFloat(v.odo);
    var result = "<table>" +
            "<tr onClick=selectDevice('" + v.id + "');><td><img src='icon/app/" + icons[v.status] + "'  class='imgstate'/></td><td>:</td><td class='nopol'>" + v.nopol + "</td></tr>" +
            "<tr><td style='max-width:60px;'>User</td><td>:</td><td>" + v.real_name + "</td></tr>" +
            "<tr><td>IMEI</td><td>:</td><td>" + v.imei + "</td></tr>";

    if (v.alarm > 0) {
        result += "<tr><td>Alarm</td><td>:</td><td>" + formatAlarm(v.alarm) + "</td></tr>";
    }
    result += "<tr><td style='max-width:60px;'>GPS&nbsp;Time</td><td>:</td><td>" + v.tdate + " <span style='color:blue;'>(" + v.delayInfo + ")</span></td></tr>"
            + "<tr><td>Server&nbsp;Time</td><td>:</td><td>" + v.sdate + "</td></tr>"
            + "<tr><td>Kecepatan</td><td>:</td><td>" + v.speed + " Km/Jam</td></tr>"
            + "<tr><td>Info</td><td>:</td><td>ACC: " + formatAcc(v.acc) + ", Power: " + formatCharger(v.charge) + "," + formatBatt(v.batt) + "</td></tr>"
    //+ "<tr><td>Odomter:</td><td>:</td><td>" + odo.toLocaleString() + " Km</td></tr>";
    if (parseInt(v.max_odo_oil, 10) > 0) {
        result += "<tr><td>Alarm Oli Aktif </td><td>:</td><td>" + v.max_odo_oil.toLocaleString() + " Km</td></tr>";
    }

    var max_park = parseInt(v.max_park, 10);
    if (max_park > 0) {
        if (max_park >= 60) {
            //var mp = max_park / 60;
            result += "<tr><td>ALM Parkir</td><td>:</td><td><b style='color:#F00;'> " + (max_park / 60).toFixed(0) + " Jam</b></td></tr>";
        } else {
            result += "<tr><td>ALM Parkir</td><td>:</td><td><b style='color:#F00;'> " + v.max_park.toFixed(0) + " Menit</b></td></tr>";
        }

    }
    if (v.park > 0) {
        result += "<tr><td>Parkir</td><td>:</td><td> " + v.park_info + "</td></tr>";
    }
    if (parseInt(v.fcut, 10) > 0) {
        result += "<tr><td>Cut Engine:</td><td>:</td><td><b style='color:#F00;'>Aktif</b></td></tr>";
    }
    result += "<tr><td>Alamat</td><td>:</td><td style='width:200px;'>" + v.poi + "," + stringDivider(v.address, 40, "<br/>\n") + "</td></tr>" +
            //"<tr><td></td><td>:</td><td><a class='btnblue' href='#' onclick=editDevice(" + v.id + ");>Edit</a><a class='btnyel' href='#' onclick=app.open_window(" + v.id + ");>Play</a><a class='btnred' href='#' onClick='openDlgCommand(" + v.id + ");'>Send</a></td></tr>" +
                "<tr><td></td><td>:</td><td><button onclick=editDevice(" + v.id + ");>Edit</button>&nbsp;|<button onclick=app.open_window(" + v.id + ");>Play</button>&nbsp;|&nbsp;<button onClick=openDlgCommand('" + v.id + "');>Send</button></td></tr>" +
            "<table/>";

    return result;
}
function createInfoAlarm(v) {
    var result = "<table>" +
            "<tr><td style='max-width:60px;'>GPS&nbsp;Time</td><td>:</td><td>" + v.tdate + " <span style='color:blue;'>(" + v.delayInfo + ")</span></td></tr>"
            + "<tr><td>Server&nbsp;Time</td><td>:</td><td>" + v.sdate + "</td></tr>";

    if (v.alarm > 0) {
        result += "<tr><td>Alarm</td><td>:</td><td>" + formatAlarm(v.alarm) + "</td></tr>";
    }
    result += "<tr><td>Kecepatan</td><td>:</td><td>" + v.speed + " Km/Jam</td></tr>"
            + "<tr><td>Info</td><td>:</td><td>ACC: " + formatAcc(v.acc) + ", Power: " + formatCharger(v.charge) + "," + formatBatt(v.batt) + "</td></tr>"
    //+ "<tr><td>Odomter:</td><td>:</td><td>" + odo.toLocaleString() + " Km</td></tr>";
    if (parseInt(v.max_odo_oil, 10) > 0) {
        result += "<tr><td>Alarm Oli Aktif </td><td>:</td><td>" + v.max_odo_oil.toLocaleString() + " Km</td></tr>";
    }

    var max_park = parseInt(v.max_park, 10);
    if (max_park > 0) {
        if (max_park >= 60) {
            //var mp = max_park / 60;
            result += "<tr><td>ALM Parkir</td><td>:</td><td><b style='color:#F00;'> " + (max_park / 60).toFixed(0) + " Jam</b></td></tr>";
        } else {
            result += "<tr><td>ALM Parkir</td><td>:</td><td><b style='color:#F00;'> " + v.max_park.toFixed(0) + " Menit</b></td></tr>";
        }

    }
    if (v.park > 0) {
        result += "<tr><td>Parkir</td><td>:</td><td> " + v.park_info + "</td></tr>";
    }
    if (parseInt(v.fcut, 10) > 0) {
        result += "<tr><td>Cut Engine:</td><td>:</td><td><b style='color:#F00;'>Aktif</b></td></tr>";
    }
    result += "<tr><td>Alamat</td><td>:</td><td style='width:200px;'>" + v.poi + "," + stringDivider(v.address, 40, "<br/>\n") + "</td></tr>" +
            "<table/>";

    return result;
}
function create_infowindow(v) {
    var odo = parseFloat(v.odo);
    var result = "<div class='boxiw'><table>" +
            "<tr onClick=selectDevice('" + v.id + "');><td><img src='icon/app/" + icons[v.status] + "'  class='imgstate'/></td><td>:</td><td class='nopol'>" + v.nopol + "</td></tr>" +
            "<tr><td>IMEI</td><td>:</td><td>" + v.imei + "</td></tr>";

    if (v.alarm > 0) {
        result += "<tr><td>Alarm</td><td>:</td><td>" + formatAlarm(v.alarm) + "</td></tr>";
    }
    result += "<tr><td style='max-width:60px;'>GPS&nbsp;Time</td><td>:</td><td>" + v.tdate + " <span style='color:blue;'>(" + v.delayInfo + ")</span></td></tr>"
            + "<tr><td>Server&nbsp;Time</td><td>:</td><td>" + v.sdate + "</td></tr>"
            + "<tr><td>Kecepatan</td><td>:</td><td>" + v.speed + " Km/Jam</td></tr>"
            + "<tr><td>Info</td><td>:</td><td>ACC: " + formatAcc(v.acc) + ", Power: " + formatCharger(v.charge) + "," + formatBatt(v.batt) + "</td></tr>"
            + "<tr><td>Odomter:</td><td>:</td><td>" + odo.toLocaleString() + " Km</td></tr>";
    if (parseInt(v.max_odo_oil, 10) > 0) {
        result += "<tr><td>Alarm Oli Aktif </td><td>:</td><td>" + v.max_odo_oil.toLocaleString() + " Km</td></tr>";
    }

    var max_park = parseInt(v.max_park, 10);
    if (max_park > 0) {
        if (max_park >= 60) {
            //var mp = max_park / 60;
            result += "<tr><td>ALM Parkir</td><td>:</td><td><b style='color:#F00;'> " + (max_park / 60).toFixed(0) + " Jam</b></td></tr>";
        } else {
            result += "<tr><td>ALM Parkir</td><td>:</td><td><b style='color:#F00;'> " + v.max_park.toFixed(0) + " Menit</b></td></tr>";
        }

    }
    if (v.park > 0) {
        result += "<tr><td>Parkir</td><td>:</td><td> " + v.park_info + "</td></tr>";
    }
    if (parseInt(v.fcut, 10) > 0) {
        result += "<tr><td>Cut Engine:</td><td>:</td><td><b style='color:#F00;'>Aktif</b></td></tr>";
    }
    result +=
            "<tr><td>Lat/Lng</td><td>:</td><td>" + v.lat.toFixed(4) + "," + v.lng.toFixed(4) + "</td></tr>" +
            "<tr><td>Alamat</td><td>:</td><td style='width:200px;'>" + v.poi + "," + stringDivider(v.address, 40, "<br/>\n") + "</td></tr>" +
            "<tr><td></td><td>:</td><td><a class='btnblue' href='#' onclick=editDevice(" + v.id + ");>Edit</a><a class='btnyel' href='#' onclick=app.open_window(" + v.id + ");>Play</a><a class='btnred' href='#' onClick='openDlgCommand(" + v.id + ");'>Send</a></td></tr>" +
            "<table/></div>";

    return result;
}
create_info_travel = function (v) {
    var buttons = "";
    if (v.complete === 0) {
        buttons = "<tr><td></td><td></td><td><button class='finish' onclick='app.finish_travel(" + v.id + ");'>Finish</button><button class='cancel'  onclick='app.cancel_travel(" + v.id + ");'>Cancel</button></td></tr>";
    } else {
        buttons = "<tr><td></td><td></td><td><button class='cancel' onclick='app.delete_travel(" + v.id + ");'>Delete</button>&nbsp;<button class='finish' onclick='app.report_travel(" + v.id + ");'>Report</button>&nbsp;<button class='cancel' onclick='app.clear_report_travel(" + v.id + ");'>Clear Report</button></tr>";
    }
    var result = "<table class='tblview'>" +
            "<tr onClick=selectDevice('" + v.id + "');><td class='nopol'>Nopol</td><td>:</td><td class='nopol'>" + v.nopol + "</td></tr>" +
            "<tr><td style='width:80px;'>Start Date</td><td>:</td><td>" + v.sdate + "</td></tr>" +
            "<tr><td>Est Tiba</td><td>:</td><td>" + v.est_arrival + "</td></tr>" +
            "<tr><td>Finish Date</td><td>:</td><td>" + v.fdate + "</td></tr>" +
            "<tr><td>Asal</td><td>:</td><td>" + v.start_addr + "</td></tr>" +
            "<tr><td>Tujuan</td><td>:</td><td>" + v.end_addr + "</td></tr>" +
            "<tr><td>Jarak</td><td>:</td><td>" + v.dist + "</td></tr>";
    result += buttons;
    result += "<table/>";
    return result;
};

function stringDivider(str, width, spaceReplacer) {
    if (str === null || str == '') {
        return '';
    }

    if (str.length > width) {
        var p = width
        for (; p > 0 && str[p] != ' '; p--) {
        }
        if (p > 0) {
            var left = str.substring(0, p);
            var right = str.substring(p + 1);
            return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
        }
    }
    return str;
}


var LZW = {
    compress: function (uncompressed) {
        "use strict";
        // Build the dictionary.
        var i,
                dictionary = {},
                c,
                wc,
                w = "",
                result = [],
                dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[String.fromCharCode(i)] = i;
        }

        for (i = 0; i < uncompressed.length; i += 1) {
            c = uncompressed.charAt(i);
            wc = w + c;
            //Do not use dictionary[wc] because javascript arrays 
            //will return values for array['pop'], array['push'] etc
            // if (dictionary[wc]) {
            if (dictionary.hasOwnProperty(wc)) {
                w = wc;
            } else {
                result.push(dictionary[w]);
                // Add wc to the dictionary.
                dictionary[wc] = dictSize++;
                w = String(c);
            }
        }

        // Output the code for w.
        if (w !== "") {
            result.push(dictionary[w]);
        }
        return result;
    },

    decompress: function (compressed) {
        "use strict";
        // Build the dictionary.
        var i,
                dictionary = [],
                w,
                result,
                k,
                entry = "",
                dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[i] = String.fromCharCode(i);
        }

        w = String.fromCharCode(compressed[0]);
        result = w;
        for (i = 1; i < compressed.length; i += 1) {
            k = compressed[i];
            if (dictionary[k]) {
                entry = dictionary[k];
            } else {
                if (k === dictSize) {
                    entry = w + w.charAt(0);
                } else {
                    return null;
                }
            }

            result += entry;

            // Add w+entry[0] to the dictionary.
            dictionary[dictSize++] = w + entry.charAt(0);

            w = entry;
        }
        return result;
    }
}; // For Test Purposes
function formatCurrency(val, row) {
    if (!isNaN(val)) {
        return "Rp." + (parseInt(val, 10)).toLocaleString();
    }
    return "Rp.0";
}
function formatPaid(val, row) {
    console.log(val)
    val = parseInt(val, 10);
    if (val == 1) {
        return "Dibayar";
    }
    return "<span class='kosong'>Belum Dibayar<span>";
}

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