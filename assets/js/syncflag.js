/**
 * @file
 *  SyncFlag JavaScript.
 */

(function($) {
  Drupal.behaviors.syncflag = {
    attach: function(context, settings) {

      var $body = $('body.syncflag', context);
      if (!$body.length || $body.hasClass('syncflag-processed')) {
        return;
      }

      $body.prepend($('<div id="syncflag"></div>')).addClass('syncflag-processed');
      var $el = $body.find('div#syncflag');
      $(document).on('click', 'div#syncflag a.link', function(e) {
        e.preventDefault();
        status(true);
      });

      status();

      /**
       * Update status of the flag.
       *
       * @param toggle
       *   Whether the status needs to be toggled.
       */
      function status(toggle) {
        var toggle = toggle || 0;
        var command = toggle ? 'toggle' : 'view';
        var params = {
          c: command
        };
        $el.addClass('working');
        xhr(params, render);
      }

      /**
       * Render status of the flag.
       *
       * @param data
       *   Data response to use to update from.
       */
      function render(data) {
        var content = '';
        if (data.s) {
          content = '<a href="#" title="Ready to sync." class="link sf-icon-checkmark"></a>';
        }
        else {
          content = '<a href="#" title="Work in progess, do not sync." class="link sf-icon-cross"></a>';
        }
        $el.html(content);
        $el.removeClass('working');
      }

      /**
       * Send xhr to the server.
       *
       * @param params
       *   Parameters to be passed with the xhr.
       * @param callback
       *   Callback.
       */
      function xhr(params, callback) {
        var xhr = new XMLHttpRequest();
        params = params || {};
        params_string = '?';
        var params_parts = [];
        for (var i in params) {
          params_parts.push((i + '=' + params[i]));
        }
        params_string += params_parts.join('&');
        xhr.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status === 200) {
              var data = {};
              try {
                data = JSON.parse(xhr.responseText);
              }
              catch (e) {
                console.log(e);
              }
              callback(data);
            }
            else {
              console.log('Error: ' + xhr.responseText);
            }
          }
        };
        xhr.open('POST', '/syncflag/ajax' + params_string);
        xhr.send();
      };


    }
  };

})(jQuery);
