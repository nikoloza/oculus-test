'use strict'

import 'normalize-css'
import './style.css'

import angular from 'angular'
import ngMockE2E from 'angular-mocks'
import { DataService } from './service'
import { ChartDirective } from './directive'
import { MainCtrl } from './controller'
import { httpBackend } from './backend'

const APP_NAME = 'oculus'
const APP = angular.module(APP_NAME, ['ngMockE2E'])
  .run(httpBackend)
  .service('dataService', DataService)
  .directive('forceDirectedGraph', ChartDirective.directiveFactory)
  .controller('mainCtrl', MainCtrl)

angular.element(document).ready(() => {
  angular.bootstrap(document, [ APP_NAME ])
})

export { APP_NAME, APP }
