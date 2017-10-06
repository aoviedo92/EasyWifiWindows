<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-text-field
                    v-model="ssid"
                    label="Nombra tu wifi"
                    single-line
                    prepend-icon="wifi"
            ></v-text-field>
        </v-layout>
        <v-layout row wrap>
            <v-text-field
                    label="Protege tu wifi"
                    single-line
                    prepend-icon="lock"
                    v-model="password"
                    min="8"
                    :append-icon="e1 ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="appendIconCb"
                    :type="e1 ? 'password' : 'text'"
                    counter
                    hint="Al menos 8 caracteres"
            ></v-text-field>
        </v-layout>


        <div class="text-xs-center">
            <v-btn outline large
                   light
                   secondary
                   :loading="loading"
                   @click.native="wifiStatus ? stopWifi() : initWifi()"
                   :disabled="loading"
            > {{btnText}}
            </v-btn>
        </div>

        <v-snackbar
                :error="snackbar.context === 'error'"
                :timeout="snackbar.timeout"
                :success="snackbar.context === 'success'"
                :warning="snackbar.context === 'warning'"
                :multi-line="true"
                v-model="snackbar.show">
            {{ snackbar.text }}
        </v-snackbar>

    </v-container>
</template>

<script>
    const exec = require('child_process').exec;
    const jetpack = require('fs-jetpack');
//    const Status = {
//        'NOT_AVAILABLE': ['Not available', 'No disponible'],
//        'NOT_INIT': ['Not started', 'No iniciado'],
//        'INIT': ['Started', 'Iniciado'],
//    };
    import eventHub from '../../EventHub';
    let windows1252 = require('windows-1252');
    let storedData;
    const fileData = './datastored.json';
    //    wifiSecuritySettings
    export default {
        name: 'hot-spot',
        data () {
            return {
                e1: false,
                password: '',
                ssid: '',
                loading: false,
                wifiStatus: 0, // 0/1 on/off
                snackbar: {
                    context: 'primary',
                    show: false,
                    timeout: 6000,
                    text: ''
                },
                statusNotAvailable: false,
                passwordChanged: false,
                ssidChanged: false,
            }
        },
        computed: {
            btnText(){
                return this.wifiStatus ? "Detener" : "Iniciar"
            }
        },
        methods: {
            appendIconCb(){
                this.e1 = !this.e1;
                storedData.e1 = this.e1;
                jetpack.write(fileData, storedData);
            },
            starWifi(){
                console.log('starWifi');
                return new Promise((resolve, reject) => {
                    let cmd = 'netsh wlan start hostednetwork';
                    console.info(cmd);
                    const starWifiCmd = exec(cmd, {encoding: 'utf-8'}, (err, stdout, stderr) => {
                        err && reject(windows1252.decode(stdout));
//                        stderr && console.error('stderr', stderr);
//                        console.log('stdout', windows1252.encode(stdout));
                        resolve(stdout)
                    });
                    starWifiCmd.on('close', (code) => {
                        console.log('child process exited with code ' + code);
                        this.loading = false;

                        if (code === 0){
                            this.wifiStatus = 1;
                        }
                    });
                })
            },
            enableWifi(){
                console.log('enableWifi');
                return new Promise((resolve, reject) => {
                    if (!this.statusNotAvailable && !this.passwordChanged && !this.ssidChanged)
                        return resolve();
                    let cmd = `netsh wlan set hostednetwork mode=allow ssid=${this.ssid} key=${this.password}`
                    console.info(cmd);
                    exec(cmd, (err, stdout, stderr) => {
                        if (err) {
                            reject(err);
                        }
                        this.passwordChanged = false;
                        this.ssidChanged = false;
                        resolve(stdout)
                    })
                })
            },
            initWifi(){
                console.log('initWifi');
                this.loading = true;
                this.enableWifi().then(
                    this.starWifi
                ).then(stdout => {
                    console.log(stdout);
                    this.snackBar('success', stdout)
                }).catch(err => {
                    console.error(err);
                    this.snackBar('error', err, 12000)
                })
            },
            stopWifi(){
                console.log('detener wifi');
                this.loading = true;
                let cmd = 'netsh wlan stop hostednetwork';
                console.info(cmd);
                let stopWifiCmd = exec(cmd, (err, stdout, stderr) => {
                    if (err){
                        console.error(err);
                        this.snackBar('error', err, 12000)
                    }else {
                        console.log(stdout);
                        this.snackBar('success', stdout)
                    }
                });
                stopWifiCmd.on('close', (code) => {
                    console.log('child process exited with code ' + code);
                    this.loading = false;

                    if (code === 0){
                        this.wifiStatus = 0;
                    }
                });
            },
            snackBar(context, msg, timeout=6000){
                this.snackbar.context = context;
                this.snackbar.text = msg;
                this.snackbar.show = true;
                this.snackbar.timeout = timeout;
            },
        },
        mounted(){
            eventHub.$on('wifi-password', password => {
                this.password = password;
            }).$on('wifi-ssid', ssid => {
                this.ssid = ssid
            }).$on('wifi-status-not-available', () => {
                this.statusNotAvailable = true;
            }).$on('wifi-status', wifiStatus => {
                this.wifiStatus = wifiStatus;
            });
            storedData = jetpack.read(fileData, 'json');
//            console.log('storedData',storedData);
            if (!storedData){
                storedData = {e1: false};
                jetpack.write(fileData, storedData);
                this.e1 = false;
            }else {
                this.e1 = storedData.e1;
            }
        },
        watch: {
            password(n, o){
                if(n && o){
                    console.log('password changed');
                    this.passwordChanged = true;
                }
            },
            ssid(n, o){
                if(n && o){
                    console.log('ssid changed');
                    this.ssidChanged = true;
                }
            },


        },
    }
</script>

<style>

</style>
