'use strict'

import 'normalize-css'
import './index.css'

import angular from 'angular'
import { DataService } from './service'
import { ChartDirective } from './directive'

angular.module('oculus', [])
  // eslint-disable-next-line new-parens
  .directive('forceDirectedGraph', () => new ChartDirective)
  .service('dataService', DataService)
