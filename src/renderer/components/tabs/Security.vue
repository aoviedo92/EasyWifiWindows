<template >
    <v-layout row >
        <v-flex xs12>
            <v-card class="scroll">
                <v-list two-line subheader>
                    <v-subheader>General</v-subheader>
                    <v-list-item>
                        <v-list-tile avatar>
                            <v-list-tile-content>
                                <v-list-tile-sub-title>Autenticación</v-list-tile-sub-title>
                                <v-list-tile-title>{{authentication}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>
                    <v-list-item>
                        <v-list-tile avatar>
                            <v-list-tile-content>
                                <v-list-tile-sub-title>Cifrado</v-list-tile-sub-title>
                                <v-list-tile-title>{{cipher}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>
                    <v-list-item>
                        <v-list-tile avatar>
                            <v-list-tile-content>
                                <v-list-tile-sub-title>Máximo número de clientes</v-list-tile-sub-title>
                                <v-list-tile-title>{{maxClients}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list two-line subheader>
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
</style>
