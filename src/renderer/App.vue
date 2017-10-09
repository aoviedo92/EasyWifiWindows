<template>
    <v-app class="custom-body">
        <title-bar></title-bar>
        <main>
            <!--<v-container fluid class="bc">-->
                <v-tabs id="mobile-tabs-1" grow scroll-bars v-model="active" light >
                    <v-tabs-bar slot="activators">
                        <v-tabs-item :href="'#mobile-tabs-1-hotspot'" >HotSpot</v-tabs-item>
                        <v-tabs-item :href="'#mobile-tabs-1-info'" ripple>Seguridad</v-tabs-item>
                        <v-tabs-item :href="'#mobile-tabs-1-help'" ripple>Ayuda</v-tabs-item>
                        <v-tabs-slider></v-tabs-slider>
                    </v-tabs-bar>
                    <v-tabs-content :id="'mobile-tabs-1-hotspot'" class="bc0">
                        <v-progress-linear v-bind:indeterminate="true" v-show="loadingHotSpot" error height="5" style="margin-top: 0"></v-progress-linear>

                        <hot-spot v-show="!loadingHotSpot"></hot-spot>
                    </v-tabs-content>
                    <v-tabs-content :id="'mobile-tabs-1-info'">
                        <security></security>
                    </v-tabs-content>
                    <v-tabs-content :id="'mobile-tabs-1-help'"> help </v-tabs-content>
                </v-tabs>

            <!--</v-container>-->
        </main>

        <v-footer style="position: fixed; bottom: 0; right: 0"><v-icon fa>users</v-icon><span class="title" style="margin-left: 10px">{{cantUsers}}</span>  </v-footer>
    </v-app>
</template>

<script>
    import TitleBar from './components/TitleBar.vue'
    import HotSpot from './components/tabs/HotSpot.vue'
    import Security from './components/tabs/Security.vue'
    import eventHub from './EventHub';
    export default {
        name: 'EasyWifiWindows',
        components: {TitleBar, HotSpot, Security},
        data () {
            return {
                active: null,
                cantUsers: 0,
                loadingHotSpot: true,
            }
        },
        mounted(){
            eventHub.$on('stop-loading-hot-spot', () => {
                this.loadingHotSpot = false;
            });
            eventHub.$on('info-cant-clients', cantClients => {
                this.cantUsers = cantClients;
            })
        }
    }
</script>

<style>
    .custom-body {
        max-height: 551px;
        overflow: hidden;
    }
    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background: #fff;
    }

    ::-webkit-scrollbar-thumb {
        /*width: 22px;*/
        /*background: -webkit-linear-gradient(left, #547c90, #002640);*/
        /*border: 1px solid #333;*/
        background-color: #d8d8d8;
        box-shadow: inset 1px 0 0 rgba(255, 255, 255, 0.4);
        /*border-radius: 4px;*/
    }
    ::-webkit-scrollbar-thumb:hover{
        background-color: #cccccc;

    }

    .application .theme--light.tabs .tabs__item.tabs__item--active{
        color: #E65100;
    }
    .tabs__slider{
        background: #E65100;
    }
    .tabs__items {
        border: none;
    }
    .bc {
        border: 1px solid black
    }
    .tabs__bar{
        background-color: #FFE0B2;
    }
</style>
