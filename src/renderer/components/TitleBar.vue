<template>
    <v-toolbar class="amber darken-4" light>
        <!--<v-toolbar-side-icon light @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>-->
        <v-toolbar-title class="titlebar">EasyWifiWindows</v-toolbar-title>
        <v-spacer style="height: 100%;" class="titlebar"></v-spacer>
        <v-btn icon light @click.native="minimizeApp()">
            <v-icon>remove</v-icon>
        </v-btn>
        <v-btn icon light @click.native="closeApp()">
            <v-icon>close</v-icon>
        </v-btn>

    </v-toolbar>
</template>

<script>

    export default {
        methods: {
            closeApp () {
                this.$electron.remote.getCurrentWindow().close()
            },
            minimizeApp(){
                this.$electron.remote.getCurrentWindow().minimize()
            }
        }
    }
</script>

<style>
    .titlebar {
        -webkit-app-region: drag;
    }
    .application .theme--light.toolbar{
        color: #fff;
    }
    .toolbar__title{
        font-weight: 100;

    }
</style>
