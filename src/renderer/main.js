import "../../static/vuetify/vuetify.min.css"
import "../../static/font-awesome/css/font-awesome.min.css"
import "../../static/roboto/css/roboto.css"
import "../../static/md-font/icon.css"
import "../../static/md-font/material-icons.css"
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import eventHub from './EventHub';
import netsh from './netsh'

Vue.use(Vuetify);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

const Status = {
    'NOT_AVAILABLE': ['Not available', 'No disponible'],
    'NOT_INIT': ['Not started', 'No iniciado'],
    'INIT': ['Started', 'Iniciado'],
};
let SSID_ON_HOTSPOT = false;
let PWD_ON_HOTSPOT = false;

function getWifiData() {
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
