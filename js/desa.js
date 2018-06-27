/*------------- Geofence -----------------*/
var shapeEdit;
var CODE_SUCCESS = 'SUCCESS';
var desa = {
    user_id: 0,
    addShape: false,
    shapeEdit: undefined,
    tab: undefined,
    cboVehicles: undefined,
    form: undefined,
    dialog: undefined,
    grid: undefined,
    search: ''
};

desa.init = function () {
    //initial events jeasyui-tabs for geofence container list and form
    desa.grid = $("#gridDesa");
    desa.grid.datagrid({
        onBeforeLoad: function (param) {
            param.search = desa.search;
            console.log(param);
        }
    });
    desa.dialog = $("#dlgDesa");
    desa.form = $("#form_desa");
    desa.user_id = app.user_id;

};
desa.update_gf_onclickmap = function (e) {
    var path = desa.shapeEdit.getPath();
    path.push(e.latLng);
};
desa.init_object = function () {
    desa.shapeEdit = new google.maps.Polygon({map: app.map,
        strokeColor: '#FF0000', strokeOpacity: 0.8,
        strokeWeight: 2, fillColor: '#FF0000',
        fillOpacity: 0.35, draggable: true, editable: true, geodesic: true
    });
    app.set_clickmap_handler(desa.update_gf_onclickmap);
}
desa.callback_change_user = function () {
    desa.user_id = app.user_id;
};
desa.callback_loadgps = function (vehicles) {
    //var gpsGeofence = $("#form_geofence input[name=vehicles]");
    var gpsGeofence = $("#vehicles");
    gpsGeofence.combobox('clear');
    gpsGeofence.combobox('loadData', vehicles);
}
desa.add = function () {
    if (desa.addShape === true) {
        alert('Close Prev Action');
        return;
    }
    desa.clear();
    desa.init_object();
    $("#form_geofence").form('load', {
        id: 0,
        mode: 'add'
    });
    desa.tab.tabs('select', 'Form');
};
desa.cancel = function () {
    desa.clear();
    desa.dialog.dialog("close");
};
desa.parseVehicles = function (vs) {
    return vs.split(",");
};
desa.edit = function () {
    if (desa.addShape === true) {
        alert('Close Prev Action');
        return;
    }
    desa.clear();
    if (xhr) {
        xhr.abort();
    }
    var row = desa.grid.datagrid('getSelected');
    if (row === null) {
        alert('Pilih Geofence Yang Akan Diedit');
        return;
    }
    var points = row.points;
    points = points.replace('MULTIPOLYGON(((', '');
    points = points.replace('POLYGON((', '');
    points = points.replace(')))', '');
    points = points.replace('))', '');
    if (desa.draw(points) === true) {
        desa.form.form('load', {
            id: row.id,
            mode: 'edit',
            kelurahan: row.kelurahan,
            kecamatan: row.kecamatan,
            kabupaten: row.kabupaten
        });
        desa.dialog.dialog("open").dialog("center");
    }
};
desa.draw = function (points) {
    var path = [];
    var coor = points.split(",");
    for (i = 0; i < coor.length; i++) {
        var ll = coor[i].split(" ");
        var lat = parseFloat(ll[1]);
        var lng = parseFloat(ll[0]);
        path.push(new google.maps.LatLng(lat, lng));
    }

    desa.shapeEdit = new google.maps.Polygon({paths: path,
        editable: true, strokeColor: "#FF0000", strokeOpacity: 0.8, strokeWeight: 2, fillColor: "#FF0000",
        fillOpacity: 0.35, map: app.map
    });
    var bounds = new google.maps.LatLngBounds();
    var points = desa.shapeEdit.getPath().getArray();
    for (var i in points) {
        var latlng = new google.maps.LatLng(points[i].lat(), points[i].lng());
        bounds.extend(latlng);
    }
    app.map.fitBounds(bounds);
    return true;
};
desa.clear = function () {
    if (desa.shapeEdit === undefined) {
        return;
    }
    desa.shapeEdit.setMap(null);
    desa.shapeEdit.paths = [];
    delete desa.shapeEdit;

    $("#form_geofence").form('load', {
        id: 0,
        name: '',
        descr: ''
    });
};

desa.search = function (value,name) {
    console.log(name + "," + value);
    desa.search = value;
    desa.grid.datagrid("reload");
};
desa.load = function () {
    desa.clear();
    desa.grid.datagrid("reload");
};

desa.save = function () {
    if (desa.shapeEdit === undefined) {
        return;
    }
    desa.shapeEdit.setEditable(false);
    if (xhr) {
        xhr.abort();
    }
    var path = desa.shapeEdit.getPath(); //.getArray();
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
    $.messager.progress({
        title: 'Simpan Desa',
        msg: 'Silahkan Tunggu...'
    });
    desa.form.form('submit', {
        url: 'php_script/save_desa.php',
        onSubmit: function (param) {
            param.user_id = desa.user_id;
            param.points = points;
            var isValid = $(this).form('validate');
            if (!isValid) {
                $.messager.progress('close');	// hide progress bar while the form is invalid
            }
            return isValid;	// return false will stop the form submission
        },
        success: function (result) {
            console.log(result);
            try {
                var result = eval('(' + result + ')');
                $.messager.progress('close');
                $.messager.show({title: result.code, msg: result.msg});
                if (result.code === CODE_SUCCESS) {
                    desa.clear();
                }
                desa.load();
            } catch (e) {
                $.messager.progress('close');
                console.log(result);
                alert('data error, silahkan cek di log');
            }
        }
    });
};
desa.del = function () {
    var node = desa.grid.datagrid('getSelected');
    if (node === null) {
        alert('Pilih Geofence Yang Akan Dihapus....');
        return;
    }
    var confirmDelete = confirm('Hapus Geofence ' + node.text + '?');
    if (confirmDelete === false)
        return;
    $.messager.progress({
        title: 'Delete Geofence',
        msg: 'Please wait Delete Geofence...'
    });
    xhr = $.ajax({
        dataType: "json",
        type: "POST",
        url: 'php_script/save_desa.php',
        data: {id: node.id, user_id: app.user_id, mode: 'del'},
        success: function (result) {
            $.messager.show({title: result.code, msg: result.msg});
            if (result.code === CODE_SUCCESS) {
                desa.clear();
            }
            desa.load();
        }
    }).always(function () {
        $.messager.progress('close');
    }).fail(function (e, e2, e3) {
        console.log(e);
        console.log(e2);
    }).done(function () {
    });
};
