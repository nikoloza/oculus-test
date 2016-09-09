'use strict'

import 'normalize-css'
import './index.css'

import angular from 'angular'
import { MainCtrl } from './controller'
import { DataService } from './service'
import { ChartDirective } from './directive'

angular.module('oculus', [])
  .controller('mainCtrl', MainCtrl)
  // eslint-disable-next-line new-parens
  .directive('chart', () => new ChartDirective)
  .service('dataService', DataService)
