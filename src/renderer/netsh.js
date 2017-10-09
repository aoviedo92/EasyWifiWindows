/**
 * tratar de simplificar el proceso del trabajo con netsh
 * */
import {exec} from 'child_process'

function debug(err, stderr) {
    err || stderr && console.error(err, stderr);
}

export default {
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

    getWifiData(cb) {
        exec("netsh wlan show hostednetwork", (err, stdout, stderr) => {
            debug(err, stderr);
            let out = stdout.split('\n');
            let status = out[11].split(':')[1].trim();
            let ssid = out[4].split(':')[1].trim().replace(/"/g, '');
            exec("netsh wlan show hostednetwork setting=security", (err, stdout, stderr) => {
                debug(err, stderr);
                let security = stdout.split('\n');
                let authentication = security[3].split(':')[1].trim();
                let cipher = security[4].split(':')[1].trim();
                let password = security[6].split(':')[1].trim();
                if (out.length >= 16) {//si out tiene mas de 16 lineas es pq hay clientes conectados
                    exec('arp -a', (err, stdout) => {//buscar los ip a partir de la mac
                        let arp = stdout;
                        let cantClients = parseInt(out[15].split(':')[1].trim());
                        let loopUntil = 15 + cantClients;
                        let clients = {};
                        for (let j = 16; j <= loopUntil; j++) {
                            let match = out[j].match(/.{2}:.{2}:.{2}:.{2}:.{2}:.{2}/);
                            if (arp && match.length) {
                                let mac = match[0].replace(/:/g, '-');
                                let macIndexInArp = arp.indexOf(mac);
                                if (macIndexInArp !== -1) {
                                    clients[mac] = arp.substr(macIndexInArp - 24, 24).trim(); //{mac:ip}
                                    // if(!clients[mac]){
                                    //     clients[mac] = {
                                    //         ip: arp.substr(macIndexInArp - 24, 24).trim(),
                                    //         connectedAt: Date.now()
                                    //     }//{mac: {ip, connectedAt}}
                                    // }
                                }
                            }
                        }
                        return cb({
                            ssid, status, authentication, cipher, password, cantClients, clients
                        });
                    });
                }
                else {
                    return cb({
                        ssid, status, authentication, cipher, password, cantClients: 0, clients: {}
                    });
                }
            });
        });
    },
    enableWifi(ssid, password, cb) {
        exec(`netsh wlan set hostednetwork mode=allow ssid=${ssid} key=${password}`, (err, stdout, stderr) => {
            debug(err, stderr);
            return cb(err, stdout, stderr)
        });
    },
    startWifi(cb){
        exec("netsh wlan start hostednetwork", (err, stdout, stderr) => {
            debug(err, stdout, stderr);
            return cb(err, stdout, stderr)
        })
    },
    stopWifi(cb){
        exec("netsh wlan stop hostednetwork", (err, stdout, stderr) => {
            debug(err, stdout, stderr);
            return cb(err, stdout, stderr)
        })
    }
}