<template >
    <v-layout row >
        <v-flex xs12>
            <v-card class="scroll">
                <div id="general-info">
                    <p><span class="sub">Autenticación:</span> {{authentication}}</p>
                    <p><span class="sub">Cifrado:</span> {{cipher}}</p>
                    <p><span class="sub">Máximo número de clientes:</span> {{maxClients}}</p>
                </div>
                <v-divider></v-divider>
                <v-list two-line subheader v-if="Object.keys(clients).length">
                    <v-subheader>Usuarios Conectados</v-subheader>
                    <v-list-item v-for="(ip, mac) in clients" :key="mac">
                        <v-list-tile >
                            <v-list-tile-content>
                                <v-list-tile-title>{{ip}}</v-list-tile-title>
                                <v-list-tile-sub-title>{{mac}}</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>
                </v-list>
                <div id="no-users-connected" v-else>
                    <div>
                    <i class="fa fa-users"></i>
                    <h4>No hay usuarios conectados.</h4>
                    </div>
                </div>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import eventHub from '../../EventHub';

    export default {
        name: 'security',
        data () {
            return {
                maxClients: 20,
                cipher: '',
                authentication: '',
                clients: {},
            }
        },
        mounted(){
            eventHub.$on('info-authentication', authentication => {
                this.authentication = authentication;
            }).$on('info-cipher', cipher => {
                this.cipher = cipher;
            }).$on('info-clients', clients => {
                this.clients = clients
            })
        }
    }
</script>

<style>
    .scroll{
        max-height: 420px;
        overflow: auto;
    }
    div#general-info{
        padding: 5px;
    }
    div#general-info span.sub{
        color: #777;
    }
    div#no-users-connected {
        padding: 15px;
    }
    div#no-users-connected>div{
        color: #777;
        padding: 15px;
        background-color: whitesmoke;
        border-radius: 4px;
        text-align: center;
    }
    div#no-users-connected i {
        font-size: 100px;
    }
</style>
