<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">Welcome to the Vuetify + Nuxt.js template</v-card-title>
        <v-card-text>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat nuxt to="/login">Log In</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat nuxt to="/admin">Admin</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
