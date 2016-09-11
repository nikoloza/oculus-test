'use strict'

import 'normalize-css'
import './style.css'

import angular from 'angular'
import { DataService } from './service'
import { ChartDirective } from './directive/chart'

const APP_NAME = 'oculus'
const LOAD_DELAY = 2400
const APP = angular.module(APP_NAME, [])
  .service('dataService', DataService)
  // eslint-disable-next-line new-parens
  .directive('forceDirectedGraph', ChartDirective.directiveFactory)

angular.element(document).ready(() => {
  angular.bootstrap(document, [ APP_NAME ])
})

export { APP_NAME, LOAD_DELAY, APP }
