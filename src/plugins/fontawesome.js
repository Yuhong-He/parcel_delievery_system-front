import Vue from "vue";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
    faUser
} from '@fortawesome/free-solid-svg-icons';

import {

} from '@fortawesome/free-regular-svg-icons';

import {

} from '@fortawesome/free-brands-svg-icons';

library.add(faUser);

Vue.component('font-awesome-icon', FontAwesomeIcon);
