/*
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */
/*!
#set ($liveDataEntry = 'xwiki-livedata.umd.min')
#set ($liveDataPath = $services.webjars.url('org.xwiki.platform:xwiki-platform-livedata-webjar', $liveDataEntry))
#set ($liveDataBasePath = $stringtool.removeEnd($liveDataPath, $liveDataEntry))
#set ($evaluate = {'evaluate': true})
*/
require.config({
  paths: {
    Logic: $jsontool.serialize($services.webjars.url('org.xwiki.platform:xwiki-platform-livedata-webjar',
      'Logic.min')),
    liveDataSource: $jsontool.serialize($services.webjars.url('org.xwiki.platform:xwiki-platform-livedata-webjar',
      'liveDataSource.min.js', $evaluate)),
    Vue: $jsontool.serialize($services.webjars.url('vue', 'vue.min')),
    'xwiki-livedata': $jsontool.serialize($liveDataPath),
    // Required by the date filter.
    moment: $jsontool.serialize($services.webjars.url('momentjs', 'moment.js')),
    daterangepicker: $jsontool.serialize($services.webjars.url('bootstrap-daterangepicker',
      'js/bootstrap-daterangepicker.js')),
    // Required by the suggest filter.
    'xwiki-selectize': $jsontool.serialize($xwiki.getSkinFile('uicomponents/suggest/xwiki.selectize.js', true))
  },
  map: {
    '*': {
      daterangepicker: 'daterangepicker-with-css',
      'xwiki-selectize': 'xwiki-selectize-with-css'
    },
    'daterangepicker-with-css': {
      daterangepicker: 'daterangepicker'
    },
    'xwiki-selectize-with-css': {
      'xwiki-selectize': 'xwiki-selectize'
    }
  }
});

define('loadCSS', function() {
  var loadCSS = function(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
  };

  return (url) => {
    var urls = Array.isArray(url) ? url : [url];
    urls.forEach(loadCSS);
  };
});

define('daterangepicker-with-css', ['loadCSS', 'daterangepicker'], function(loadCSS) {
  // Load the CSS for the date range picker.
  loadCSS($jsontool.serialize($services.webjars.url('bootstrap-daterangepicker', 'css/bootstrap-daterangepicker.css')));
});

define('xwiki-selectize-with-css', ['loadCSS', 'xwiki-selectize'], function(loadCSS) {
  // Load the CSS for the suggest picker.
  loadCSS([
    $jsontool.serialize($services.webjars.url('selectize.js', 'css/selectize.bootstrap3.css')),
    $jsontool.serialize($xwiki.getSkinFile('uicomponents/suggest/xwiki.selectize.css', true))
  ]);
});

window.liveDataBaseURL = $jsontool.serialize($liveDataBasePath);

require(['jquery', 'Logic'], function($, LiveData) {
  "use strict";

  $.fn.liveData = function(config) {
    return this.each(function() {
      if (!$(this).data('liveData')) {
        var instanceConfig = $.extend($(this).data('config'), config);
        $(this).attr('data-config', JSON.stringify(instanceConfig)).data('liveData', LiveData(this));
      }
    });
  };

  var init = function(event, data) {
    var container = $((data && data.elements) || document);
    container.find('.liveData').liveData();
  };

  $(document).on('xwiki:dom:updated', init);
  $(init);
});
