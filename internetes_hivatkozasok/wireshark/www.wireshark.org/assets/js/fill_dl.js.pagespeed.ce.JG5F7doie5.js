// fill_dl.js
// Requires scripts jQuery + Bootstrap
// Requires variables stable_ver, oldstable_ver, development_ver

//var dl_arrow = '<img src="/image/dlarrow.png">';
//var dl_arrow = '<i class="glyphicon glyphicon-download"></i>';
var dl_arrow = '<i class="fa fa-download"></i>';
var total_weight = 0;
var rand_weight = 0;
var cur_weight = 0;

function weighted_random_location() {

  for (i = 0; i < locations.length; i++) {
    total_weight += locations[i]['weight'];
  }
  rand_weight = Math.floor(total_weight * Math.random());

  for (i = 0; i < locations.length; i++) {
    cur_weight += locations[i]['weight'];

    if (cur_weight > rand_weight) {
      break;
    }
  }

  return locations[i];
}

var wr_loc = weighted_random_location();

function name_sort(a, b) {
    return ( a.name.toLowerCase() > b.name.toLowerCase() );
}
function fill_mirrors(stable_ver, oldstable_ver, development_ver) {
    var mirrorContent = '';

    if (locations.length < 1) {
        return;
    }

    var exe_url = wr_loc['url'] + '/win32/Wireshark-win32-' + stable_ver + '.exe';
    var exe64_url = wr_loc['url'] + '/win64/Wireshark-win64-' + stable_ver + '.exe';
    var u3p_url = wr_loc['url'] + '/win32/Wireshark-' + stable_ver + '.u3p';
    var paf_url = wr_loc['url'] + '/win32/WiresharkPortable-' + stable_ver + '.paf.exe';
    var loc_name = dl_arrow + ' ' + wr_loc['name'];

    // Download link on front page
    var el = document.getElementById('fill_dl_fp');
    if (el) {
        el.href = exe_url;
    }

    // Icon on front page
    var el = document.getElementById('fill_icon_fp');
    if (el) {
        el.href = exe_url;
    }

    // Left menu link on all pages
    var el = document.getElementById('fill_dl_lm');
    if (el) {
        el.href = exe_url;
    }

    // Windows exe on download page
    var el = document.getElementById('fill_dl_winexe');
    if (el) {
        el.href = exe_url;
        el.innerHTML = loc_name;
    }

    // Windows64 exe on download page
    var el = document.getElementById('fill_dl_win64exe');
    if (el) {
        el.href = exe64_url;
        el.innerHTML = loc_name;
    }

    // Windows paf on download page
    var el = document.getElementById('fill_dl_winpaf');
    if (el) {
        el.href = paf_url;
        el.innerHTML = loc_name;
    }

    // Windows download list on download page
    var el = document.getElementById('fill_dl_full');
    if (el) {
        for (i = 0; i < locations.length; i++) {
            mirrorContent += '<li><a href="' + locations[i]['url'] + '">' +
                locations[i]['name'] + '</a></li>\n';

        }
        el.innerHTML = mirrorContent;
    }
}

// Figure out the client platform
// http://msdn.microsoft.com/en-us/library/ms537503.aspx
// http://www.useragentstring.com
// http://www.tech-archive.net/Archive/Scripting/microsoft.public.scripting.jscript/2004-11/0404.html
// http://owenbrady.net/browsercaps/default.aspx
// http://blogs.msdn.com/askie/archive/2007/05/11/understanding-the-ie-user-agent-string.aspx
// Chrome Windows 7 64 UA:  Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/532.0 (KHTML, like Gecko) Chrome/3.0.195.33 Safari/532.0
// Chrome Windows XP 32 UA: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/532.0 (KHTML, like Gecko) Chrome/3.0.195.33 Safari/532.0
// FF Windows 7 64 UA:  Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.4) Gecko/20091016 Firefox/3.5.4
// FF Windows XP 32 UA: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.15) Gecko/2009101601 Firefox/3.0.15 (.NET CLR 3.5.30729)
// Safari OS X 10.9: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.76.4 (KHTML, like Gecko) Version/7.0.4 Safari/537.76.4
// Safari OS X 10.10: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10) AppleWebKit/538.37 (KHTML, like Gecko) Version/8.0 Safari/538.37
// Chrome OS X 10.9:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36
// Chrome OS X 10.10: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36
// Firefox OS X 10.9: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:24.0) Gecko/20100101 Firefox/24.0
// Firefox OS X 10.10: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:29.0) Gecko/20100101 Firefox/29.0
var platform = 'Unknown';
function find_platform() {
  ua = navigator.userAgent;

  if (ua.search(/Win64; x64;/i) >= 0 || ua.search(/WOW64/i) >= 0) {
    platform = 'win64';
  } else if (ua.search(/Intel Mac OS X 10.([6-9]|1[0-9])/i) >= 0) {
    platform = 'macintel64';
  } else if (navigator.platform) {
    platform = navigator.platform.toLowerCase();
  }
};

//function rand_sort(a, b) {
//    return ( (Math.random() * b["weight"]) - (Math.random() * a["weight"]) );
//}

// Deprecated -- use update_dl_elements instead.
function fill_dl_box(stable_ver, oldstable_ver, development_ver) {
    // Download page menu tree
    var dl_tree = {
      'stable-rel': {
        'name': 'Stable Release (' + stable_ver + ')',
        'add_prefix': true,
        'tbcontent': {
          'win64': {
            'name': 'Windows Installer (64-bit)',
            'url': '/win64/Wireshark-win64-' + stable_ver + '.exe'
          },
          'win32': {
            'name': 'Windows Installer (32-bit)',
            'url': '/win32/Wireshark-win32-' + stable_ver + '.exe'
          },
          'win32papps': {
            'name': 'Windows PortableApps&reg; (32-bit)',
            'url': '/win32/WiresharkPortable-' + stable_ver + '.paf.exe'
          },

          'macintel64': {
            'name': 'OS X 10.6 and later Intel 64-bit .dmg',
            'url': '/osx/Wireshark ' + stable_ver + ' Intel 64.dmg'
          },
          'macintel': {
            'name': 'OS X 10.6 and later Intel 32-bit .dmg',
            'url': '/osx/Wireshark ' + stable_ver + ' Intel 32.dmg',
          },

          'source': {
            'name': 'Source Code',
            'url': '/src/wireshark-' + stable_ver + '.tar.bz2'
          }
        }
      },

      'oldstable-rel': {
        'name': 'Old Stable Release (' + oldstable_ver + ')',
        'add_prefix': true,
        'tbcontent': {
          'win64': {
            'name': 'Windows Installer (64-bit)',
            'url': '/win64/Wireshark-win64-' + oldstable_ver + '.exe'
          },
          'win32': {
            'name': 'Windows Installer (32-bit)',
            'url': '/win32/Wireshark-win32-' + oldstable_ver + '.exe'
          },
          'win32u3p': {
            'name': 'Windows U3 (32-bit)',
            'url': '/win32/Wireshark-' + oldstable_ver + '.u3p'
          },
          'win32papps': {
            'name': 'Windows PortableApps&reg; (32-bit)',
            'url': '/win32/WiresharkPortable-' + oldstable_ver + '.paf.exe'
          },

          'macintel64': {
            'name': 'OS X 10.6 and later Intel 64-bit .dmg',
            'url': '/osx/Wireshark ' + oldstable_ver + ' Intel 64.dmg'
          },
          'macintel': {
            'name': 'OS X 10.5 and later Intel 32-bit .dmg',
            'url': '/osx/Wireshark ' + oldstable_ver + ' Intel 32.dmg',
          },

          'source': {
            'name': 'Source Code',
            'url': '/src/wireshark-' + oldstable_ver + '.tar.bz2'
          }
        }
      },

      'development-rel': {
        'name':   'Development Release (' + development_ver + ')',
        'add_prefix': true,
        'tbcontent': {
          'win64': {
            'name': 'Windows Installer (64-bit)',
            'url': '/win64/Wireshark-win64-' + development_ver + '.exe'
          },
          'win32': {
            'name': 'Windows Installer (32-bit)',
            'url': '/win32/Wireshark-win32-' + development_ver + '.exe'
          },
          'win32papps': {
            'name': 'Windows PortableApps&reg;',
            'url': '/win32/WiresharkPortable_' + development_ver + '.paf.exe'
          },

          'macintel64': {
            'name': 'OS X 10.6 and later Intel 64-bit .dmg',
            'url': '/osx/Wireshark ' + development_ver + ' Intel 64.dmg'
          },
          'macintel': {
            'name': 'OS X 10.5 and later Intel 32-bit .dmg',
            'url': '/osx/Wireshark ' + development_ver + ' Intel 32.dmg'
          },

          'source': {
            'name': 'Source Code',
            'url': '/src/wireshark-' + development_ver + '.tar.bz2'
          }
        }
      },

      'documentation': {
        'name':   'Documentation',
        'add_prefix': false,
        'tbcontent': {
          'wsug_html_multi': {
            'name': 'Online (Multiple Pages)',
            'url': '/docs/wsug_html_chunked/'
          },
          'wsug_html_single': {
            'name': 'Online (Single Page)',
            'url': '/docs/wsug_html/'
          },
          'wsug_pdf_us': {
            'name': 'U.S. PDF',
            'url': '/download/docs/user-guide-us.pdf'
          },
          'wsug_pdf_a4': {
            'name': 'A4 PDF',
            'url': '/download/docs/user-guide-a4.pdf'
          },
          'wsug_chm': {
            'name': 'Windows HTML Help',
            'url': '/download/docs/user-guide.chm'
          },
          'all': {
            'name': 'All Documentation',
            'url': '/docs/'
          }
        }
      }
    };

    // Uncomment if Old Stable is EOLed.
    delete dl_tree['oldstable-rel'];

    //locations.sort(rand_sort);
    url_pfx = wr_loc['url'];

    var acc_html = '';
    var acc_in = ' in'
    var acc_active = ' active'
    var activate_header = 0;

    if (document.location.hash == "#oldstable-release") {
        activate_header = 1;
    } else if (document.location.hash == "#development-release") {
        activate_header = 2;
    } else if (document.location.hash == "#documentation") {
        activate_header = 3;
    }

    acc_html += '<div class="accordion" id="dl-accordion">\n';
    $.each(dl_tree, function(acc_key, acc_val){
        var acc_id = 'accordion_' + acc_key;
        var prefix = '';
        if (acc_val.add_prefix) {
          prefix = url_pfx;
        }
        acc_html += '  <div class="accordion-group">\n';
        acc_html += '    <div class="accordion-heading' + acc_active + '" id="' + acc_key + '-heading">\n';
        acc_html += '      <a class="accordion-toggle" data-parent="#dl-accordion" data-toggle="collapse" href="#' + acc_key + '">' + acc_val.name +'</a>';
        acc_html += '    </div>\n';
        acc_html += '    <div class="accordion-body collapse' + acc_in + '" id="' + acc_key + '">\n';
        acc_html += '      <div class="accordion-inner">\n';

        acc_html += '<ul class="list-unstyled">\n';
        $.each(acc_val.tbcontent, function(tc_key, tc_val){
            var url_path = tc_val.url;
            if (prefix.toLowerCase().match('sourceforge')) {
              url_path = tc_val.url.replace(/^\/[a-z0-9]+\//i, '/');
            }
            if (tc_key == platform) {
                this_platform = 'this-platform';
            } else {
                this_platform = '';
            }
            acc_html += '  <li class="' + this_platform + '"><a href="' + prefix + url_path + '">' +
                tc_val.name + '</a></li>\n';
            if (typeof tc_val.extra != 'undefined') {
              acc_html += '  <li>' + tc_val.extra + '</li>\n';
            }
        });
        acc_html += '</ul>\n';

        acc_html += '      </div>\n';
        acc_html += '    </div>\n';
        acc_html += '  </div>\n';
        acc_in = acc_active = '';
    });
    acc_html += '</div>\n';

    $("#dl_box").html(acc_html);
//    $("#stable-rel").collapse('show');

};

function update_dl_elements(selector, url_pfx) {
  var re = new RegExp(url_pfx, 'gm');
  $(selector).each(function() {
    var pre_html = $(this).html();
    var post_html = pre_html.replace(re, wr_loc['url']);
    $(this).html(post_html);

    var platform_selector = ".dl_arrow#" + platform;
    if ($(platform_selector).length) {
      $(platform_selector).html(dl_arrow);
    }
  });
}

function fill_dl_mirrors() {
  var mirr_html = '<ul class="item-list">\n';
  locations.sort(name_sort);
  $.each(locations, function(loc) {
    mirr_html += '<li><a href="' + locations[loc].url + '">' + locations[loc].name + '</a></li>';
  });
  mirr_html += '</ul>\n';
  $("#dl_mirrors").html(mirr_html);
};

// ...and away we go!
$(document).ready(function(){
  find_platform();
});
