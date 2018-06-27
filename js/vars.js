var config={
    server_name:"crystaltracker.com",
    multiuser:1,
    ws_server:'ws://crystaltracker.com:7070/websocket',
    url_load_vehicle:'php_script/device/load_device.php',
    session:''
};
config.init=function(){
    //Generate Session ID
    var d = new Date().getTime();
    config.session = 'xxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    switch (config.server_name) {
        case "geagps":
            config.ws_server = "ws://geagps.com:9020/websocket";
            break;
        case "crystaltracker.com":
            config.ws_server = "ws://crystaltracker.com:7070/websocket";
            break;
        case "pusatgps":
            config.ws_server = "ws://servergpstracker.com.net:7070/websocket";
            break;
    }
};
