import "../../static/vuetify/vuetify.min.css"
import "../../static/font-awesome/css/font-awesome.min.css"
import "../../static/roboto/css/roboto.css"
import "../../static/md-font/icon.css"
import "../../static/md-font/material-icons.css"
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'

Vue.use(Vuetify);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;
import eventHub from './EventHub';

import netsh from './netsh'
// const exec = require('child_process').exec;
const Status = {
    'NOT_AVAILABLE': ['Not available', 'No disponible'],
    'NOT_INIT': ['Not started', 'No iniciado'],
    'INIT': ['Started', 'Iniciado'],
};
let SSID_ON_HOTSPOT = false;
let PWD_ON_HOTSPOT = false;

/**
 Salida del cmd netsh wlan show hostednetwork y la wifi no esta iniciada
 0 : " "
 1 : "Configuraci�n de red hospedada "
 2 : "------------------------------ "
 3 : "    Modo: permitido "
 4 : "    Nombre de SSID       : "mos" "
 5 : "    N� m�ximo de clientes  : 20 "
 6 : "    Autenticaci�n                  : WPA2-Personal "
 7 : "    Cifrado                        : CCMP "
 8 : " "
 9 : "Estado de la red hospedada "
 10 : "-------------------------- "
 11 : "    Estado                 : No iniciado "
 12 : " "
 13 : ""

 Salida con wifi iniciada y con usuarios conectados
 0 : " "
 1 : "Configuraci�n de red hospedada "
 2 : "------------------------------ "
 3 : "    Modo: permitido "
 4 : "    Nombre de SSID       : "mos" "
 5 : "    N� m�ximo de clientes  : 20 "
 6 : "    Autenticaci�n                  : WPA2-Personal "
 7 : "    Cifrado                        : CCMP "
 8 : " "
 9 : "Estado de la red hospedada "
 10 : "-------------------------- "
 11 : "    Estado                 : Iniciado "
 12 : "    BSSID                  : 5a:cf:5e:d3:84:ad "
 13 : "    Tipo de radio             : 802.11n "
 14 : "    Canal                : 11 "
 15 : "    N�mero de clientes      : 1 "
 16 : "        30:10:b3:a0:8a:7f        Autenticado "
 17 : " "
 18 : ""
 */
function getWifiData() {
    // let cmd = 'netsh wlan show hostednetwork';
    // exec(cmd, (err, stdout, stderr) => {
    //     console.log('getWifiSSID.err', err);
    //     let out = stdout.split('\n');
    //     let match1, match2 = false;
        // let arp;
        // exec('arp -a', (err, stdout, stderr) => {
        //     let arp = stdout;
            // console.log('arp', arp.substr(90, 100));
            // console.log(arp.split('\n'));
            // let status = out[11].split(':')[1].trim();
            // console.log('status', status);
            // if (Status.NOT_AVAILABLE.indexOf(status) !== -1) {
            //     // evento para advertir que la wifi no esta disponible pq no se ha establecido con 'set mode=allow' aun. lo recibe HotSpot
            //     eventHub.$emit('wifi-status-not-available');
            //     // emitir estado de la wifi. 0/1. lo recibe HotSpot
            //     eventHub.$emit('wifi-status', 0);
            //     eventHub.$emit('info-cant-clients', 0);
            //     eventHub.$emit('info-clients', {})
            // }
            // else if (Status.NOT_INIT.indexOf(status) !== -1) {
            //     eventHub.$emit('wifi-status', 0);
            //     eventHub.$emit('info-cant-clients', 0);
            //     eventHub.$emit('info-clients', {})
            // }
            // else if (Status.INIT.indexOf(status) !== -1) {
            //     // console.log('Status.INIT');
            //     eventHub.$emit('wifi-status', 1);
            //     let cantClients = parseInt(out[15].split(':')[1].trim());
            //     // console.log('cantClients', cantClients);
            //     let loopUntil = 15 + cantClients;
            //     eventHub.$emit('info-cant-clients', cantClients);
            //     let clients = {};
            //     for (let j = 16; j <= loopUntil; j++) {
            //         let match = out[j].match(/.{2}:.{2}:.{2}:.{2}:.{2}:.{2}/);
            //         if (arp && match.length) {
            //             let mac = match[0].replace(/:/g, '-');
            //             // console.log('mac', mac);
            //             let macIndexInArp = arp.indexOf(mac);
            //             // console.log('macIndexInArp',macIndexInArp);
            //             if (macIndexInArp !== -1) {
            //                 clients[mac] = arp.substr(macIndexInArp - 24, 24).trim(); //{mac:ip}
            //                 // if(!clients[mac]){
            //                 //     clients[mac] = {
            //                 //         ip: arp.substr(macIndexInArp - 24, 24).trim(),
            //                 //         connectedAt: Date.now()
            //                 //     }//{mac: {ip, connectedAt}}
            //                 // }
            //             }
            //         }
            //
            //     }
            //     console.log('clients', clients);
            //     eventHub.$emit('info-clients', clients)
            // }
            // if (!SSID_ON_HOTSPOT) {
            //     let ssid = out[4].split(':')[1].trim().replace(/"/g, '');
            //     // emitir nombre de la wifi. lo recibe HotSpot
            //     eventHub.$emit('wifi-ssid', ssid);
            //     SSID_ON_HOTSPOT = true;
            // }
        // });
    // });
    netsh.getWifiData(wifi => {
        console.log('netsh', wifi.status);
        if (Status.NOT_AVAILABLE.indexOf(wifi.status) !== -1) {
            // evento para advertir que la wifi no esta disponible pq no se ha establecido con 'set mode=allow' aun. lo recibe HotSpot
            eventHub.$emit('wifi-status-not-available');
            // emitir estado de la wifi. 0/1. lo recibe HotSpot
            eventHub.$emit('wifi-status', 0);
            eventHub.$emit('info-cant-clients', 0);
            eventHub.$emit('info-clients', {})
        }else if (Status.NOT_INIT.indexOf(wifi.status) !== -1) {
            eventHub.$emit('wifi-status', 0);
            eventHub.$emit('info-cant-clients', 0);
            eventHub.$emit('info-clients', {})
        }else if (Status.INIT.indexOf(wifi.status) !== -1) {
            eventHub.$emit('wifi-status', 1);
            eventHub.$emit('info-cant-clients', wifi.cantClients);
            eventHub.$emit('info-clients', wifi.clients);
        }
        eventHub.$emit('info-authentication', wifi.authentication);
        eventHub.$emit('info-cipher', wifi.cipher);
        if (!SSID_ON_HOTSPOT) {
            // emitir nombre de la wifi. lo recibe HotSpot
            eventHub.$emit('wifi-ssid', wifi.ssid);
            SSID_ON_HOTSPOT = true;
        }
        if (!PWD_ON_HOTSPOT){
            eventHub.$emit('wifi-password', wifi.password);
            PWD_ON_HOTSPOT = true;
        }
    })
}

/**
 Salida del cmd 'netsh wlan show hostednetwork setting=security'
 0 : " "
 1 : "Configuraci�n de seguridad de red hospedada "
 2 : "------------------------------------------- "
 3 : "    Autenticaci�n                  : WPA2-Personal "
 4 : "    Cifrado                        : CCMP "
 5 : "    Clave de seguridad del sistema: p4ipn.PdyKCv+SpoYn-+8iyNeqt*xXQmHKQSzv9uYT3kV3lnS#m3!!6GR9O@6-B "
 6 : "    Clave de seguridad de usuario: wifietecsa "
 7 : "    Uso de la clave de seguridad de usuario: persistente "
 8 : " "
 9 : ""
 */
// function getWifiPwd() {
//     let cmd = 'netsh wlan show hostednetwork setting=security';
//     exec(cmd, (err, stdout, stderr) => {
//         let out = stdout.split('\n');
//         // console.log(out);
//         let authentication = out[3].split(':')[1].trim();
//         eventHub.$emit('info-authentication', authentication);
//         // console.log('authentication',authentication);
//         let cipher = out[4].split(':')[1].trim();
//         // console.log('cipher', cipher);
//         eventHub.$emit('info-cipher', cipher);
//         let password = out[6].split(':')[1].trim();
//         eventHub.$emit('wifi-password', password);
//         // for (let i = 0; i < out.length; i++) {
//         //     let match = /----------/.test(out[i]);
//         //     let match1 = false;
//         //     if (!PWD_ON_HOTSPOT)
//         //         if (match && !match1) {
//         //             match1 = true;
//         //             let password = out[i + 4].split(':')[1].trim();
//                     // emitir password de la wifi. lo recibe HotSpot
//                     // PWD_ON_HOTSPOT = true;
//                 // }
//         // }
//     })
// }

new Vue({
    components: {App},
    template: '<App/>',
    mounted() {
        getWifiData();
        setInterval(() => {
            getWifiData()
        }, 5000);
    }
}).$mount('#app');
