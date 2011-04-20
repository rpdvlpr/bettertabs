(function() {
  /*
  Bettertabs jQuery plugin v0.1

  jQuery(selector).bettertabs(); adds javascript to change content when click on tabs.

  Markup needed, the same that is generated by the rails bettertabs helper, added by the bettertabs plugin
      https://github.com/agoragames/bettertabs

  Events: Each time a tab is selected, some events are fired, so you can easily activate
  behavior from another jquery script (using .bind); The available events are:
      'bettertabs-before-deactivate':   fired on content that is active and will be deactivated
      'bettertabs-before-activate':     fired on content that will be activated
      'bettertabs-before-ajax-loading': fired on content that will be activated and needs ajax loading
      'bettertabs-after-deactivate':    fired on content that was deactivated
      'bettertabs-after-activate':      fired on content that was activated
      'bettertabs-after-ajax-loading':  fired on content after it was loaded via ajax

  */  var $, change_url, content_id_from, show_content_id_attr, tab_type_attr, tab_type_of;
  $ = jQuery;
  tab_type_attr = 'data-tab-type';
  show_content_id_attr = 'data-show-content-id';
  tab_type_of = function($tab_link) {
    return $tab_link.attr(tab_type_attr);
  };
  content_id_from = function($tab_link) {
    return $tab_link.attr(show_content_id_attr);
  };
  change_url = function(url) {
    if ((typeof history != "undefined" && history !== null) && (history.replaceState != null)) {
      return history.replaceState(null, document.title, url);
    }
  };
  $.fn.bettertabs = function() {
    return this.each(function() {
      var mytabs, tabs, tabs_and_contents, tabs_contents, tabs_links;
      mytabs = $(this);
      tabs = mytabs.find('ul.tabs > li');
      tabs_links = mytabs.find('ul.tabs > li > a');
      tabs_contents = mytabs.children('.content');
      tabs_and_contents = tabs.add(tabs_contents);
      return tabs_links.click(function(event) {
        var activate_tab_and_content, previous_active_tab, previous_active_tab_content, this_link, this_tab, this_tab_content;
        this_link = $(this);
        if (tab_type_of(this_link) !== 'link') {
          event.preventDefault();
          this_tab = this_link.parent();
          if (!this_tab.is('.active') && !this_link.is('.ajax-loading')) {
            this_tab_content = tabs_contents.filter("#" + (content_id_from(this_link)));
            previous_active_tab = tabs.filter('.active');
            previous_active_tab_content = tabs_contents.filter('.active');
            activate_tab_and_content = function() {
              tabs_and_contents.removeClass('active').addClass('hidden');
              this_tab.removeClass('hidden').addClass('active');
              this_tab_content.removeClass('hidden').addClass('active');
              previous_active_tab_content.trigger('bettertabs-after-deactivate');
              this_tab_content.trigger('bettertabs-after-activate');
              return change_url(this_link.attr('href'));
            };
            previous_active_tab_content.trigger('bettertabs-before-deactivate');
            this_tab_content.trigger('bettertabs-before-activate');
            if (tab_type_of(this_link) === 'ajax' && !(this_link.data('content-loaded-already') != null)) {
              this_link.addClass('ajax-loading');
              this_tab_content.trigger('bettertabs-before-ajax-loading');
              return this_tab_content.load(this_link.attr('href'), function() {
                this_link.removeClass('ajax-loading');
                this_link.data('content-loaded-already', true);
                this_tab_content.trigger('bettertabs-after-ajax-loading');
                return activate_tab_and_content();
              });
            } else {
              return activate_tab_and_content();
            }
          }
        }
      });
    });
  };
}).call(this);
