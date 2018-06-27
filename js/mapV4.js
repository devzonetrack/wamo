var xhr;
var xhr;
var clickHandler;
var mouse = {x: 0, y: 0};
var audio = {
    audioElement: undefined,
    currLoop: 0,
    maxLoop: 2
};

var CommandID = {
    POSITION: 1,
    CUT_ENGINE: 2,
    RESUME_ENGINE: 3,
    RESTART: 4,
    STATUS: 5,
    PWDSW: 6,
    OVERSPEED: 7,
    URL: 8,
    SERVER: 9,
    TIMER: 10,
    SENALM: 11,
    POWERALM: 12,
    SOSALM: 13,
    BATALM: 14,
    DELSOS: 15,
    SET_SOS: 16,
    SETCENTER: 17,
    TIMEOLD: 18,
    TIMEZONE: 19,
    SENDS: 20,
    SF: 21,
    SET_PASSWORD: 22,
    CLEAR_PASSWORD: 23,
    SET_CENTER: 24,
    PARAM: 25,
    SET_IO: 26,
    GET_GPRS: 27,
    ENABLE_PARK_ALARM: 28,
    DISABLE_PARK_ALARM: 29,
    SET_ODOMETER: 30,
    ENABLE_OIL_ALARM: 31,
    DISABLE_OIL_ALARM: 32,
    ENABLE_REPORT_ARM: 33,
    DISABLE_REPORT_ARM: 34,
    ENABLE_REPORT_ACCONOFF: 35,
    DISABLE_REPORT_ACCONOFF: 36,
    ENABLE_REPORT_DOOR_OPEN_CLOSE: 37,
    DISABLE_REPORT_DOOR_OPEN_CLOSE: 38,
    RESET_PARK: 39
};

var icons = [];
icons['off'] = 'off16.png';
icons['on'] = 'on16.png';
icons['stop'] = 'stop16.png';


var filterData = {
    filter: 'all', //all,on,off,search
    field_name: '', //field for filter ='search'
    value: '',
    view: 'list' //list,tree
};
var Direction = {
    render: new google.maps.DirectionsRenderer(),
    service: new google.maps.DirectionsService()
};
var currPoi = {
    id: 0,
    mode: '',
    poi: '',
    lat: 0,
    lng: 0,
    descr: 0,
    marker: undefined
};
var travel = {
    dialog_open: false,
    mode: '',
    id: 0,
    user_id: 0,
    vh_id: 0,
    dist: 0,
    duraion: 0,
    est_arrival: '',
    cost: 0,
    speed: 0,
    total_cost: 0,
    start_addr: '',
    end_addr: '',
    start_lat: 0,
    start_lng: 0,
    end_lat: 0,
    end_lng: 0,
    descr: ''
};
var summary = {
    filterValue: '',
    filterCategory: ''
};
var gpsStatus = {
    on: 0, off: 0, park: 0
};
var vehicle = {
    url_load: '',
    url_save: ''
};
var streetViewActive = false;
var panorama;
var app = {
    map_loaded: false,
    config_loaded: false,
    user_id: 0,
    user_level: '',
    session: '',
    vh_id: 0,
    xhr: 0,
    addShape: false,
    service: undefined,
    groups: [],
    vehicles: [],
    vehicles2: [],
    elements: [],
    markers: [],
    pois: [],
    markerpois: [],
    labels: [],
    shipments: [],
    websocket: undefined,
    mainTabs: undefined,
    map: undefined,
    geocoder: undefined,
    treePoi: undefined,
    element: undefined,
    elementShipment: undefined,
    elementsShipment: [],
    elementShipmentFinish: undefined,
    elementsShipmentFinish: [],
    cboUser: undefined,
    gridGps: undefined,
    gridSummary: undefined,
    gridCommand: undefined,
    dlgCommand: undefined,
    gridAlarm: undefined,
    tabLeft: undefined,
    tabPlaces: undefined,
    tabPoi: undefined,
    tabGeofence: undefined,
    tabRoute: undefined,
    tabVehicle: undefined,
    tabMap: undefined,
    tabAlarm: undefined,
    listVehicle: undefined,
    treeVehicle: undefined,
    cboVehicle: undefined,
    gps_all: undefined,
    gps_on: undefined,
    gps_off: undefined,
    gps_total_on: 0,
    gps_total_off: 0,
    form_poi: undefined,
    dlg_travel: undefined,
    form_travel: undefined,
    form_geofence: undefined,
    markerAlarm: undefined,
    polyline: undefined
};
var map;
var iw;
var user_id = 0;
var vh_id = 0;
var vehicles = [];
var vehicles2 = [];
var markers = [];
var labels = [];
var groups = [];
var users = [];
var pois = [];
var markersPoi = [];
var alarms = [];
var markersAlarm = [];
var markerAlarm;

var gridAlarm;
var gridPoi;
var gridGeofence;
var gridDesa;

var tabPoi;
var tabGeofence;
var tabRoute;
var tabDevice;
var tabMap;
var listViewDevice;
var listViewDevices = [];
var listViewAlarm;
var listViewAlarms = [];

var polyline;
var polygon;
var geofence;
var gridSummary;
var gridDevice;

var formDevice;
var dlgDevice;

var dlgPoi;
var formPoi;

var alarm = {
    alarm: null
};
var select_poi = {
    init: false,
    source: '',
    id: 0
};
var poiA = {};
var poiB = {};

app.selector = function () {
    app.mainTabs = $("#mainTabs");
    app.form_geofence = $("#form_geofence");
    app.cboUser = $("#cboUser");
    app.gridGps = $("#gridGps");
    tabDevice = $("#tabVehicle");
    app.tabLeft = $("#tabLeft");
    app.tabPlaces = $("#tabPlaces");
    app.tabPoi = $("#tabPoi");
    app.tabGeofence = $("#tabGeofence");
    app.tabRoute = $("#tabRoute");
    gridSummary = $("#gridSummary");
    app.gridAlarm = $("#gridAlarm");
    treeGps = $("#treeGps");
    app.dlgGps = $("#dlg_gps");
    app.form_gps = $("#form_gps");
    app.win_select_poi = $("#win_select_poi");
    listViewDevice = document.getElementById("listView");
    listViewDeviceAlarm = document.getElementById("listAlarm");
    app.winVhGroup = $("#winVhGroup");
    app.status_gps = $("#status_gps");

    app.treePoi = $("#treePoi");
    app.treeGeofence = $("#treeGeofence");
    app.gps_all = $("#gps_all");
    app.gps_on = $("#gps_on");
    app.gps_off = $("#gps_off");
    app.form_poi = $("#form_poi");
    app.dlg_poi = $("#dlg_poi");
    app.form_travel = $("#form_track");
    //app.dlg_travel = $("#dlg_track");
    app.cboVehicleTravel = $("#form_track :input[id=vh_id]");
    app.jamTravel = $("#form_track :input[id=jam]");
    app.hariTravel = $("#form_track :input[id=hari]");
    app.cboVehicleGroup = $("#form_gps :input[id=vh_group]");

};
function initMap() {
    map_loaded = false;
    var mapQuestType = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            return "http://otile" + rnd(1, 4) + ".mqcdn.com/tiles/1.0.0/osm/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
        },
        tileSize: new google.maps.Size(256, 256),
        isPng: true,
        maxZoom: 18,
        minZoom: 0,
        name: "Map Quest"
    });

    var bingMapHybridType = new google.maps.ImageMapType({
        name: "Bing Hybrid",
        getTileUrl: function (coord, zoom) {
            return "http://ecn.t" + rnd(0, 4) + ".tiles.virtualearth.net/tiles/h" + TileToQuadKey(coord.x, coord.y, zoom) + "?g=700";
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 21
    });
    var bingMapStreetType = new google.maps.ImageMapType({
        name: "Bing Street",
        getTileUrl: function (coord, zoom) {
            return "http://t" + rnd(0, 4) + ".tiles.virtualearth.net/tiles/r" + TileToQuadKey(coord.x, coord.y, zoom) + ".jpeg?g=1398";
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 21
    });
    var nokiaMapType = new google.maps.ImageMapType({
        name: "Nokia Street",
        getTileUrl: function (coord, zoom) {
            //http://maptile.maps.svc.ovi.com/maptiler/maptile/newest/normal.day/{z}/{x}/{y}/256/png8
            return "http://maptile.maps.svc.ovi.com/maptiler/maptile/newest/normal.day/" + zoom + "/" + coord.x + "/" + coord.y + "/256/png8";
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 21
    });
    var mapOptions = {
        zoom: 5,
        center: new google.maps.LatLng(-0.789275, 113.921327),
        panControl: true,
        zoomControl: true,
        scaleControl: true,
        streetViewControl: true,
        overviewMapControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
//        mapTypeControlOptions: {
//            mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID, 'Bing Street', 'Bing Hybrid', 'Map Quest']
//        }
    };
    app.geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    map.mapTypes.set('Bing Street', bingMapStreetType);
    map.mapTypes.set('Bing Hybrid', bingMapHybridType);
    map.mapTypes.set('Map Quest', mapQuestType);

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
    //Places
    var markerplaces = [];
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    google.maps.event.addListener(searchBox, 'places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }
        for (var i = 0, marker; marker = markerplaces[i]; i++) {
            marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        markerplaces = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });
            markerplaces.push(marker);
            bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);
    });
    // [END region_getplaces]

    var rendererOptions = {draggable: true};
    Direction.service = new google.maps.DirectionsService();
    Direction.render = new google.maps.DirectionsRenderer(rendererOptions);
    google.maps.event.addListener(Direction.render, 'directions_changed', function () {
        computeTotalDistance(Direction.render.getDirections());
    });
    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function () {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(document.getElementById('panelGeofence'));
    var idleListener = google.maps.event.addListenerOnce(map, 'idle', function () {
        google.maps.event.removeListener(idleListener);
        if (map_loaded === true)
            return;
        initMapControl();
        map_loaded = true;
        desa.init();
    });

    if (streetViewActive) {
        var panoOptions = {
            position: map.getCenter(),
            pov: {
                heading: 0,
                pitch: 0
            },
            enableCloseButton: false,
            addressControl: false,
            panControl: false,
            visible: true,
            clickToGo: false,
            addressControl: false,
            mode: "html5",
            zoomControlOptions: {
                position: google.maps.ControlPosition.TOP_LEFT
            }
        }
        panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoOptions);
    }
}


function initGridCommand() {
    gridCommand = $("#gridCommand");
    var pager = $("#gridCommand").datagrid("getPager");
    pager.pagination({
        total: 114,
        buttons: [{
                iconCls: 'icon-remove',
                handler: function () {
                    deleteCommand();
                }
            }, '-', {
                iconCls: 'icon-reload',
                handler: function () {
                    alert('save');
                }
            }]
    });
}
;
function initGridSummary() {
    gridSummary = $("#gridSummary");
    $("#gridSummary").datagrid({
        toolbar: '#toolbarSummary',
        fit: true,
        fitColumns: false,
        pagination: true,
        pageList: [5, 7, 8, 9, 10, 50, 100, 200],
        pageSize: 5,
        rownumbers: true, singleSelect: true, autoRowHeight: true, autoColWidth: true,
        columns: [[
                {field: 'status', title: 'Status', width: 80, formatter: formatStatus},
                {field: 'id', title: 'Map', width: 80, formatter: app.format_linkmap},
                {field: 'nopol', title: 'Nopol', width: 130},
                {field: 'tdate', title: 'Last Update', width: 130},
                {field: 'speed', title: 'Speed', width: 80},
                {field: 'park_info', title: 'Info Parkir', width: 150},
                {field: 'odo', title: 'Odometer', width: 100},
                {field: 'poi', title: 'POI', width: 160},
                {field: 'address', title: 'Alamat', width: 350},
                {field: 'angle', title: 'Arah', width: 100, formatter: formatAngle},
                {field: 'lat', title: 'Lat', width: 100},
                {field: 'lng', title: 'Lng', width: 100},
                {field: 'batt', title: 'Battery', width: 100},
                {field: 'gsm', title: 'GSM', width: 100},
                {field: 'fuel', title: 'Fuel', width: 100},
                {field: 'temp', title: 'Temperature', width: 100}
            ]]
        , onClickRow: function (rowIndex, rowData) {

        }
    });
    //  gridGps.datagrid('fitColumns');
}

function initVars() {
    tabPlaces = $("#tabPlaces");
    tabPoi = $("#tabPoi");
    tabGeofence = $("#tabGeofence");
    tabRoute = $("#tabRoute");

    tabDevice = $("#tabDevice");
    treeDevice = $("#treeDevice");
    listViewDevice = document.getElementById("listViewDevice");
    listViewAlarm = document.getElementById("listViewAlarm");

    listViewGeofence = document.getElementById("listViewGeofence");
    formGeofence = $("#formGeofence");
    dlgGeofence = $("#dlgGeofence");

    gridAlarm = $("#gridAlarm");
    gridPoi = $("#gridPoi");
    gridGeofence = $("#gridGeofence");

    btnGpsAll = $("#btnGpsAll");
    btnGpsOn = $("#btnGpsOn");
    btnGpsOff = $("#btnGpsOff");
    dlgPoi = $("#dlgPoi");
    formPoi = $("#formPoi");

    mainTabs = $("#mainTabs");
    cboUser = $("#cboUser");
    gridSummary = $("#gridSummary");

    formDevice = $("#formDevice");
    dlgDevice = $("#dlgDevice");
    dlgCommand = $('#dlgCommand');
}
function initGui() {
    cboUser.combotree({
        width: '100%',
        height: 24,
        url: 'php_script/user/combobox_user.php',
        valueField: 'id',
        textField: 'real_name',
        onClick: function (node) {
            //console.log(node);
            user_level = node.level;
            changeUser(node.id);
        },
        onSelect: function (rec) {
            //console.log(rec);
        },
        loadFilter: function (rows) {
            return convert(rows);
        },
        onLoadSuccess: function (node, data) {
            ////console.log(data);
            var user_id = 0;
            for (var i in data) {
                if (user_id === 0) {
                    //console.log(data[i]);
                    user_id = data[i].id;
                    user_id = data[i].id;
                    user_level = data[i].level;
                    cboUser.combotree('setValue', user_id);
                    break;
                }
            }
            changeUser(user_id);
        }, onLoadError: function (arguments) {
            setTimeout(function () {
                cboUser.combotree('reload');
            }, 3000);
        }
    });
    tabDevice.tabs({
        onSelect: function (title, index) {
            //console.log(title);
            if (title === 'List') {
                showListViewDevice('all');
            } else {
                showTreeDevice();
            }
        }
    });

    dlgGeofence.dialog({
        onClose: function () {
            clearHandlerClickMap();
            if (GF.shape) {
                GF.shape.setMap(null);
                delete GF.shape;
                //alert('GF.shape deleted');
            }
        }});
    dlgPoi.dialog({
        onClose: function () {
            clearHandlerClickMap();
            if (currPoi.marker === null)
                return;
            currPoi.marker.setMap(null);
            currPoi.marker = null;
        }
    });
    /* Main Tabs */

    var opts = mainTabs.tabs('options');
    opts.onClose = function (title, index) {
        if (title === 'Service') {
            app.tabServiceVisible = false;
        }
        if (title == 'Alarm') {
            app.tabAlarmVisible = false;
        }
    };
    opts.onLoad = function (panel) {
        var opts = panel.panel('options');
        //console.log(opts);
        if (opts.title == undefined)
            return;
        if (opts.title == 'Jadwal Service') {
            app.tabServiceVisible = true;
            app.service = new MyServices(map);
            app.service.init_event();
        }
        if (opts.title == 'Alarm') {
            app.tabAlarmVisible = true;
            alarms = new MyAlarms(map);
            alarms.init_event();
        }
    };
    initGridSummary();
}
function init() {
    document.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX || e.pageX;
        mouse.y = e.clientY || e.pageY;
    }, false);

    config.init();
    initVars();
    initMap();
    initGui();

    treeDevice.tree({
        checkbox: false,
        dnd: true,
        onBeforeLoad: function (node, param) {
            if (user_id === 0) {
                return false;
            }
            param.user_id = user_id;
        },
//        loadFilter: function (rows) {
//            return toTreeDevice(rows);
//        },
        onClick: function (node) {
            //console.log(node);
            if (node.level === 1) {
                vh_id = -1;
                app.select_group(node);
            } else if (node.level === 2) {
                vh_id = -1;
                app.select_group(node);
            } else if (node.level === 3) {
                selectDevice(node.id);
            }
        },
        animate: false,
        onContextMenu: function (e, node) {
            vh_id = node.id;
            e.preventDefault();
            treeGps.tree('select', node.target);
            popSender = 'tree';
            $('#mmVehicle').menu('show', {
                left: e.pageX,
                top: e.pageY
            });
        },
        onDrop: function (targetNode, source, point) {
            var dest = treeGps.tree('getNode', targetNode);
            var sourceLevel = 0;
            var destLevel = 0;
            try {
                sourceLevel = parseInt(source.level, 10);
                destLevel = parseInt(dest.level, 10);
            } catch (e) {
            }

            if ((sourceLevel !== 3) && (destLevel !== 2))
                return;
            //console.log(source);
            //console.log('move group from:' + source.vh_group + ' to ' + dest.id);
            $.post('php_script/move_group.php', {vh_id: source.id, dest_group: dest.id, user_id: user_id},
                    function (result) {
                        var v = vehicles2[source.id];
                        if (v === undefined)
                            return;
                        v.vh_group = dest.group_id;
                        //change_user(user_id);
                    }, 'json');

        }
    });




    $("#tabShipment").tabs({
        onSelect: function (index, title) {
            if (title === 'List') {
                travel.mode = '';
                travel.id = 0;
                if (Direction.render) {
                    Direction.render.setMap(null);
                }
            }
        }
    });
//    app.cboVehicleTravel.combobox({
//        onBeforeLoad: function (param) {
//            param.user_id = user_id;
//        },
//        onClick: function (rec) {
//
//            if (travel.mode === '') {
//                return;
//            }
//            if (rec === undefined || rec === null)
//                return;
//            var t = app.travel_exist(rec.id);
//            if (t !== undefined) {
//                alert('Nopol :' + rec.text + ' Sudah Aktif');
//                return;
//            }
//            app.select_vehicle_travel(rec.id);
//
//        },
//        onChange: function (newValue, oldValue) {
//            ////console.log('onChange');
//            // //console.log(newValue);
//        }, onLoadError: function () {
//            setTimeout(function () {
//                app.cboVehicleTravel.combobox('reload');
//            }, 3000);
//        }
//    });
//
//    app.hariTravel.textbox({
//        onChange: function (newVal, oldVal) {
//
//        }
//    });
//    app.jamTravel.textbox({
//        onChange: function (newVal, oldVal) {
//
//        }
//    });



}

function searchDevice(value, name) {
    filterData.filter = "search";
    filterData.field_name = name;
    filterData.value = value;

    var params = {
        field: name,
        search: value,
        rand: Math.random(1000) * 1000
    };
    if (xhrGps) {
        xhrGps.abort();
    }
    $.messager.progress({
        title: 'Searching',
        msg: 'Searching ' + value
    });
    xhrGps = $.ajax({
        url: 'php_script/device/search_device.php',
        dataType: 'json',
        type: 'post',
        data: params,
        success: function (result) {
            clearListViewDevice();
            clearDeviceMarkers();
            try {
                var total = parseInt(result.total, 10);
                if (total <= 0) {
                    $.messager.progress('close');
                    alert('Data Tidak Ditemukan');
                    return;
                }
            } catch (e) {
                alert(e);
                //console.log(e);
                return;
            }

            for (var i in result.rows) {
                try {
                    var v = result.rows[i];
                    parseDevice(v);
                    calcDelay(v);
                    var E = createDiv();
                    E.innerHTML = create_info(v);
                    listViewDevice.appendChild(E);
                    listViewDevices[v.id] = E;

                    var M = createMarker(v);
                    markers[v.id] = M;
                    vehicles.push(v);
                    vehicles2[v.id] = v;
                } catch (e) {
                    //console.log(e);
                }
            }
            $.messager.progress('close');
        }
    }).fail(function (e1, e2, e3) {
        $.messager.progress('close');
    }).always(function () {

    });
}
function createTravelDate() {
    var jam = parseInt(app.jamTravel.textbox('getValue'), 10) * 3600;
    var hari = parseInt(app.hariTravel.textbox('getValue'), 10) * 24 * 3600;
    var second = hari + jam;
    var date = new Date(second * 1000);
    var currDate = new Date();
    currDate.setDay
}
;
function reverseGeocoding(v) {
    var v;
    var found = false;
    for (var i in vehicles) {
        v = vehicles[i];
        if (v.geocoding === false) {
            continue;
        }
        if (parseInt(v.lat, 10) === 0 || parseInt(v.lng, 10) == 0) {
            continue;
        }
        found = true;
        break;
    }
    if (found === false) {
        setTimeout(function () {
            reverseGeocoding();
        }, 2000);
        return;
    }
    v.geocoding = false;
    geocodingLatLng(v);
}

function geocodingLatLng(v) {
    var latlng = {lat: parseFloat(v.lat), lng: parseFloat(v.lng)};
    ////console.log(latlng);
    app.geocoder.geocode({'location': latlng}, function (results, status) {
        var timeout = 3000;
        if (status === 'OK') {
            v.geo_error = 0;
            //console.log(results);
            if (results[1]) {
                v.address = results[1].formatted_address;
                var e = listViewDevices[v.id];
                if (e !== undefined) {
                    e.innerHTML = create_info(v);
                }
            } else {
                //console.log('No results found');
            }
        } else {
            v.geo_error++;
            //console.log('Geocoder failed due to: ' + status);
            timeout = 5000;
        }
        setTimeout(function () {
            reverseGeocoding();
        }, timeout);
    });
}
;

function geocodeLatLng(latlng, callback) {
    geocoder.geocode({'location': latlng}, function (results, status) {
        if (status === 'OK') {
            if (results[1]) {
                callback(results[1].formatted_address);
            } else {
                callback('No results found');
            }
        } else {
            callback('Geocoder failed due to: ' + status);
        }
    });
}
;
function getLocation(source) {
    var latlng = travel.marker.getPosition();
    switch (source) {
        case 'from':
            geocodeLatLng(latlng, function (address) {
                $("#form_track :input[id=asal]").textbox('setValue', address);
            });
            break;
        case 'to':
            geocodeLatLng(latlng, function (address) {
                $("#form_track :input[id=tujuan]").textbox('setValue', address);
            });
            break;
    }
}
;
function switchView(mode) {
    filterData.view = mode;
    if (filterData.view === 'list') {
        tabDevice.tabs('select', 'List');
    } else {
        tabDevice.tabs('select', 'Tree');
    }
}
function toTreeDevice(data) {
    var rows = data.rows;
    var group = data.groups;
    function exists(rows, reseller_id) {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].id === reseller_id)
                return true;
        }
        return false;
    }

    var nodes = [];
    // get the top level nodes
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (!exists(rows, row.reseller_id)) {
            nodes.push({
                id: row.id,
                text: row.text
            });
        }
    }

    var roots = [];
    for (var i = 0; i < nodes.length; i++) {
        roots.push(nodes[i]);
    }
    while (roots.length) {
        var root = roots.shift();    // the parent node
        // get the children nodes
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.reseller_id === root.id) {
                var child = {id: row.id, text: row.text};
                if (root.children) {
                    root.children.push(child);
                } else {
                    root.children = [child];
                }
                roots.push(child);
            }
        }
    }
    return nodes;
}
/* Events */
function onAlarmEmptyEvent() {
    $('#tabLeft').tabs('update', {
        tab: $('#tabEvent'),
        type: 'header',
        options: {
            iconCls: 'icon-alert'
        }
    });
}
function updateAnimationTabAlarm() {
    console.log('updateAnimationTabAlarm')
    var rows = gridAlarm.datagrid('getRows');
    var exists = rows.length > 0 ? true : false;
    $('#tabLeft').tabs('update', {
        tab: $('#tabEvent'),
        type: 'header',
        options: {
            iconCls: exists === true ? 'icon-animation' : 'icon-alarm16',
            title: exists === true ? 'Alarm : ' + rows.length : 'Event : 0'
        }
    });
//    $("#btnNotifyAlarm").linkbutton({
//        iconCls: rows.length > 0 ? 'icon-animation' : 'icon-ok16',
//        text: 'Invoice:' + rows.length
//    });
    if (exists) {
        playAlarmSound();
    }
}
/* App Change User*/
function changeUser(id) {
    //console.log('load data user:' + id);
    user_id = id;
    clearMap();
    clearData();

    if (app.cboVehicleGroup != undefined) {
        app.cboVehicleGroup.combobox('reload');
    }
    loadDevice();
    loadPoi();
    loadGeofence();
    loadAlarm();
    loadInvoice();
}
var xhrInvoice;
function loadInvoice() {
    if (xhrInvoice)
        xhrInvoice.abort();
    xhrInvoice = $.ajax({
        url: 'php_script/invoice/check_invoice.php',
        data: {user_id: user_id},
        success: function (result) {
            if (result.total > 0) {
                $("#btnNotifyInvoice").linkbutton({
                    iconCls: 'icon-animation',
                    text: 'Invoice:' + result.invoice
                })
            } else {
                $("#btnNotifyInvoice").linkbutton({
                    iconCls: 'icon-ok16',
                    text: 'Invoice:0'
                })
            }
        }
    });
}
function callbackLoadDevice() {
    if (vehicles.length > 0) {
        showData();
        loopUpdateDevice();
    }
    //gf.callback_loadgps(vehicles);
    initWebsocket();
    //loadAlarm();
    //loadQueueCommand();
    boundMarkers();
}


function computeTotalDistance(result) {
    travel.dist = 0;
    //travel.duration = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        travel.dist += myroute.legs[i].distance.value;
        //travel.duration += myroute.legs[i].duration.value;
    }
    var start = myroute.legs[0].start_location;
    var end = myroute.legs[myroute.legs.length - 1].end_location;

    travel.dist = travel.dist / 1000;
    travel.cost = $("#form_track :input[id=cost]").textbox('getValue');
    // travel.speed = $("#form_track :input[id=speed]").textbox('getValue');
    travel.total_cost = parseInt(travel.dist * travel.cost, 10);

    //estimasi 1 Km di tempuh 5 menit
    travel.duration = (travel.dist * 5) / 60; //to be hour

    var waktu = travel.duration;
    //console.log('waktu:' + waktu);

    var days = 0;
    var hours = 1;
    if (waktu >= 24) {
        days = parseInt(waktu / 24, 10);
        waktu = waktu % 24;
    }
    //console.log('days:' + days);

    if (waktu >= 1) { // jamwe
        hours = parseInt(waktu, 10);
    }
    if (days == 0 && hours == 0) {
        hours = 1;
    }

    var currDate = new Date();
    currDate.add(days).days();
    currDate.add(hours).hours();
    var dateStr = datetimeToString(currDate);
    //console.log(dateStr);

    travel.est_arrival = dateStr;

    $("#form_track :input[id=hari]").textbox('setValue', days);
    $("#form_track :input[id=jam]").textbox('setValue', hours);
    $("#form_track :input[id=est_arrival]").textbox('setValue', dateStr);
    //waktu=jarak/kecepatan

    travel.start_lat = start.lat();
    travel.start_lng = start.lng();

    travel.end_lat = end.lat();
    travel.end_lng = end.lng();


    ////console.log(travel.duration);
    // $("#form_track :input[id=est_time]").textbox('setValue', parseInt(travel.duration / 3600,10) );    
    //$("#form_track :input[id=est_time_descr]").textbox('setValue', secToTime(travel.duration));
    $("#form_track :input[id=dist]").textbox('setValue', parseInt(travel.dist, 10));
    $("#form_track :input[id=total_cost]").textbox('setValue', travel.total_cost.toLocaleString());

    geocodeLatLng(start, function (address) {
        $("#form_track :input[id=asal]").textbox('setValue', address);
        travel.start_addr = address;
    });
    geocodeLatLng(end, function (address) {
        $("#form_track :input[id=tujuan]").textbox('setValue', address);
        travel.end_addr = address;
    });
}
;
function secToTime(second) {
    var descr = '';
    if (second >= hari) {
        descr = parseInt(second / hari, 10) + ' Hari ';
        second = second % hari;
    }

    if (second >= jam) {
        descr += parseInt(second / jam, 10) + ' Jam ';
        second = second % jam;
    }
    if (second >= 60) {
        descr += parseInt(second / 60, 10) + ' Menit ';
        second = second % 60;
    }
    return descr;
}
function calcRoute(start, end) {
    var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    };
    if (Direction.render) {
        Direction.render.setMap(null);
    }
    Direction.render = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map
    });
    Direction.render.addListener('directions_changed', function () {
        computeTotalDistance(Direction.render.getDirections());
    });
    Direction.service.route(request, function (result, status) {
        if (status == 'OK') {
            Direction.render.setDirections(result);
        }
    });
}
;
function createMarker_track(latlng, icon) {
    var poi = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: 'icon/app/' + icon,
        draggable: true
    });
    //Event Listener DragEnd POI

    return poi;
}
;
function parseDevice(v) {
    v.id = parseInt(v.id, 10);
    v['visible'] = true;
    v.tdate = (v.tdate === null) ? '2000-01-01 10:00:00' : v.tdate;
    v.sdate = (v.sdate === null) ? '2000-01-01 10:00:00' : v.sdate;
    v.park_date = (v.park_date === null) ? '2000-01-01 10:00:00' : v.park_date;
    v.acc = parseInt(v.acc, 10);
    v.park = v.park !== undefined ? parseInt(v.park, 10) : 0;
    if (v.park == 1) {
        v['park_info'] = delayTimeFromMS(create_date() - datetimeFromString(v.park_date));
    } else {
        v['park_info'] = '';
    }
    v.user_id = parseInt(v.user_id, 10);
    v.vh_group = v.vh_group !== undefined ? parseInt(v.vh_group, 10) : 0;
    v.gsm = parseInt(v.gsm, 10);
    v.sat = parseInt(v.sat, 10);
    v.speed = isNaN(parseFloat(v.speed)) ? 0 : parseFloat(v.speed);
    v.angle = isNaN(parseFloat(v.angle)) ? 0 : parseFloat(v.angle);
    v.batt = isNaN(parseInt(v.batt, 10)) ? 0 : parseInt(v.batt, 10);
    v.charge = parseInt(v.charge, 10);
    v.lat = isNaN(parseFloat(v.lat)) ? 0 : parseFloat(v.lat);
    v.lng = isNaN(parseFloat(v.lng)) ? 0 : parseFloat(v.lng);
    v.odo = isNaN(v.odo) ? 0 : parseInt(v.odo, 10);
    v.max_odo = isNaN(parseInt(v.max_odo, 10)) ? 0 : parseInt(v.max_odo, 10);
    v.alarm = isNaN(v.alarm) ? 0 : parseInt(v.alarm, 10);
    v.max_park = isNaN(parseInt(v.max_park, 10)) ? 0 : parseInt(v.max_park, 10);
    v.max_idle = isNaN(parseInt(v.max_idle, 10)) ? 0 : parseInt(v.max_idle, 10);
    v.fcut = parseInt(v.fcut, 10);
    v.status = 'off';
    v.delay = 0;
    v.delayInfo = 'Detik';
}
var xhrGps;
function loadDevice() {
    //console.log('load_gps');
    //Check is map_loaded, if not wait...
    if (map_loaded === false) {
        setTimeout("loadDevice();", 1500);
        return;
    }
    clearData();
    if (xhr) {
        xhr.abort();
    }
    $.messager.progress({
        title: 'Loading Data',
        msg: 'Please Wait... Loading Data...'
    });
    xhr = $.ajax({
        url: 'php_script/device/load_device.php',
        type: 'POST', dataType: 'json',
        data: {user_id: user_id, multiuser: config.multiuser},
        success: function (result) {
            //console.log(result);
            for (var i in result.group) {
                var g = result.group[i];
                g.id = parseInt(g.id, 10);
                groups.push({id: g.id, vh_group: g.vh_group, level: 2});
            }
            for (var i in result.rows) {
                var v = result.rows[i];
                if (v.park >= 1) {
                    try {
                        v['park_second'] = get_park_second(v.park_date);
                    } catch (e) {
                        v['park_second'] = 0;
                    }
                }

                parseDevice(v);
                calcDelay(v);

                //penanda,jika gps berhenti stip reverse geocoding dari google
                v['stop'] = v.speed <= 3 ? true : false;

                if (v.status === 'off') {
                    gpsStatus.off++;
                } else {
                    gpsStatus.on++;
                }
                markers[v.id] = createMarker(v);
                labels.push(mapLabel(v.id, v.nopol, markers[v.id]));
                vehicles.push(v);
                vehicles2[v.id] = v;
            }
            if (vehicles.length === 1) {
                for (var i in markers) {
                    map.setCenter(markers[i].getPosition());
                    map.setZoom(15);
                }
            }
            callbackLoadDevice();
        }
    }).done(function () {
    }).always(function () {
        $.messager.progress('close');
    }).fail(function (e) {
        //console.log(e)
        setTimeout(function () {
            loadDevice();
        }, 10000);
    });
}
;

function selectDevice(id) {
    var v = vehicles2[id];
    if (v == undefined)
        return;
    //$("#cboVehicle").combobox('setValue', v.id);
    //$("#cboVehicle").combobox('setText', v.nopol);
    if (vh_id !== v.id) {
        vh_id = v.id;
        app.init_polyline();
    }

    app.marker = markers[id];
    if (app.marker == undefined)
        return;
    map.setZoom(16);
    map.setCenter(app.marker.getPosition());
    google.maps.event.trigger(app.marker, 'click');

    if (streetViewActive) {
        if (panorama === null || panorama === undefined) {
            //console.log('panorama === null || panorama === undefined');
            return;
        }
        panorama.setPosition(app.marker.getPosition());
        var pov = panorama.getPov();
        pov.heading = v.angle;
        panorama.setPov(pov);
    }

}
function parseDateTime(d)
{
    var p = d.split(' ');
    var q = p[0].split('-');
    var r = p[1].split(':');
    return new Date(q[0], q[1] - 1, q[2], r[0], r[1], r[2]);
}
;
function createDate() {
    var offset = 7;
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000 * offset));
    return nd;
}
;
function calcDelay(v)
{
    var currDate = createDate();
    var tdate;
    try {
        tdate = parseDateTime(v.tdate);
    } catch (e) {
        v['status'] = 'off';
        v['delayInfo'] = 'Offline';
        return;
    }
    var delay = 0;
    var second = parseInt(currDate - tdate) / 1000;
    if (second < 61) {
        delay = second / 60;
        delay = delay.toFixed(0);
        v['status'] = (v.acc === 1) ? "on" : "stop";
        v['delayInfo'] = delay + ' Detik';
        return;
    }

    if (second < jam) {
        delay = second / 60;
        delay = delay.toFixed(0);
        v['status'] = (v.acc == 1) ? "on" : "stop";
        v['delayInfo'] = delay + ' Menit';
        return;
    }

    if (second < hari) {
        delay = second / jam;
        delay = delay.toFixed(0);
        v['status'] = 'off';
        v['delayInfo'] = delay + ' Jam';
        return;
    }

    if (second < bulan) {  //Hari
        delay = second / hari;
        delay = delay.toFixed(0);
        v['status'] = 'off';
        v['delayInfo'] = delay + ' Hari';
        return;
    }

    v['status'] = 'off';
    v['delayInfo'] = '1 Bulan >';
}
;
//app.searchbox_vehicle = function (value, name) {
//    //console.log(value + ',' + name);
//    filterData.filter = "search";
//    filterData.field_name = name;
//    filterData.value = value;
//    //showListViewDevice();
//    clearListViewDevice();
//    if (xhrGps) {
//        xhrGps.abort();
//    }
//    xhrGps = $.ajax({
//        dataType: 'json',
//        type: 'post',
//        url: 'php_script/search_gps.php',
//        data: {'field': name, 'search': value},
//        success: function (result) {
//            //console.log(result);
//            try {
//                var total = parseInt(result.total, 10);
//                if (total <= 0)
//                    return;
//            } catch (e) {
//                return;
//            }
//
//            for (var i in result.rows) {
//                var v = result.rows[i];
//                parseDevice(v);
//                calcDelay(v);
//                var E = createDiv();
//                E.innerHTML = create_info(v);
//                listViewDevices[v.id] = E;
//            }
//        }
//    });
//};
var timerUpdate;
function loopUpdateDevice() {
    if (timerUpdate > 0) {
        clearTimeout(timerUpdate);
    }
    gpsStatus.off = 0;
    gpsStatus.on = 0;
    gpsStatus.park = 0;

    for (var i in vehicles) {
        var v = vehicles[i];
        calcDelay(v);
        if (v.park >= 1) {
            try {
                v['park_second'] = get_park_second(v.park_date);
            } catch (e) {
                v['park_second'] = 0;
            }
        }
        if (v.status == 'off') {
            gpsStatus.off++;
        } else {
            gpsStatus.on++;
        }
        if (filterData.view == 'list') {
            updateListViewItem(v);
        } else {
            //app.update_tree(v);
        }
    }
    updateOnlineOffline();
    //Update Summary
    updateSummary();
    timerUpdate = setTimeout("loopUpdateDevice();", 30000);
}
;
function filterSummary(value, name) {
    //console.log(value + '-' + name);
    summary.filterCategory = name;
    summary.filterValue = value;
    updateSummary();
}
;
function updateSummary() {
    if (gridSummary === undefined)
        return;
    if (sumHandler > 0) {
        clearTimeout(sumHandler);
    }
    $("#gridSummary").datagrid('loading');
    var temp = [];
    ////console.log('summary.filterValue:' + summary.filterValue);
    switch (summary.filterValue)
    {
        case '':
            for (var i in vehicles) {
                temp.push(vehicles[i]);
            }
            break;
        default:
            var search = summary.filterValue.trim();
            if (summary.filterCategory !== 'park') {
                search = search.toLowerCase();
            } else {
                search = parseInt(search, 10) * 1000; //jam to milisecond
            }
            for (var i in vehicles) {
                var q = "";
                var v = vehicles[i];
                switch (summary.filterCategory) {
                    case "region":
                        if (v.address == undefined || v.address == "")
                            continue;
                        q = v.address.toLowerCase();
                        if (q.indexOf(search) !== -1) {
                            temp.push(v);
                        }
                        break;
                    case "nopol":
                        if (v.nopol == undefined || v.nopol == "")
                            continue;
                        q = v.nopol.toLowerCase();
                        if (q.indexOf(search) !== -1) {
                            temp.push(v);
                        }
                        break;
                    case 'park':
                        if (v.park_second >= search) {
                            temp.push(v);
                        }
                        break;
                }
            }
            break;
    }
    $("#gridSummary").datagrid('loadData', temp);
    $("#gridSummary").datagrid('loaded');
}
function showData() {
    if (filterData.view === 'list') {
        showListViewDevice();
    } else {
        showTreeDevice();
    }
    updateOnlineOffline();
}

function showListViewDevice(status) {
    if (status === undefined)
        status = 'all';
    listViewDevices = [];
    listViewDevices.length = 0;
    listViewDevice.innerHTML = '';
    for (var i in vehicles) {
        var v = vehicles[i];
        if (status === 'all') {
            var E = createDiv();
            E.innerHTML = create_info(v);
            listViewDevice.appendChild(E);
            listViewDevices[v.id] = E;
        } else if ((status === 'on') && (v.status !== 'off')) {
            var E = createDiv();
            E.innerHTML = create_info(v);
            listViewDevice.appendChild(E);
            listViewDevices[v.id] = E;
        } else if ((status === 'off') && (v.status === 'off')) {
            var E = createDiv();
            E.innerHTML = create_info(v);
            listViewDevice.appendChild(E);
            listViewDevices[v.id] = E;
        }
    }
}

function filterByField(field) {
    listViewDevices = [];
    listViewDevices.length = 0;
    listViewDevice.innerHTML = '';
    var found = false;
    var search = filterData.value.toLowerCase();
    for (var i in vehicles) {
        var v = vehicles[i];
        var target = v[field].toLowerCase();
        if (target.indexOf(search) !== -1) {
            found = true;
            var E = createDiv();
            E.innerHTML = create_info(v);
            listViewDevice.appendChild(E);
            listViewDevices[v.id] = E;
        }
    }
    //try search to server
}
;
function filterByStatus(status) {
    listViewDevices = [];
    listViewDevices.length = 0;
    listViewDevice.innerHTML = '';
    for (var i in vehicles) {
        var v = vehicles[i];
        if (status === 'all') {
            var E = createDiv();
            E.innerHTML = create_info(v);
            listViewDevice.appendChild(E);
            listViewDevices[v.id] = E;
        } else if ((status === 'on') && (v.status !== 'off')) {
            var E = createDiv();
            E.innerHTML = create_info(v);
            listViewDevice.appendChild(E);
            listViewDevices[v.id] = E;
        } else if ((status === 'off') && (v.status === 'off')) {
            var E = createDiv();
            E.innerHTML = create_info(v);
            listViewDevice.appendChild(E);
            listViewDevices[v.id] = E;
        }
    }
}
;
app.open_window = function (vh_id) {
    var v = vehicles2[vh_id];
    if (v !== undefined) {
        window.open("playback.php?id=" + v.id + "&nopol=" + v.nopol);
    } else {
        alert('Vehicle not found');
    }
};
function showTreeDevice() {
    var addToTree = false;
    var attached = false;
    //Show tree Data
    var root = {id: 0, level: 1, text: "Semua Kendaraan", children: []};
    switch (filterData.filter) {
        case 'on':
            root.text = "Kendaraan Online";
            break;
        case 'off':
            root.text = "Kendaraan Offline";
            break;
    }
    //Attach group to root
    for (var i in groups) {
        var g = groups[i];
        //console.log(g);
        root['children'].push({
            id: 'group_' + g.id, //hack, add group_ prefix
            group_id: g.id,
            text: g.vh_group,
            level: 2,
            iconCls: 'icon-folder',
            children: []
        });
    }

    for (var i in vehicles) {
        addToTree = false;
        var v = vehicles[i];
        //if (v.update === false)
        //    continue;
        switch (filterData.filter) {
            case 'on':
                if (v.status !== 'off') {
                    addToTree = true;
                }
                break;
            case 'off':
                if (v.status === 'off') {
                    addToTree = true;
                }
                break;
            default:
                addToTree = true;
                break;
        }
        if (addToTree === false)
            continue;

        attached = false;
        if (v.vh_group > 0) {
            for (var j in root.children) {
                var r = root.children[j];
                //console.log('group_id:' + r.group_id + ':' + v.vh_group);
                if ((r.group_id === v.vh_group) && (r.level === 2)) {
                    r.children.push({
                        id: v.id,
                        text: v.nopol,
                        level: 3,
                        iconCls: 'icon-' + v.status
                    });
                    attached = true;
                    break;
                }
            }
        }
        if (attached === true)
            continue;
        root['children'].push({
            id: v.id,
            level: 3,
            checked: false,
            iconCls: 'icon-' + v.status,
            text: v.nopol
        });

    }
    treeDevice.tree('loadData', [root]);
}
function createDiv() {
    var element = document.createElement('div');
    element.className = 'box';
    return element;
}
function createDivAlarm() {
    var element = document.createElement('div');
    element.className = 'alarm';
    return element;
}

function updateOnlineOffline() {
    btnGpsAll.linkbutton({iconCls: 'icon-vehicle16', text: "All (" + (gpsStatus.on + gpsStatus.off) + ")"});
    btnGpsOn.linkbutton({iconCls: 'icon-on16', text: "On (" + gpsStatus.on + ")"});
    btnGpsOff.linkbutton({iconCls: 'icon-off16', text: "Off (" + gpsStatus.off + ")"});
}
function clearDeviceMarkers() {
    if (markers) {
        for (var i in markers) {
            markers[i].setMap(null);
        }
        markers = [];
        markers.length = 0;
    }
    if (labels) {
        for (var i in labels) {
            labels[i].setMap(null);
        }
        labels = [];
        labels.length = 0;
    }
}
;
function clearMap() {
    clearDeviceMarkers();
    clearPoiMarkers();
    if (polyline) {
        polyline.setMap(null);
    }
}
function clearData() {
    vehicles = [];
    vehicles.length = 0;
    vehicles2 = [];
    vehicles2.length = 0;
    groups = [];
    groups.length = 0;
    totalGpsOn = 0;
    totalGpsOff = 0;
    if (listViewDevice) {
        listViewDevice.innerHTML = '';
    }
    listViewDevices = [];
    listViewDevices.length = 0;

    if (listViewAlarm) {
        listViewAlarm.innerHTML = '';
    }

    listViewAlarms = [];
    listViewAlarms.length = 0;


    gpsStatus.on = 0;
    gpsStatus.off = 0;
    gpsStatus.park = 0;
    clearDeviceMarkers();
    updateOnlineOffline();
}

function clearListViewDevice() {
    if (listViewDevice) {
        listViewDevice.innerHTML = '';
    }
    listViewDevices = [];
    listViewDevices.length = 0;
}
;
function createMarker(v) {
    ////console.log('createMarker');
    var ll = new google.maps.LatLng(parseFloat(v.lat), parseFloat(v.lng));
    var m = new google.maps.Marker({
        position: ll,
        map: map,
        icon: createIcon(v.object_type, v.angle, v.status, v.park)
    });
    google.maps.event.addListener(m, 'click', function () {
        if (vh_id !== v.id) {
            app.clear_polyline();
            app.init_polyline();
        }

        app.marker = m;
        vh_id = v.id;
        if (iw != undefined)
            iw.close();
        iw = new google.maps.InfoWindow({content: create_infowindow(v), maxWidth: 250});
        iw.setPosition(ll);
        iw.open(map, m);
    });
    return m;
}
;

function createIcon(object_type, angle, status) {
    var image = {};
    if ((angle >= 337.0) || ((angle >= 0.0) && (angle <= 22.0))) {
        image.url = 'icon/gps/' + object_type + '/' + status + '_0.png';
        image.scaledSize = new google.maps.Size(20, 41);
        image.anchor = new google.maps.Point(10, 20);
    } else if ((angle >= 22.0) && (angle <= 67.0)) {
        image.url = 'icon/gps/' + object_type + '/' + status + '_45.png';
        //image.size = new google.maps.Size(41, 41);
        image.scaledSize = new google.maps.Size(41, 41);
        image.anchor = new google.maps.Point(20, 20);
    } else if ((angle >= 67.0) && (angle <= 112.0)) {
        image.url = 'icon/gps/' + object_type + '/' + status + '_90.png';
        //image.size = new google.maps.Size(41, 20);
        image.scaledSize = new google.maps.Size(41, 20);
        image.anchor = new google.maps.Point(20, 10);
    } else if ((angle >= 112.0) && (angle <= 157.0)) {
        image.url = 'icon/gps/' + object_type + '/' + status + '_135.png';
        //image.size = new google.maps.Size(41, 41);
        image.scaledSize = new google.maps.Size(41, 41);
        image.anchor = new google.maps.Point(20, 20);
    } else if ((angle >= 157.0) && (angle <= 202.0)) {
        image.url = 'icon/gps/' + object_type + '/' + status + '_180.png';
        //image.size = new google.maps.Size(20, 41);
        image.scaledSize = new google.maps.Size(20, 41);
        image.anchor = new google.maps.Point(10, 20);
    } else if ((angle >= 202.0) && (angle <= 247.0)) {
        image.url = 'icon/gps/' + object_type + '/' + status + '_225.png';
        //image.size = new google.maps.Size(41, 41);
        image.scaledSize = new google.maps.Size(41, 41);
        image.anchor = new google.maps.Point(20, 20);

    } else if ((angle >= 247.0) && (angle <= 292.0)) {
        image.url = 'icon/gps/' + object_type + '/' + status + '_270.png';
        //image.size = new google.maps.Size(41, 20);
        image.scaledSize = new google.maps.Size(41, 20);
        image.anchor = new google.maps.Point(20, 10);
    } else if ((angle >= 292.0) && (angle <= 337.0)) {
        image.url = 'icon/gps/' + object_type + '/' + status + '_315.png';
        //image.size = new google.maps.Size(41, 41);
        image.scaledSize = new google.maps.Size(41, 41);
        image.anchor = new google.maps.Point(20, 20);
    }
    return image;
}
;
function mapLabel(id, nopol, marker)
{
    var label = new Label({
        id: id, map: map
    });
    label.bindTo('position', marker, 'position');
    label.set('text', nopol);
    return label;
}
;


//var xhrTravel;
function finishTravel(id) {
    $.messager.confirm('Confirm', 'Finish Travel?', function (r) {
        if (r) {

            $.messager.progress({
                title: 'Update Data',
                msg: 'Please Wait...'
            });
            var data = {
                mode: 'finish',
                id: id,
                user_id: user_id
            };
            xhrShipment = $.ajax({
                url: 'php_script/save_travel.php',
                dataType: 'json',
                type: 'post',
                data: data,
                success: function (result) {
                    $.messager.show({
                        title: result.code,
                        msg: result.msg
                    });
                    app.load_shipment();
                }
            }).done(function () {
            }).always(function () {
                $.messager.progress('close');
            }).fail(function (e1, e2, e3) {
                $.messager.show({
                    title: 'Error',
                    msg: e1.responseText
                });
            });
        }
    });
}
;
function cancelTravel(id) {
    $.messager.confirm('Confirm', 'Cancel Travel?', function (r) {
        if (r) {
            var data = {
                mode: 'cancel',
                id: id,
                user_id: user_id
            };
            $.messager.progress({
                title: 'Cancel Data',
                msg: 'Please Wait...'
            });
            xhrShipment = $.ajax({
                url: 'php_script/save_travel.php',
                dataType: 'json',
                type: 'post',
                data: data,
                success: function (result) {
                    $.messager.show({
                        title: result.code,
                        msg: result.msg
                    });
                    app.load_shipment();
                }
            }).done(function () {
            }).always(function () {
                $.messager.progress('close');
            }).fail(function (e1, e2, e3) {
                $.messager.show({
                    title: 'Error',
                    msg: e1.responseText
                });
            });
        }
    });
}
;
function deleteTravel(id) {
    $.messager.confirm('Confirm', 'Delete Record?', function (r) {
        if (r) {
            var data = {
                mode: 'delete',
                id: id,
                user_id: user_id
            };
            $.messager.progress({
                title: 'Delete Data',
                msg: 'Please Wait...'
            });
            xhrShipment = $.ajax({
                url: 'php_script/save_travel.php',
                dataType: 'json',
                type: 'post',
                data: data,
                success: function (result) {
                    $.messager.show({
                        title: result.code,
                        msg: result.msg
                    });
                    app.load_shipment();
                }
            }).done(function () {
            }).always(function () {
                $.messager.progress('close');
            }).fail(function (e1, e2, e3) {
                $.messager.show({
                    title: 'Error',
                    msg: e1.responseText
                });
            });
        }
    });
}
;

var reconnectCountDown = 0;
var wsHandler;
function initWebsocket() {
    websocket = new WebSocket(config.ws_server);
    websocket.onopen = function (evt) {
        //console.log('websocket.onopen');
        wsHandler = setTimeout(function () {
            var xml = "login," + user_id + "," + config.session;
            //console.log(xml);
            websocket.send(xml);
        }, (5 * 1000));
    };
    websocket.onclose = function (evt) {
        //console.log('websocket.onclose');
        if (wsHandler) {
            clearTimeout(wsHandler);
        }
        wsHandler = setTimeout(function () {
            initWebsocket();
        }, (10 * 1000));
    };
    websocket.onerror = function (evt) {
        //console.log('websocket.onerror');
        if (wsHandler) {
            clearTimeout(wsHandler);
        }
        wsHandler = setTimeout(function () {
            initWebsocket();
        }, 10 * 1000);
    };
    websocket.onmessage = function (evt) {
        var data = JSON.parse(evt.data);
        ////console.log(data);
        if (data.type === undefined)
            return;

        switch (data.type) {
            case 'gps':
                updateDevice(data);
                break;
            case 'response':
                $.messager.alert(data.type, data.msg);
                //console.log(data);
                break;
        }
    };
}
;

function updateDevice(newv) {
    var oldv = vehicles2[newv.id];
    if (oldv === undefined)
        return;
    oldv.tdate = newv.tdate;
    oldv.sdate = newv.sdate;
    oldv.poi = newv.poi;
    oldv['park_info'] = newv.park_info;
    oldv.address = newv.address === '' || newv.address === null ? oldv.address : newv.address;
    oldv.speed = parseFloat(newv.speed);
    oldv.angle = parseFloat(newv.angle);
    oldv.lat = parseFloat(newv.lat);
    oldv.lng = parseFloat(newv.lng);
    oldv.acc = newv.acc;
    if (oldv.speed >= 5) {
        oldv.acc = 1;
    }
    oldv.charge = newv.charge;
    oldv.batt = newv.batt;
    oldv.sat = newv.sat;
    oldv.fcut = newv.fcut;
    oldv.alarm = parseInt(newv.alarm, 10);
    oldv.odo = parseInt(newv.odo, 10);
    oldv.gf = newv.gf;
    oldv.gsm = newv.gsm;
    calcDelay(oldv);

    if ((oldv.status === 'off') && (newv.status !== 'off')) {
        totalGpsOn++;
        totalGpsOff--;
    } else if ((oldv.status !== 'off') && (newv.status === 'off')) {
        totalGpsOn--;
        totalGpsOff++;
    }
    if (oldv.alarm > 0) {
        updateAnimationTabAlarm(oldv);

    }

    var m = markers[oldv.id];
    if (m === undefined) {
        return;
    }
    var newLatLng = new google.maps.LatLng(oldv.lat, oldv.lng);
    m.setPosition(newLatLng);


    var newIcon = createIcon(oldv.object_type, oldv.angle, oldv.status);
    m.setIcon(newIcon);

    if (vh_id === oldv.id)
    {
        map.setCenter(newLatLng);
        if (polyline === undefined) {
            app.init_polyline();
        }
        var path = polyline.getPath();
        path.push(newLatLng);
        if (streetViewActive) {
            if (panorama === null || panorama === undefined) {
                //console.log('panorama === null || panorama === undefined');
                return;
            }
            panorama.setPosition(newLatLng);
            var pov = panorama.getPov();
            pov.heading = oldv.angle;
            panorama.setPov(pov);
        }
    }
    switch (filterData.view) {
        case 'list':
            updateListViewItem(oldv);
            break;
        case 'tree':
            var node = treeDevice.tree('find', oldv.id);
            if (node !== null) {
                treeDevice.tree('update', {
                    checked: false,
                    target: node.target,
                    iconCls: 'icon-' + oldv.status
                });
            }
            break;
    }
}
/* Formats */

function viewMap(id) {
    app.mainTabs.tabs('select', 'Map');
    selectDevice(id);
}
;

var handlerCommand;
function enable_alarm_park(val) {
    if (handlerCommand) {
        handlerCommand.abort();
    }
    if (parseInt(val, 10) === 0)
    {
        $.messager.confirm('Confirm', 'Disable Alarm Parkir', function (r) {
            if (r) {
                handlerCommand = $.ajax({
                    url: 'php_script/enable_alarm_parkir.php',
                    dataType: 'json',
                    type: 'post',
                    data: {vh_id: vh_id, max_park: 0},
                    success: function (result) {
                        $.messager.alert(result.code, result.msg, 'Information');
                    },
                    error: function (e1, e2, e3) {
                        if (e1.status === 404) {
                            alert('URL Not Found');
                        } else {
                            alert(e1.statusText);
                        }
                    }
                });
            }
        });
    } else {
        $.messager.prompt('Prompt', 'Batas Parkir (Menit):', function (r) {
            if (r) {
                //////console.log(r);
                var jam = parseInt(r);
                if (isNaN(jam)) {
                    alert('Masukkan Angka');
                    return;
                }
                handlerCommand = $.ajax({
                    url: 'php_script/enable_alarm_parkir.php',
                    dataType: 'json',
                    type: 'post',
                    data: {vh_id: vh_id, max_park: jam},
                    success: function (result) {
                        $.messager.alert(result.code, result.msg, 'Information');
                    },
                    error: function (e1, e2, e3) {
                        if (e1.status === 404) {
                            alert('URL Not Found');
                        } else {
                            alert(e1.statusText);
                        }
                    }
                });
            }
        });
    }

}
function enable_alarm_oil(val) {
    if (handlerCommand) {
        handlerCommand.abort();
    }
    if (parseInt(val, 10) === 0) {
        $.messager.confirm('Confirm', 'Disable Alarm Ganti Oli', function (r) {
            if (r) {
                handlerCommand = $.ajax({
                    url: 'php_script/enable_alarm_oil.php',
                    dataType: 'json',
                    type: 'post',
                    data: {vh_id: vh_id, dist_change_oil: 0},
                    success: function (result) {
                        //////console.log(result);
                        $.messager.alert(result.code, result.msg, 'Information');
                    },
                    error: function (e1, e2, e3) {
                        if (e1.status === 404) {
                            alert('URL Not Found');
                        } else {
                            alert(e1.statusText);
                        }
                    }
                });
            }
        });
    } else {
        $.messager.prompt('Prompt', 'Masukkan (Km) Ganti Oli:', function (r) {
            if (r) {
                var jarak = parseFloat(r);
                if (isNaN(val)) {
                    alert('Masukkan Angka');
                    return;
                }
                handlerCommand = $.ajax({
                    url: 'php_script/enable_alarm_oil.php',
                    dataType: 'json',
                    type: 'post',
                    data: {vh_id: vh_id, dist_change_oil: jarak},
                    success: function (result) {
                        //////console.log(result);
                        $.messager.alert(result.code, result.msg, 'Information');
                    },
                    error: function (e1, e2, e3) {
                        if (e1.status === 404) {
                            alert('URL Not Found');
                        } else {
                            alert(e1.statusText);
                        }
                    }
                });
            }
        });
    }

}
var sumHandler = 0;
function loopSummary() {
    if (sumHandler > 0) {
        clearTimeout(sumHandler);
    }
    $("#gridSummary").datagrid('loadData', {"total": 0, "rows": []});
    $("#gridSummary").datagrid('loading');
    if (vehicles)
    {
        var temp = [];
        if (filterValue !== undefined)
        {
            ////////console.log('filterValue mode on');
            var search = filterValue.trim();
            search = search.toLowerCase();
            for (var i in vehicles) {
                var q = "";
                var v = vehicles[i];
                if (v.park == 1) {
                    v['park_info'] = msToDateDescr(new Date() - parseDateTime(v.park_date));
                    //console.log(v['park_info']);
                }
                switch (filterCategory) {
                    case "region":
                        if (v.address != undefined) {
                            q = v.address.toLowerCase();
                        }
                        break;
                    case "nopol":
                        if (v.nopol != undefined) {
                            q = v.nopol.toLowerCase();
                        }
                        break;
                }
                if (filterCategory == 'park') {
                    var hour = calc_park_second(v.park_date, 1);
                    //console.log('hour:' + hour);
                    if (hour >= 1) {
                        temp.push(v);
                    }
                } else {
                    if (q.indexOf(search) !== -1) {
                        temp.push(v);
                    }
                }
            }
        } else {
            //Normal mode
            ////////console.log('filterValue mode off');
            for (var i in vehicles) {
                // //////console.log('filterValue mode off');
                temp.push(vehicles[i]);
            }
        }
        if (temp.length > 0) {
            $("#gridSummary").datagrid({loadFilter: pagerFilter}).datagrid('loadData', temp);
        }
    }
    $("#gridSummary").datagrid('loaded');
    sumHandler = setTimeout("loopSummary();", 10000);
}
function clear_summary() {
    gridDevice.datagrid('loadData', {"total": 0, "rows": []});
}
function updateListViewItem(v) {
    var E = listViewDevices[v.id];
    if (E != undefined) {
        E.innerHTML = create_info(v);
    }
}

var isFull = false;
fullscreen = function () {
    if (!isFull) {
        isFull = true;
        //mainLayout.layout('collapse', 'north');
        mainLayout.layout('remove', 'north');
    } else {
        isFull = false;
        //mainLayout.layout('expand', 'north');
        mainLayout.layout('add', {
            region: 'north',
            href: 'php_script/mymenu.php'
        });
    }
};
function editDevice(id) {
    var row = vehicles2[id];
    if (row === undefined) {
        alert('Pilih GPS');
        return;
    }
    row['mode'] = 'edit_simple';
    formDevice.form('load', row);
    dlgDevice.dialog('setTitle', 'Edit - GPS');
    dlgDevice.dialog('open');
}

function saveDevice() {
    if (xhr) {
        xhr.abort();
    }
    var isValid = app.form_gps.form('validate');
    if (!isValid) {
        $.messager.show({title: 'Error', msg: 'Form Tidak Boleh Kosong'});
        return;
    }
    var serialized = app.form_gps.serialize();
    //console.log(serialized);
    $.messager.progress({title: 'Menyimpan', msg: 'Sedang Menyimpan Perubahan'});
    xhr = $.ajax({
        url: 'php_script/save_gps.php',
        type: 'POST',
        dataType: 'json',
        data: serialized,
        success: function (result) {
            //console.log(result);
            $.messager.show({title: result.code, msg: result.msg});
            if (result.code == 'SUCCESS')
            {
                dlgGps.dialog('close');
                changeUser(user_id);
            }
        }
    }).always(function () {
        $.messager.progress('close');
    }).done(function () {
    }).fail(function (e1, e2, e3) {
        //console.log(e1);
    });
}
;
edit_gps_tree = function () {
    var node = treeGps.tree('getSelected');
    //if (node == null || node == undefined)
    if (node.id === undefined)
        return;
    var row = vehicles[node.id];
    edit_gps(row);
};
function delete_vehicle_data(id) {
    delete vehicles[id];
}
function delete_gps() {
    var row = $("#gridSummary").datagrid('getSelected');
    if (row == null)
        return;
    var r = confirm("Delete GPS: " + row.nopol + " ?");
    if (r == true) {
        $.messager.progress({
            title: 'Loading Data',
            msg: 'Please Wait... Loading Data...'
        });
        xhr = $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: 'php_script/save_gps.php',
            data: 'mode=delete&id=' + row.id + '&' + row,
            success: function (result) {
                if (result.code == 'SUCCESS') {
                    //////console.log(row);
                    delete_vehicle_data(row.id);
                }
                $.messager.progress('close');
                $.messager.show({title: result.code, msg: result.msg});
                show_summary();
            }
        }).always(function () {
            $.messager.progress('close');
        });
    }
//dlgGps.dialog('open');
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

function clear_grid_gps() {
    gridGps.datagrid('loadData', {"total": 0, "rows": []});
}
function clear_grid_alarm() {
    gridAlarm.datagrid('loadData', {"total": 0, "rows": []});
}
function show_summary() {
    $("#gridSummary").datagrid('loadData', {"total": 0, "rows": []});
    $("#gridSummary").datagrid({loadFilter: pagerFilter}).datagrid('loadData', vehicles);
}

add_tab = function (name) {
    switch (name) {
        case 'Edit GPS':
            if (mainTabs.tabs('exist', 'Edit GPS') == true) {
                mainTabs.tabs('select', 'Edit GPS');
                return;
            }
            mainTabs.tabs('add', {
                title: name,
                closeable: true,
                content: '<table id="tblEditGps" class="easyui-datagrid" style="width:100px;height:100px;" data-options="rownumbers:true,singleSelect:true,autoRowHeight:true,autoColWidth:true,pagination:false,pageSize:200,pageList:[50,100,200]" fit="true"></table>'
            });
            break;
    }
};
select_group = function (node) {
    var bounds = new google.maps.LatLngBounds();
    var total = 0;
    $.each(node.children, function (i, child)
    {
        ////////console.log(child);
        if (child.level == 3) {
            var lat = parseFloat(child.lat);
            var lng = parseFloat(child.lng);
            if (!isNaN(lat) && !isNaN(lng)) {
                var latlng = new google.maps.LatLng(lat, lng);
                bounds.extend(latlng);
                total++;
            }
        } else if (child.level == 2) {
            if (child.children != undefined && child.children != null) {
                for (var j in child.children) {
                    var subchild = child.children[j];
                    //////console.log(subchild);
                    var lat = parseFloat(subchild.lat);
                    var lng = parseFloat(subchild.lng);
                    if (!isNaN(lat) && !isNaN(lng)) {
                        var latlng = new google.maps.LatLng(lat, lng);
                        bounds.extend(latlng);
                        total++;
                    }
                }
            }
        }
    });
    if (total > 0) {
        map.fitBounds(bounds);
    }
};
function boundMarkers() {
    var bounds = new google.maps.LatLngBounds();
    var total = 0;
    for (var i in markers) {
        var m = markers[i];
        if (m.getPosition().lat != 0.0 && m.getPosition().lng != 0.0) {
            bounds.extend(m.getPosition());
            total++;
        }
    }

    if (total > 0) {
        map.fitBounds(bounds);
    }
}

/* Alarm */
var xhrAlarm = null;
var xhrAlarm;
app.del_alarm = function () {
    if (xhrAlarm) {
        xhrAlarm.abort();
    }

    //get selected alarm, then delete
    var rows = app.gridAlarm.datagrid('getChecked');
    //////console.log(rows);
    if (rows.length <= 0) {
        alert('Pilih alarm untuk dihapus');
        return;
    }
    var ids = "";
    for (var i in rows) {
        if (ids !== "") {
            ids += "," + rows[i].id;
        } else {
            ids = rows[i].id;
        }
    }
    //////console.log(ids);
    xhrAlarm = $.ajax({
        url: 'php_script/del_alarm.php',
        type: 'POST',
        dataType: 'json',
        data: {id: ids},
        success: function (result) {
            //////console.log(result);
            if (result.code === 'SUCCESS') {
                app.gridAlarm.datagrid('reload');
            }
        }
    });
};
app.hide_alarm = function () {
    if (xhrAlarm) {
        xhrAlarm.abort();
    }

    //get selected alarm, then delete
    var rows = app.gridAlarm.datagrid('getChecked');
    //////console.log(rows);
    if (rows.length <= 0) {
        alert('Pilih alarm untuk dihapus');
        return;
    }
    var ids = "";
    for (var i in rows) {
        if (ids !== "") {
            ids += "," + rows[i].id;
        } else {
            ids = rows[i].id;
        }
    }
    ////////console.log(ids);
    xhrAlarm = $.ajax({
        url: 'php_script/hide_alarm.php',
        type: 'POST',
        dataType: 'json',
        data: {id: ids},
        success: function (result) {
            //////console.log(result);
            if (result.code === 'SUCCESS') {
                app.gridAlarm.datagrid('reload');
            }
        }
    });
};

function createMarkerAlarm(alarm) {
    var latlng = new google.maps.LatLng(parseFloat(alarm.lat), parseFloat(alarm.lng));
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        optimized: false,
        icon: 'icon/alarm.gif'
    });
    google.maps.event.addListener(marker, 'click', function () {
        var content = createInfoAlarm(alarm);
        if (iw) {
            iw.close();
        }
        iw = new google.maps.InfoWindow({content: content});
        iw.setPosition(latlng);
        iw.open(map, marker);

//        google.maps.event.addListener(iw, 'closeclick', function () {
//            marker.setMap(null); //removes the marker
//        });
    });
    return marker;
}
;
function initAlarmSound() {
    audio.audioElement = document.createElement('audio');
    audio.audioElement.setAttribute('src', 'sound/alarm.wav');
    audio.audioElement.setAttribute('autoplay', 'autoplay');
    audio.audioElement.addEventListener('ended', function () {
        // Wait 500 milliseconds before next loop
        if (audio.currentLoop < audio.maxLoop) {
            audio.currentLoop++;
            setTimeout(function () {
                audio.audioElement.play();
            }, 500);
        }
    }, false);
}
;
function stopAlarmSound() {
    if (audio.audioElement !== undefined) {
        audio.currLoop = 6;
        audio.audioElement.pause();
        audio.audioElement.currentTime = 0;
    }
}
function playAlarmSound() {
    if (audio.audioElement === undefined) {
        initAlarmSound();
    }
    if (audio.currLoop < audio.maxLoop) {
        return;
    }
    audio.currLoop = 0;
    audio.audioElement.play();
}
var indexAlarm = 0;
/*
 * View Untuk Menampilkan Alarm
 */

/*
 * Menampilkan Popup Alarm 
 */
function popupAlarm(data) {
    toastr.options = {
        closeButton: true,
        newestOnTop: true, // $('#newestOnTop').prop('checked'),
        progressBar: false, // $('#progressBar').prop('checked'),
        positionClass: 'toast-top-right', // $('#positionGroup input:radio:checked').val() || 'toast-top-right',
        preventDuplicates: false, // $('#preventDuplicates').prop('checked'),
        onclick: function () {
            var marker = markersAlarm[data.id];
            if (marker != undefined) {
                google.maps.event.trigger(marker, 'click');
                stopAlarmSound();
            }
        }
    };
    var shortCutFunction = 'warning';
    $('#toastrOptions').text('Command: toastr["'
            + shortCutFunction
            + '"]("'
            + formatAlarm(data.alarm)
            + (formatAlarm(data.alarm) ? '", "' + data.address : '')
            + '")\n\ntoastr.options = '
            + JSON.stringify(toastr.options, null, 2)
            );
    var $toast = toastr[shortCutFunction](data.address, formatAlarm(data.alarm) + '(' + data.delayInfo + ')');
    playAlarmSound();
}
app.find_node = function (value) {
    var find = value.toLowerCase();
    for (var i in vehicles) {
        var v = vehicles[i];
        var nopol = v.nopol.toLowerCase();
        if (nopol.indexOf(find) !== -1) {
            var node = treeGps.tree('find', v.id);
            treeGps.tree('select', node.target);
        }
    }
};
app.dlg_vh_group = function (mode) {
    var str = "";
    var id = 0;
    var group = "";
    var node = treeGps.tree('getSelected');
    if (mode == 'delete' || mode == 'edit') {
        if (node == null || (parseInt(node.level, 10) !== 2)) {
            alert('Pilih Group');
            return;
        }
        id = node.id;
        group = node.text;
    }
    if (mode == 'delete') {
        str = "Klik Yes untuk menghapus group";
    } else {
        str = "Ketik Nama Group";
    }

    var value = prompt(str, (node == null ? "" : node.text));
    if (value != null) {
        $.ajax({
            dataType: "json",
            type: "POST",
            url: 'php_script/save_vh_group.php',
            data: {mode: mode, user_id: user_id, id: id, group: group},
            success: function (result) {
                ////////console.log(result);
                if (result.code === 'ERROR') {
                    alert(result.msg);
                    return;
                }
            }
        });
    }
};

var bulan = 30 * 24 * 3600;
var hari = 24 * 3600;
var jam = 3600;

var CONNECTING = 0;//	The connection is not yet open.
var OPEN = 1;      //	The connection is open and ready to communicate.
var CLOSING = 2;   //	The connection is in the process of closing.
var CLOSED = 3;    //	The connection is closed or couldn't be opened

function parseMMVehicle(menu) {
    if (websocket.readyState !== OPEN) {
        alert('Koneksi ke server terputus, \r\n tunggu beberapa detik dan ulangi lagi...');
        return;
    }

    var CMD_ID = parseInt(menu.id, 10);
    var MULTITARGET = parseInt(menu.multitarget, 10);
    var v = vehicles2[vh_id];
    //console.log(menu);
    //console.log(v);
    if (CMD_ID == CommandID.CUT_ENGINE ||
            CMD_ID == CommandID.RESUME_ENGINE ||
            CMD_ID == CommandID.RESTART ||
            CMD_ID == CommandID.URL ||
            CMD_ID == CommandID.WHERE ||
            CMD_ID == CommandID.POSITION ||
            CMD_ID == CommandID.PARAM ||
            CMD_ID == CommandID.STATUS ||
            CMD_ID == CommandID.GET_GPRS ||
            CMD_ID == CommandID.CLEAR_PASSWORD) {
        if (MULTITARGET === 1) {
            //console.log('send multi:' + CMD_ID);
            SendMulti('control', CMD_ID, 'xxxx');
        } else {
            //console.log('send single:' + CMD_ID);
            var msg = "control," + CMD_ID + "," + v.imei;
            //console.log(msg);
            websocket.send(msg);
        }
        return;
    }
    switch (CMD_ID) {
        case CommandID.SET_SOS:
            $.messager.prompt('SETTING SOS', 'Masukkan Nomor dipisahkan dengan koma', function (r) {
                if (r) {
                    //var v = vehicles2[vh_id];
                    if (MULTITARGET === 0) {
                        var msg = "control," + CommandID.SET_SOS + "," + v.imei + "," + r;
                        websocket.send(msg);
                    } else {
                        SendMulti('control', CommandID.SET_SOS, r);
                    }
                }
            });
            break;
        case CommandID.SET_CENTER:
            $.messager.prompt('SETTING CENTER NUMBER', 'Masukkan Nomor Center', function (r) {
                if (r) {
                    if (MULTITARGET === 0) {
                        var msg = "control," + CommandID.SET_CENTER + "," + v.imei + "," + r;
                        websocket.send(msg);
                    } else {
                        SendMulti('control', CommandID.SET_CENTER, r);
                    }
                }
            });
            break;
        case CommandID.SET_PASSWORD:
            $.messager.prompt('Setting Password GPS', 'Masukkan Password GPS', function (r) {
                if (r) {
                    if (MULTITARGET === 0) {
                        var msg = "control," + CommandID.SET_PASSWORD + "," + v.imei + "," + r;
                        websocket.send(msg);
                    } else {
                        SendMulti('control', CommandID.SET_PASSWORD, r);
                    }
                }
            });
            break;
        case CommandID.CLEAR_PASSWORD:
            $.messager.confirm('Clear Password', 'Clear Password', function (r) {
                if (r) {
                    if (MULTITARGET === 0) {
                        var msg = "control," + CommandID.CLEAR_PASSWORD + "," + v.imei + "," + r;
                        websocket.send(msg);
                    } else {
                        SendMulti('control', CommandID.CLEAR_PASSWORD, r);
                    }
                }
            });
            break;
        case CommandID.OVERSPEED:
            $.messager.prompt('Setting Overspeed', 'Masukkan Batas kecepatan', function (r) {
                if (r) {
                    if (MULTITARGET === 0) {
                        var msg = "control," + CommandID.OVERSPEED + "," + v.imei + "," + r;
                        //console.log(msg);
                        websocket.send(msg);
                    } else {
                        SendMulti('control', CommandID.OVERSPEED, r);
                    }
                }
            });
            break;
        case CommandID.ENABLE_PARK_ALARM:
            $.messager.prompt('Alarm Parkir', 'Batas Parkir (Menit)', function (r) {
                if (r) {
                    if (MULTITARGET === 0) {
                        var msg = "setting," + CommandID.ENABLE_PARK_ALARM + "," + v.imei + "," + r;
                        websocket.send(msg);
                    } else {
                        SendMulti('setting', CommandID.ENABLE_PARK_ALARM, r);
                    }
                }
            });
            break;
        case CommandID.DISABLE_PARK_ALARM:
            $.messager.confirm('Alarm Parkir', 'Matikan Alarm Parkir', function (r) {
                if (r) {
                    if (MULTITARGET === 0) {
                        var msg = "setting," + CommandID.DISABLE_PARK_ALARM + "," + v.imei + "," + r;
                        websocket.send(msg);
                    } else {
                        SendMulti('setting', CommandID.DISABLE_PARK_ALARM, r);
                    }
                }
            });
            break;
        case CommandID.ENABLE_OIL_ALARM:
            $.messager.prompt('Setting Alarm Ganti Oli', 'Masukkan KM Ganti Oli', function (r) {
                if (r) {
                    if (MULTITARGET === 0) {
                        var msg = "setting," + CommandID.ENABLE_OIL_ALARM + "," + v.imei + "," + r;
                        websocket.send(msg);
                    } else {
                        SendMulti('setting', CommandID.ENABLE_OIL_ALARM, r);
                    }
                }
            });
            break;
        case CommandID.DISABLE_OIL_ALARM:
            $.messager.confirm('Disable Alarm Ganti Oli', 'Disable Alarm Ganti Oli', function (r) {
                if (r) {
                    if (MULTITARGET === 0) {
                        var msg = "setting," + CommandID.DISABLE_OIL_ALARM + "," + v.imei + "," + r;
                        websocket.send(msg);
                    } else {
                        SendMulti('setting', CommandID.DISABLE_OIL_ALARM, r);
                    }
                }
            });
            break;
        case CommandID.SET_ODOMETER:
            $.messager.prompt('Setting Odometer', 'Masukkan KM Odometer', function (r) {
                if (r) {
                    if (MULTITARGET === 0) {
                        var msg = "setting," + CommandID.SET_ODOMETER + "," + v.imei + "," + r;
                        websocket.send(msg);
                    } else {
                        SendMulti('setting', CommandID.SET_ODOMETER, r);
                    }
                }
            });
            break;
        case CommandID.RESET_PARK:
            $.messager.confirm('KONFIRMASI', 'RESET DATA PARKIR', function (r) {
                if (r) {
                    if (MULTITARGET === 0) {
                        var msg = "setting," + CommandID.RESET_PARK + "," + v.imei + "," + r;
                        websocket.send(msg);
                    } else {
                        SendMulti('setting', CommandID.RESET_PARK, r);
                    }
                }
            });
            break;
    }
}
function show_menu(id) {
    vh_id = id;
    $('#mmVehicle').menu('show', {
        left: mouse.x,
        top: mouse.y
    });
}
function show_popup(id) {
    var v = vehicles2[id];
    return create_info(v);
}

app.clear_polyline = function () {
    // if (polyline !== null || polyline !== undefined || polyline !== 'undefined') 
    if (polyline)
    {
        var path = polyline.getPath();
        path.clear();
        path = [];
        polyline.setMap(null);
    }
};
app.init_polyline = function () {
    polyline = new google.maps.Polyline({
        geodesic: true,
        strokeColor: '#00FF00',
        strokeOpacity: 10.0,
        strokeWeight: 3
    });
    polyline.setMap(map);
};
app.reload_alarm = function () {
    app.gridAlarm.datagrid('reload');
};


app.show_markers_poi = function (pois) {
    for (var i in pois) {
        var poi = pois[i];
        if (poi.icon === '') {
            poi.icon = 'default.png';
        }
        //console.log(poi);
        poi['mode'] = 'edit';
        poi['poi'] = poi.text;
        markersPoi[poi.id] = createPoiMarker(poi);
    }
};
var win = null;
chose_poi = function (src) {
    //alert(src);
    $("#img_icon").attr('src', 'images/poi/' + src + '.png');
    win.dialog('close');
};
create_listview_icon = function () {
    var str = '';
    var icon = 1;
    for (var i = 1; i <= 9; i++) {
        str += '<tr>';
        for (var j = 1; j < 10; j++) {
            str += '<td><img src="images/poi/' + icon + '.png" onClick="chose_poi(' + icon + ');"/></td>';
            icon++;
        }
        str += '</tr>';
    }
    win = $("<div></div>").html(str).dialog({
        width: 300,
        height: 300,
        onClose: function () {

        }
    });
};

function showListViewPoi(source) {
    select_poi.source = source;
    if (select_poi.init === false) {
        $("#cboPoi").combogrid({
            url: 'php_script/combobox_poi.php',
            width: 200,
            panelWidth: 350,
            idField: 'id',
            textField: 'poi',
            columns: [[
                    {field: 'id', title: 'ID', width: 60},
                    {field: 'poi', title: 'POI', width: 150}
                ]],
            onBeforeLoad: function (param) {
                param = user_id;
            },
            onClickRow: function (index, row) {
                if (select_poi.source == 'origin') {

                }
            },
            onLoadSuccess: function () {
                select_poi.init = true;
                app.win_select_poi.window('open');
            }
        });

        setTimeout(function () {
            showListViewPoi();
        }, 5000);
        return;
    }
}
;
var handlerClickMap;
function setHandlerClickMap(callback) {
    clearHandlerClickMap();
    handlerClickMap = google.maps.event.addListener(map, 'click', function (e) {
        callback(e);
    });
}

function clearHandlerClickMap() {
    google.maps.event.removeListener(handlerClickMap);
    delete handlerClickMap;
}
;
app.set_icon_poi = function (icon) {
    if (currPoi.marker !== undefined) {
        currPoi.marker.setIcon('images/poi/' + icon);
        currPoi.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            currPoi.marker.setAnimation(null);
        }, 3000);
    }
};
function updatePoiMarker(e) {
    currPoi.marker.setPosition(e.latLng);
    app.form_poi.form('load', {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
    });
}
function changeIconPoi() {

}

function createPoiContent(data) {
//    var html = '<form id="formPoi" style="padding:10px;">';
//    html +='<div class="boxpoi">';
//    html += '<div><input id="id" type="hidden" value="' + data.id + '"></div>';
//    html += '<div><input id="mode" type="hidden" value="' + data.mode + '"></div>';
//    html += '<div>';
//    html += '<input id="poi" type="text" value="' + data.poi + '" style="float:left;">';
//    html += '<img src="icon/objects/default.png" width=30 height=30  style="float:right;">';
//    html += '</div>';
//    html +='</div>';
//    html += '</form>';
    var html = '<form id="formPoi" style="padding:10px;">';
    html += '<table>';
    html += '<input id="id" type="hidden" value="' + data.id + '">';
    html += '<input id="mode" type="hidden" value="' + data.mode + '">';
    html += '<tr>';
    html += '<td>';
    html += '<input id="poi" type="text" value="' + data.poi + '" style="float:left;width:100%;height:30px;">';
    html += '</td>';
    html += '<td >';
    html += '<img id="iconPoi" src="icon/objects/default.png" width=30 height=30  style="float:right;" onclick=changeIconPoi();>';
    html += '<td>';
    html += '</tr>';
    html += '</table>';
    html += '</form>';
    return html;
}
var buttonsPoi = [{text: 'Save', hadler: function () {
            alert('save');
        }}
    , {text: 'Close', hadler: function () {
            $(this).dialog('close');
        }}];
var markerPoi;
function addPoi() {
    formPoi.form('load', {id: 0, user_id: user_id, mode: 'add'});
    dlgPoi.dialog('open');
    //console.log(map.getCenter().lat());
    markerPoi = createMarkerPoi({icon: 'default.png', poi: 'Test', lat: map.getCenter().lat(), lng: map.getCenter().lng()});
    setHandlerClickMap(function (e) {
        //console.log(e);
        if (iw) {
            iw.setContent($("#formPoi input[name=poi]").val());
        }
        $("#formPoi input[name=lat]").val(e.latLng.lat());
        $("#formPoi input[name=lng]").val(e.latLng.lng());
        markerPoi.setPosition(e.latLng);
    });
}
function showMarkerPois(data) {
    ////console.log('showMarkerPois')
    //console.log(data);
    for (var i in data.rows) {
        var row = data.rows[i];
        markersPoi[row.id] = createPoiMarker(row);
    }
}
function showPoi(obj) {
    var id = $(obj).prop('value');
    var checked = $(obj).prop('checked');
    pois[id].visible = checked;
}
function editPoi() {
    var poi = gridPoi.datagrid('getSelected');
    if (poi === null || poi === undefined) {
        alert('Pilih Poi')
        return;
    }
    poi['mode'] = 'edit';
    formPoi.form('load', poi);
    dlgPoi.dialog('open');
    setIconPoi(poi.icon);
    markerPoi = createMarkerPoi(poi);
    setHandlerClickMap(function (e) {
        //console.log(e);
        if (iw) {
            iw.setContent($("#formPoi input[name=poi]").val());
        }
        $("#formPoi input[name=lat]").val(e.latLng.lat());
        $("#formPoi input[name=lng]").val(e.latLng.lng());
        markerPoi.setPosition(e.latLng);
    });
}

function deletePoi(id) {
    //delete tanpa paramter id, selectedRow
    var row = null;
    var index = -1;
    if (id === undefined) {
        row = gridPoi.datagrid('getSelected');
        if (row == null) {
            id = row.id;
            alert('Pilih Alarm');
            return;
        }
        index = gridPoi.datagrid('getRowIndex', row);
        //delete dengan parameter id,    
    } else {
        var rows = gridPoi.datagrid('getRows');
        for (var i in rows) {
            if (rows[i].id == id) {
                row = rows[i];
                index++;
                break;
            }
            index++;
        }
    }

    if (row == null) {
        alert('Pilih Alarm');
    }
    row['mode'] = 'delete';
    postData('php_script/poi/save_poi.php', row, function (result, error) {
        if (result != null) {
            if (result.code == 'SUCCESS') {
                gridPoi.datagrid('deleteRow', index);
                var marker = markersPoi[id];
                if (marker !== undefined) {
                    marker.setMap(null);
                    delete marker;
                }
                return;
            }
        }
        //console.log(result);
        //console.log(error);
        //console.log('error hapus poi');
    });
}

function savePoi() {
    if (xhr) {
        xhr.abort();
    }
    $.messager.progress({title: 'Saving', msg: 'Please Wait...'});
    formPoi.form('submit', {
        url: 'php_script/poi/save_poi.php',
        onSubmit: function (param) {
            param.user_id = user_id;
            var isValid = $(this).form('validate');
            if (!isValid) {
                $.messager.progress('close');	// hide progress bar while the form is invalid
            }
            return isValid;	// return false will stop the form submission
        },
        success: function (data) {
            var data = eval('(' + data + ')');  // change the JSON string to javascript object
            //console.log(data);
            $.messager.progress('close');
            $.messager.show({title: data.code, msg: data.msg});
            loadPoi();
        },
        error: function (err) {
            //console.log(err);
            $.messager.progress('close');
        }
    });
}
function cancelPoi() {
    app.tabPoi.tabs('select', 'List');
    loadPoi();
}
function openDialogIcon() {
    $("#dlgIcon").dialog('open');
}
function setIconPoi(icon) {
    //console.log(icon);
    $("#formPoi input[name=icon]").val(icon);
    $("#iconPoi").attr('src', 'icon/poi/' + icon);
}
function createPoiMarker(data) {
    var poi = new google.maps.Marker({
        title: data.poi,
        position: new google.maps.LatLng(data.lat, data.lng),
        map: map,
        icon: 'icon/poi/' + data.icon
    });
    //Event Listener Click POI
    google.maps.event.addListener(poi, 'click', function () {
        if (iw) {
            iw.close();
        }
        iw = new google.maps.InfoWindow({content: data.poi});
        iw.setPosition(poi.getPosition());
        iw.open(map, poi);
    });
    //Event Listener DragEnd POI
    google.maps.event.addListener(poi, 'dragend', function () {
        poi.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            poi.setAnimation(null);
        }, 3000);
        app.form_poi.form('load', {
            lat: poi.getPosition().lat(),
            lng: poi.getPosition().lng()
        });
    });
    return poi;
}

function selectPoi(node) {
    //console.log(node);
    var poi = markersPoi[node.id];
    if (poi !== undefined) {
        map.setCenter(poi.getPosition());
        google.maps.event.trigger(poi, 'click');
    }
}
function clearPoiMarkers() {
    if (markersPoi) {
        for (var i in markersPoi) {
            if (markersPoi[i] !== undefined) {
                markersPoi[i].setMap(null);
            }
        }
        markersPoi = [];
        markersPoi.length = 0;
        //pois = [];
        //pois.length = 0;
    }
    if (currPoi.marker !== undefined) {
        currPoi.marker.setMap(null);
        delete currPoi.marker;
    }
}
function createMarkerPoi(data) {
    var latlng = new google.maps.LatLng(parseFloat(data.lat), parseFloat(data.lng));
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        optimized: false,
        icon: 'icon/poi/' + data.icon
    });
    google.maps.event.addListener(marker, 'click', function () {
        if (iw) {
            iw.close();
        }
        iw = new google.maps.InfoWindow({content: data.poi});
        iw.setPosition(latlng);
        iw.open(map, marker);
    });
    return marker;
}
function zoomPoi(row) {
    var marker = markersPoi[row.id];
    if (marker == undefined) {
        marker = createMarkerPoi(row);
        markersPoi[row.id] = marker;
    }
    google.maps.event.trigger(marker, 'click');
    map.setCenter(marker.getPosition());
    map.setZoom(16);
}
function formatPoi(val, row) {
    var html = '<div class="boxpoi">';
    html += '<a href="#" onclick=zoomPoi(' + row.id + ');>' + row.poi + '</a>';
    html += '<a href="#" class="btnedit" onclick=editPoi(' + row.id + ');>edit</a>';
    html += '</div>';
    //console.log(html);
    return html;
}
function formatViewPoi(val, row) {
    ////console.log(data);
    var html = '<table class="viewpoi">';
    html += '<tr><td style="min-width:50px;"><img src="icon/poi/' + row.icon + '"></td><td>' + row.poi + '</td></tr>';
    html += '</table>';
    return html;
}
var xhrPoi;
function loadPoi() {
    clearPoiMarkers();
    gridPoi.datagrid('reload');
}
function onClickRowPoi(index, row) {

}
app.setPoiA = function () {
    var node = app.treePoi.tree('getSelected');
    if (node == null) {
        alert('pilih POI, kemudian klik tombol Set');
        return;
    }
    //console.log(node);
    $("#fromPoi").textbox('setText', node.text);
    poiA.data = node;
    poiA.marker = createPoiMarker(node);
};
app.setPoiB = function () {
    var node = app.treePoi.tree('getSelected');
    if (node == null) {
        alert('pilih POI, kemudian klik tombol Set');
        return;
    }
    //console.log(node);
    $("#toPoi").textbox('setText', node.text);
    poiB.data = node;
    poiB.marker = createPoiMarker(node);
};
function calcDistancePoi() {
    var request = {
        origin: poiA.marker.getPosition(),
        destination: poiB.marker.getPosition(),
        travelMode: 'DRIVING'
    };
    if (Direction.render) {
        Direction.render.setMap(null);
    }
    Direction.render = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map
    });
    Direction.render.addListener('directions_changed', function () {
        var myroute = Direction.render.getDirections().routes[0];
        var dist = 0;
        for (var i = 0; i < myroute.legs.length; i++) {
            dist += myroute.legs[i].distance.value;
        }
        $("#dist2Poi").val("Jarak:" + dist.toLocaleString() + "Km");
    });
    Direction.service.route(request, function (result, status) {
        if (status == 'OK') {
            Direction.render.setDirections(result);
        }
    });
}
;
app.clearDistPoi = function () {
    Direction.render.setMap(null);
    poiA.marker.setMap(null);
    poiB.marker.setMap(null);
};
app.clear_grid_summary = function () {
    $("#gridSummary").datagrid('loadData', {"total": 0, "rows": []});
};
var xhrAlarm;
function loadAlarm() {
    gridAlarm.datagrid('reload');
}
/* Callend afer gridAlarm.onLoadSuccess*/
function showMarkerAlarms(data) {
    if (data.sql != undefined) {
        console.log(data.sql);
    }
    updateAnimationTabAlarm();
    if (data.rows.length <= 0) {
        return;
    }


    var triggerPopup = false;
    for (var i in data.rows) {
        var row = data.rows[i];
        console.log(row);
        markersAlarm[row.id] = createMarkerAlarm(row);
        if (!triggerPopup) {
            triggerPopup = true;
        }
    }
}
function zoomAlarm(alarm) {
    //var alarm = alarms[id];
    //console.log(alarm);
    var marker = markersAlarm[alarm.id];
    if (marker === undefined) {
        marker = createMarkerAlarm(alarm);
        markersAlarm[alarm.id] = marker;

    }

    map.setCenter(marker.getPosition());
    map.setZoom(16);
    google.maps.event.trigger(marker, 'click');
}
function postData(url, param, callback) {
    $.messager.progress({title: 'Progress', msg: 'please wait'});
    xhr = $.ajax({
        url: url,
        data: param,
        dataType: 'json',
        type: 'post',
        success: function (result) {
            $.messager.progress('close')
            callback(result)
        }
    }).fail(function (e1, e2, e3) {
        $.messager.progress('close')
        callback(null, e1)
    }).always(function () {

    });
}
var index = -1;
var idDelete = -1;
function deleteAlarm(id) {
    var row = gridAlarm.datagrid('getSelected');
    if (row == null) {
        alert('Pilih Alarm');
    }
    index = gridAlarm.datagrid('getRowIndex', row);
    idDelete = row.id;
    row['mode'] = 'delete';
    postData('php_script/alarm/save_alarm.php', row, function (result, error) {
        if (result !== null) {
            console.log(result);
            if (result.code === 'SUCCESS') {
                gridAlarm.datagrid('deleteRow', index);
                var marker = markersAlarm[idDelete];
                if (marker) {
                    console.log('marker exist to delete')
                    marker.setMap(null);
                    delete marker;
                    console.log('deleteAlarm success');
                } else {
                    console.log('marker not exist to delte');
                }
                updateAnimationTabAlarm();
                return;
            }
        }
    });
}
function formatViewAlarm(val, row) {
    var html = '<div style="padding:10px 3px;"><table class="boxalarm">';
    html += '<tr><td>Tanggal/jam</td><td>' + row.tdate + '</td></tr>';
    html += '<tr><td>Nopol</td><td>' + row.nopol + '</td></tr>';
    html += '<tr><td>Alarm</td><td><b class="redblock">' + formatAlarm(row.alarm) + '</b></td></tr>';
    html += '<tr><td>Alamat</td><td>' + row.address + '</td></tr>';
    html += '</table><div>';
    return html;
}
function clearAlarms() {
    for (var i in markersAlarm) {
        if (markersAlarm[i]) {
            markersAlarm[i].setMap(null);
        }
    }
    markersAlarm = [];

    listViewAlarm.innerHTML = '';
    listViewAlarms = [];

}
var alarmtype = ["speed.jpg", "lowbatt.jpg", "powercut2.png", "geofencein.png", "geofenceout.png"];
function showAlarm(rowData) {
    if (markerAlarm) {
        markerAlarm.setMap(null);
    }
    if (iw) {
        iw.setMap(null);
    }
    markerAlarm = createMarkerAlarm(rowData);
    if (markerAlarm != null) {
        google.maps.event.trigger(markerAlarm, 'click');
    }
    map.setZoom(18);
}
;
var sumHandler = 0;
function computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    total = total / 1000.0;
    $("#calcDistanceResult").val("Total Jarak:" + total + ' km');
    //document.getElementById('total').innerHTML = total + ' km';
}


app.get_vehicle_inside_poi = function () {
    var radius = $("#radiusPoi").textbox('getValue');
    var node = app.treePoi.tree('getSelected');
    var center = new google.maps.LatLng(parseFloat(node.lat), parseFloat(node.lng));
    $("#totalVehicleInsidePoi").val("Total: 0 Kendaraan");
    app.clear_vehicle_inside_poi();
    var total = 0;
    var insides = [];
    $("#tblVehicleInsidePoi").datagrid('loadData', {
        total: 0,
        rows: []
    });
    if (vehicles) {
        for (var i in vehicles) {
            try {
                var posVehicle = new google.maps.LatLng(parseFloat(vehicles[i].lat), parseFloat(vehicles[i].lng));
                var dist = google.maps.geometry.spherical.computeDistanceBetween(center, posVehicle);
                //console.log('dist:radius=' + dist + ':' + radius);
                dist = parseInt(dist, 10) / 1000;
                if (dist <= radius) {
                    total++;
                    insides.push({
                        nopol: vehicles[i].nopol,
                        dist: dist + 'Km'
                    });
                }
            } catch (e) {
                //console.log(e);
            }
        }
    }
    $("#tblVehicleInsidePoi").datagrid('loadData', insides);
}
app.clear_vehicle_inside_poi = function () {
    $("#searchResultVehicleInsidePoi").html("");
};
app.reset_odometer = function (vh_id) {
    var v = vehicles2[vh_id];
    ////////console.log(v);
    if (v === null || v === undefined) {
        alert('Unknow Object');
        return;
    }
    var value = prompt("Please enter distance", "");
    if (value) {
        if (isNaN(value) === true) {
            alert('Enter Number Value');
            return;
        }
    } else {
        return;
    }

    if (xhr) {
        xhr.abort();
    }
    xhr = $.ajax({
        url: 'php_script/reset_odometer.php',
        data: {vh_id: vh_id, odo: value},
        dataType: 'json',
        type: 'post',
        success: function (result) {
            if (result.status === 'SUCCESS') {
                v.odo = value;
            }
            alert(result.msg);
        }
    }).fail(function (e1, e2, e3) {

    }).always(function () {

    });
};

app.add_tab = function (id, title, url) {
    app.mainTabs.tabs('add', {
        id: id,
        title: title,
        href: url,
        closable: true
    });
};

/* Service */

app.add_service = function () {
    app.service.add();
};
app.edit_service = function () {
    app.service.edit();
};
app.del_service = function () {
    app.service.del();
};
app.reload_service = function () {
    app.service.reload();
};
app.read_service = function () {
    app.service.processChecked('read');
};
app.unread_service = function () {
    app.service.processChecked('unread');
};
var marginLeft = 10;
function ControlMap(controlDiv, image, tooltip) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.backgroundImage = "url('icon/app/" + image + "')";
    controlUI.style.backgroundRepeate = 'no-repeate';
    controlUI.style.backgroundPosition = 'center';
    controlUI.style.width = '24px';
    controlUI.style.height = '24px';
    controlUI.style.border = '1px solid #fff';
    controlUI.style.borderRadius = '6px';
    controlUI.style.boxShadow = '0 6px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginTop = '10px';
    controlUI.style.marginLeft = '3px';

    controlUI.style.textAlign = 'center';
    controlUI.title = tooltip;
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    //controlText.innerHTML = 'Center Map';
    controlUI.appendChild(controlText);
}

function initMapControl() {
    var div1 = document.createElement('div');
    var divAddPoi = document.createElement('div');
    var divDistPoi = document.createElement('div');
    var divZoomAll = document.createElement('div');
    var divAddGeofence = document.createElement('div');

    var Control1 = new ControlMap(div1, 'route16.png', 'Cari Rute');
    var Control2 = new ControlMap(divAddPoi, 'placegreen16.png', 'Tambah POI');
    var Control3 = new ControlMap(divDistPoi, 'measuring16.png', 'Hitung Jarak 2 POI');
    var Control4 = new ControlMap(divZoomAll, 'search16.png', 'Tampilkan Semua GPS');
    var Control5 = new ControlMap(divAddGeofence, 'polygon16.png', 'Buat Geofence');


    divAddPoi.addEventListener('click', function () {
        if (app.addShape === true) {
            alert('Close Prev Action');
            return;
        }
        app.tabLeft.tabs("select", "Places");
        app.tabPlaces.tabs("select", "POI");
        addPoi();
    });
    divDistPoi.addEventListener('click', function () {
        app.tabLeft.tabs("select", "Places");
        app.tabPlaces.tabs("select", "POI");
    });
    divAddGeofence.addEventListener('click', function () {
        if (app.addShape === true) {
            alert('Close Prev Action');
            return;
        }
        app.tabLeft.tabs("select", "Places");
        app.tabPlaces.tabs("select", "Zona");
        app.add_gf();
    });
    divZoomAll.addEventListener('click', boundMarkers);

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(div1);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(divAddPoi);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(divDistPoi);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(divZoomAll);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(divAddGeofence);
    //map.controls[google.maps.ControlPosition.TOP_CENTER].push(divAddPoi);  
}

function addDeviceGroup() {
    if (xhr)
        xhr.abort();
    $.messager.prompt('Menambah Group', 'Ketik Nama Group Kendaraan', function (r) {
        if (r) {
            xhr = $.post("php_script/save_vehicle_group.php", {mode: 'add', user_id: user_id, vh_group: r}, function (r) {
                $("#form_gps select[name=vh_group]").combobox('reload');
                loadDevice();
            }, "json");
        }
    });
}
;
function editDeviceGroup() {
    if (xhr)
        xhr.abort();
    var item = $("#form_gps select[name=vh_group]").combobox('getSelected');
    if (item == null) {
        alert('Pilih Group untuk diedit');
        return;
    }
    //console.log(item);
    $.messager.prompt('Edit Group', item.vh_group, function (r) {
        if (r) {
            xhr = $.post("php_script/save_vehicle_group.php", {mode: 'add', id: item.id, vh_group: r}, function (r) {
                //console.log(r);
                loadDevice();
            }, "json");
        }
    });
}
;
var queueCommands = [];
var gTimer;
function sendCommandMultiDestination() {
    var cmd = queueCommands.pop();
    if (cmd === undefined) {
        alert('Perintah sukses diproses');
        return;
    }
    //console.log(cmd);
    websocket.send(cmd);
    if (gTimer) {
        clearTimeout(gTimer);
    }
    gTimer = setTimeout(function () {
        sendCommandMultiDestination();
    }, 500);
}
function sendCommand() {
    var rows = $("#cboDeviceControl").combobox('getValues');
    //console.log(rows);
    var cmd = $("#cboCommand").combobox('getValue');
    var params = $("#paramGps1").textbox('getValue');
    queueCommands = [];
    queueCommands.length = 0;
    for (var i in rows) {
        try {
            var v = vehicles2[parseInt(rows[i], 10)];
            var msg = "control," + cmd + "," + v.imei + "," + params;
            queueCommands.push(msg);
        } catch (e) {
        }
    }
    sendCommandMultiDestination();
}
function deleteCommand() {
    var rows = $("#gridCommand").datagrid('getSelections');
    if (rows.length <= 0) {
        alert('Select Data')
        return;
    }
    var ids = '';
    for (var i in rows) {
        //console.log(rows[i])
        if (ids != '') {
            ids += ',' + rows[i].id
        } else {
            ids = rows[i].id
        }
    }
    //console.log(ids);
    $.messager.progress({title: 'Hapus History Command', msg: 'Sedang menghapus data'})
    $.post("php_script/delete_command.php", {ids: ids}, function (result) {
        $.messager.progress("close");
        $("#gridCommand").datagrid('reload');
    }, "json");
}
;
function loadQueueCommand() {
    if (dlgCommand === undefined)
        return;
    $("#gridCommand").datagrid('reload');
    $("#cboDeviceControl").combobox('clear');
    $("#cboDeviceControl").combobox('loadData', vehicles);

}
var cboDeviceControl;
var dlgCommand;
function openDlgCommand(id) {
    $("<div></div>").dialog({
        title: 'Kirim Perintah Ke GPS',
        width: 700, height: 500,
        title: 'Kirim Perintah GPS',
        href: 'php_script/command/page_send_command.php',
        onLoad: function () {
            console.log('loaded')
            setTimeout(function () {
                $("#gridCommand").datagrid({
                    onBeforeLoad: function (param) {
                        param.multiuser = config.multiuser;
                        param.user_id = user_id;
                    }
                });
                loadQueueCommand();
                setDeviceToControl();
                $("#cboDeviceControl").combobox('setValue', id);
            }, 1000);
        }
    });
}
function setDeviceToControl() {
    $("#cboDeviceControl").combobox('setValues', vehicles);
}

/* Geofence */
var xhrGf;
var geofences = [];
var geofencesMarker = [];
var geofenceContainer;
var formGeofence;
var dlgGeofence;
var GF = {shape: undefined, id: 0, mode: ''};
function formatViewGeofence(val, row) {
    var html = '<table class="viewgeofence">';
    html += '<tr><td>Geofence</td><td>' + row.name + '</td></tr>';
    html += '<tr><td>Enter Alarm</td><td>' + formatYesNo(row.enter_alarm) + '</td></tr>';
    html += '<tr><td>Exit Alarm</td><td>' + formatYesNo(row.exit_alarm) + '</td></tr>';
    html += '<tr><td colspan="2" style="padding:5px;text-align:right;"><button class="blockblue" onclick=editGeofence(' + row.id + ');>Edit</button></td></tr>';
    html += '</table>';
    return html;
}
function toggleGeofence(obj) {
    var id = $(obj).prop('value');
    var checked = $(obj).prop('checked');
    if (!checked) {
        if (geofencesMarker[id] !== undefined) {
            geofencesMarker[id].setMap(null);
            delete geofencesMarker[id];
            geofencesMarker.splice(id, 1);
        }
        return;
    }
    downloadGeofencePoints(id, function (points) {
        var shape = createGeofence(points, false);
        if (shape !== null) {
            geofencesMarker[id] = shape;
            boundGeofence(shape);
        }
    });
}
function loadGeofence() {
    gridGeofence.datagrid('reload');
}

function clearGeofence() {
    if (GF.shape === undefined) {
        return;
    }
    GF.shape.setMap(null);
    GF.shape.paths = [];
    delete GF.shape;

    $("#form_geofence").form('load', {
        id: 0,
        name: '',
        descr: ''
    });
}
;

function createGeofence(points, editable) {
    var path = [];
    var coor = points.split(",");
    for (i = 0; i < coor.length; i++) {
        var ll = coor[i].split(" ");
        var lat = parseFloat(ll[1]);
        var lng = parseFloat(ll[0]);
        path.push(new google.maps.LatLng(lat, lng));
    }
    var shape = null;
    if (path.length > 0) {
        var shape = new google.maps.Polygon({paths: path,
            editable: editable, strokeColor: "#FF0000", strokeOpacity: 0.8, strokeWeight: 2, fillColor: "#FF0000",
            fillOpacity: 0.35, map: map
        });
    }
    return shape;
}

function boundGeofence(shape) {
    var bounds = new google.maps.LatLngBounds();
    var points = shape.getPath().getArray();
    for (var i in points) {
        var latlng = new google.maps.LatLng(points[i].lat(), points[i].lng());
        bounds.extend(latlng);
    }
    map.fitBounds(bounds);
}
function downloadGeofencePoints(id, callback) {
    $.messager.progress({
        title: 'Geofence',
        msg: 'Load Geofence'
    });
    xhr = $.ajax({
        url: 'php_script/geofence/load_geofence_points.php',
        type: 'POST',
        dataType: 'json',
        data: {id: id},
        success: function (result) {
            $.messager.progress('close');
            if (parseInt(result.total) > 0) {
                result.points = result.points.replace('MULTIPOLYGON(((', '');
                result.points = result.points.replace('POLYGON((', '');
                result.points = result.points.replace(')))', '');
                result.points = result.points.replace('))', '');
                if (typeof callback === "function") {
                    callback(result.points);
                }
            }
        }
    }).always(function () {
        $.messager.progress('close');
    }).done(function () {
    });
}
function addGeofence() {
    if (GF.shape) {
        GF.shape.setMap(null);
        delete GF.shape;
    }
    formGeofence.form('load', {id: 0, mode: 'add', user_id: user_id});
    dlgGeofence.dialog('open').dialog('setTitle', 'Add Geofence');
    initGeofence();
}
function initGeofence() {
    GF.shape = new google.maps.Polygon({map: map,
        strokeColor: '#FF0000', strokeOpacity: 0.8,
        strokeWeight: 2, fillColor: '#FF0000',
        fillOpacity: 0.35, draggable: true, editable: true, geodesic: true
    });
    setHandlerClickMap(updateGeofence);
}
function updateGeofence(e) {
    //clearHandlerClickMap
    var path = GF.shape.getPath();
    path.push(e.latLng);
}
function findGeofenceRow(id) {
    var rows = gridGeofence.datagrid('getRows');
    if (rows) {
        for (var i in rows) {
            if (rows[i].id == id) {
                return rows[i];
            }
        }
    }
    return null;
}
function editGeofence(id) {
    if (xhr) {
        xhr.abort();
    }
    if (GF.shape) {
        alert('Error');
        return;
    }
    downloadGeofencePoints(id, function (points) {
        var shape = createGeofence(points, true);
        if (shape !== null) {
            var node = findGeofenceRow(id);
            console.log(node);
            GF.shape = shape;

            node['mode'] = 'edit';
            node.enter_alarm = node.enter_alarm = 1 ? 'on' : 'off';
            node.exit_alarm = node.exit_alarm = 1 ? 'on' : 'off';
            formGeofence.form('load', node);
            if (node.vehicles.length > 0) {
                var vehicles = node.vehicles.split(",");
                $('#vehicles').combobox('setValues', vehicles);
            }
            dlgGeofence.dialog('open').dialog('setTitle', 'Edit Geofence');

            boundGeofence(GF.shape);
        }
    });
}
function showGeofence(id) {
    if (geofencesMarker[id] !== undefined) {
        boundGeofence(geofencesMarker[id]);
        return;
    }
    downloadGeofencePoints(id, function (points) {
        var shape = createGeofence(points, false);
        if (shape !== null) {
            geofencesMarker[id] = shape;
            boundGeofence(shape);
        }
    });
}

function zoomGeofence(id) {
    var shape = geofencesMarker[id];
    if (shape !== undefined) {
        boundGeofence(shape);
    } else {
        alert('Tampilkan Geofence Lebih Dulu');
    }
}
function panGeofence(row) {

}
var xhrGeofence;
function saveGeofence() {
    if (xhrGeofence) {
        xhrGeofence.abort();
    }
    GF.shape.setEditable(false);
    var path = GF.shape.getPath(); //.getArray();
    var arr = path.getArray();
    if (arr.length <= 0) {
        alert('Buat Geofence...');
        return;
    }
    var points = "";
    if (arr) {
        for (var i in arr) {
            points = points + arr[i].lng() + " " + arr[i].lat() + ",";
        }
    }
    points = points + arr[0].lng() + " " + arr[0].lat(); //closed

    var vehicles = $("#vehicles").combobox("getValues");
    $.messager.progress({
        title: 'Save Geofence',
        msg: 'Please wait save Geofence...'
    });

    formGeofence.form('submit', {
        url: 'php_script/geofence/save_geofence.php',
        onSubmit: function (param) {
            param.points = points;
            //param.vehicles = vehicles;
            var isValid = $(this).form('validate');
            if (!isValid) {
                $.messager.progress('close');	// hide progress bar while the form is invalid
            }
            return isValid;	// return false will stop the form submission
        },
        success: function (result) {
            //alert('success');
            try {
                var result = eval('(' + result + ')');
                console.log(result);
                $.messager.progress('close');
                $.messager.show({title: result.code, msg: result.msg});
                if (result.code === "SUCCESS") {
                    //gf.clear();
                }
                //gf.load();
            } catch (e) {
                $.messager.progress('close');
                //console.log(result);
                alert('data error, silahkan cek di log');
            }
        }
    });
}


function dlgIcon() {
    alert('dlgIcon');
}