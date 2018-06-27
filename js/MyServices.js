function MyServices(_map) {
    var map = _map;
    var S = this;
    S.grid;
    S.dialog;
    S.form;
    S.init_event = function () {
        S.formLoading = true;
        S.grid = $("#gridServices");
        S.grid.datagrid({
            toolbar: '#tbServices',
            fit: true, pagination: true,
            checkOnSelect: false,
            selectOnCheck: false,
            singleSelect: true,
            pageList: [10, 20, 50, 100, 500, 1000],
            idField: 'id',
            url: 'services/load_service.php',
            onBeforeLoad: function (param) {
                if (app.user_id == undefined) {
                    alert('Piilih user');
                    return;
                }
                param.user_id = app.user_id;
                console.log(param);
            },
            onClickRow: function (index, row) {
                console.log(row);
                var html = '<table>';
                html += '<tr><td>Nopol</td><td>:</td><td>' + row.nopol + '</td></tr>';
                html += '<tr><td>Nama Service </td><td>:</td><td>' + row.service_name + '</td></tr>';
                html += '<tr><td>Tanggal </td><td>:</td><td>' + row.service_date + '</td></tr>';
                html += '<tr><td>Odometer Service </td><td>:</td><td>' + row.service_odo + ' Km</td></tr>';
                html += '<tr><td>Odometer Berjalan </td><td>:</td><td>' + row.odo + ' Km</td></tr>';
                html += '<tr><td>Keterangan </td><td>:</td><td>' + row.descr + '</td></tr>';
                html += '</table>';
                var panel = $("#layoutServices").layout('panel', 'south');
                if (panel == null)
                    return;
                panel.panel('body').html(html);
            },
            onDblClickRow: function (index, row) {
                var html = '<table>';
                html += '<tr><td>Nopol</td><td>:</td><td>' + row.nopol + '</td></tr>';
                html += '<tr><td>Nama Service </td><td>:</td><td>' + row.service_name + '</td></tr>';
                html += '<tr><td>Tanggal </td><td>:</td><td>' + row.service_date + '</td></tr>';
                html += '<tr><td>Odometer Service </td><td>:</td><td>' + row.service_odo + ' Km</td></tr>';
                html += '<tr><td>Odometer Berjalan </td><td>:</td><td>' + row.odo + ' Km</td></tr>';
                html += '<tr><td>Keterangan </td><td>:</td><td>' + row.descr + '</td></tr>';
                html += '</table>';
                var panel = $("#layoutServices").layout('panel', 'south');
                if (panel == null)
                    return;
                panel.panel('body').html(html);

                //var panel = $("#layoutServices").layout('panel', 'south');
                // panel.panel('body').html = html;
            },
            onLoadError: function (e) {
                console.log(e);
            }, onLoadSuccess: function (data) {
                console.log(data);
            },
            columns: [[
                    {field: 'id', title: 'Id', checkbox: true},
                    {field: 'read', title: 'Status', width: 100, formatter: function (val, row) {

                            if (val == undefined)
                                return "Unavailable";
                            if (((parseInt(row.due_date, 10) == 1) || (parseInt(row.due_odo, 10) == 1)) && (parseInt(val, 10) == 0)) {
                                console.log('read:0');
                                return "<div style='background:red;color:white;'>Jatuh Tempo</div>";
                            } else if (((parseInt(row.due_date, 10) == 1) || (parseInt(row.due_odo, 10) == 1)) && (parseInt(val, 10) == 1)) {
                                console.log('read:1');
                                return "<div style='background:#00F;color:white;'>Jatuh Tempo (R)</div>";
                            } else {
                                return "<div style='background:green;color:white;'>Penjadwalan</div>";
                            }
                        }
                    },
                    {field: 'nopol', title: 'Nopol', width: 100},
                    {field: 'service_name', title: 'Nama Service', width: 150},
                    {field: 'service_date', title: 'Tanggal Service', width: 120},
                    {field: 'service_odo', title: 'Odometer Service', width: 120, formatter: function (val, row) {
                            if (val == undefined)
                                return "Not Set";
                            if (val == 0)
                                return "Not Set";
                            return val.toLocaleString() + " Km";

                        }
                    },
                    {field: 'odo', title: 'Odometer Berjalan', width: 120, formatter: function (val, row) {
                            if (val == undefined)
                                return "0";
                            var odo = parseFloat(val);
                            return odo.toFixed(2) + " Km";

                        }
                    },
                    {field: 'descr', title: 'Keterangan', width: 300}
                ]]
        });


//        $("#btnAddServices").bind("click", function () {
//            console.log('btnAddServices');
//            S.add();
//        });
//        $("#btnEditServices").bind("click", function () {
//            S.edit();
//        });
//        $("#btnDeleteServices").bind("click", function () {
//            S.processChecked('delete');
//        });
//        $("#btnReloadServices").bind("click", function () {
//            S.reload();
//        });
        $("#btnReadAlarms").bind("click", function () {
            S.processChecked('read');
        });
        $("#btnUnreadAlarms").bind("click", function () {
            S.processChecked('unread');
        });
        $('#sbService').searchbox({
            width: 220,
            searcher: function (value, name) {
                var opts = S.grid.datagrid('options');
                opts.queryParams = {
                    field: name,
                    search: value
                };
                S.grid.datagrid('reload');
            },
            menu: '#menuService',
            prompt: 'Please Input Value'
        });
        S.form = $("#formServices");
        S.dialog = $("#dlg_service");
        S.dialog.dialog({
            width: 350, height: 260, closed: true,
            buttons: [
                {text: 'Save', handler: function () {
                        console.log('save handler');
                        S.save();
                    }},
                {text: 'Close', handler: function () {
                        S.dialog.dialog('close');
                    }}
            ],
            onLoad: function (data) {

            }
        });
    };

    S.save = function () {
        console.log('S.save');
        $.messager.progress({title: 'Simpan Data', msg: 'Silahkan Ditunggu'});
        // console.log(S.form.serialize());
        if (S.jqxhr) {
            S.jqxhr.abort();
        }
        $('#formServices').form('submit', {
            url: 'services/save_service.php',
            onSubmit: function (param) {
                param.user_id = app.user_id;
            },
            success: function (data) {
                console.log(data);
                $.messager.progress('close');
                S.grid.datagrid('reload');
            },
            onError: function (e) {
                console.log(e);
            }
        });
    };
    S.add = function () {
        S.dialog.dialog('open').dialog('setTitle', 'Tambah Jadwal Service');
        S.form.form('clear');
        S.form.form('load',{mode:'add',id:0});
    };
    S.edit = function () {
        var row = S.grid.datagrid('getSelected');
        if (row == null) {
            alert('Pilih Data');
            return;
        }
        row['mode'] = 'edit';
        S.form.form('load', row);
        S.dialog.dialog('open').dialog('setTitle', 'Edit Jadwal Service');
    };
    S.del = function () {
        var row = S.grid.datagrid('getSelected');
        if (row == null) {
            alert('Pilih Data');
            return;
        }
        row['mode'] = 'delete';
        S.form.form('load', row);
        $.messager.confirm('Confirm', 'Are you sure you want to delete record?', function (r) {
            if (r) {
                S.save();
            }
        });
    };
    S.processChecked = function (mode) {
        var rows = S.grid.datagrid('getChecked');
        if (rows == null) {
            alert('Pilih Data');
            return;
        }
        if (S.jqxhr) {
            S.jqxhr.abort();
        }
        S.jqxhr = $.ajax({
            url: 'services/save_service.php',
            dataType: 'json',
            type: 'post',
            data: {mode: mode, rows: JSON.stringify(rows)},
            success: function (result) {
                //console.log(result);
                $.messager.show({title: result.code, msg: result.msg});
                if (result.code == 'SUCCESS') {
                    S.grid.datagrid('reload');
                }
            }
        });
    };
    S.reload = function () {
        S.grid.datagrid('reload');
    };
}


